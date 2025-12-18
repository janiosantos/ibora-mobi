from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.core.database import get_db
from app.api.deps import get_current_user
from app.modules.auth.models.user import User
from app.modules.finance.models.payment_method import PaymentMethod
from app.schemas.payment import AddPaymentMethodRequest, PaymentMethodResponse
from app.services.payment.stripe_client import stripe_client
from app.services.payment.stripe_customer_service import StripeCustomerService
from app.services.payment.card_validator import CardValidator
from app.services.payment.mercadopago_client import mercadopago_client
from typing import List, Optional
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("", response_model=PaymentMethodResponse, status_code=status.HTTP_201_CREATED)
async def add_payment_method(
    request: AddPaymentMethodRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Add credit/debit card
    
    Frontend must tokenize card with Stripe.js:
    ```javascript
    const {token} = await stripe.createToken(card);
    // Send token.id to this endpoint
    ```
    """
    
    try:
        if request.provider == "mercadopago":
            # --- MERCADO PAGO FLOW ---
            
            # 1. Get or create MP Customer
            if not current_user.mercadopago_customer_id:
                mp_customer = mercadopago_client.create_customer(
                    email=current_user.email,
                    first_name=current_user.email.split("@")[0], # Fallback
                    phone=current_user.phone
                )
                current_user.mercadopago_customer_id = mp_customer["id"]
                db.add(current_user)
                await db.flush() # Ensure ID is saved if concurrent
            
            # 2. Save Card (Token -> Customer Card)
            # Frontend sends "token" created by MP SDK
            card_data = mercadopago_client.save_card(
                customer_id=current_user.mercadopago_customer_id,
                token=request.card_token
            )
            
            # 3. Validation: Check duplicate card ID in MP Context?
            # MP returns 'id' of the card.
            stmt = select(PaymentMethod).where(
                PaymentMethod.mercadopago_card_id == card_data["id"]
            )
            result = await db.execute(stmt)
            existing = result.scalars().first()
            if existing:
                raise HTTPException(status_code=400, detail="Card already added")
            
            # 4. Extract details
            pm_id_val = card_data["id"] 
            brand = card_data.get("payment_method", {}).get("id", "unknown") # e.g. 'visa'
            last4 = card_data.get("last_four_digits", "0000")
            exp_month = card_data.get("expiration_month")
            exp_year = card_data.get("expiration_year")
             
            # Create Record
            stmt_count = select(PaymentMethod).where(PaymentMethod.user_id == current_user.id)
            result_count = await db.execute(stmt_count)
            first_card = len(result_count.scalars().all()) == 0
            is_default = request.set_as_default or first_card
            
            if is_default:
                 stmt_update = (
                    update(PaymentMethod)
                    .where(PaymentMethod.user_id == current_user.id, PaymentMethod.is_default == True)
                    .values(is_default=False)
                )
                 await db.execute(stmt_update)

            pm = PaymentMethod(
                user_id=current_user.id,
                mercadopago_card_id=str(pm_id_val),
                provider='mercadopago',
                card_brand=brand,
                card_last4=last4,
                card_exp_month=exp_month,
                card_exp_year=exp_year,
                is_default=is_default,
                is_active=True
            )

        else:
            # --- STRIPE FLOW (Default) ---
            # Get or create Stripe customer (Async)
            customer_id = await StripeCustomerService.get_or_create_customer(current_user, db)
            
            # Create payment method in Stripe
            payment_method = stripe_client.create_payment_method(
                card_token=request.card_token,
                customer_id=customer_id
            )
            
            # Extract card details
            card = payment_method.get("card", {})
            
            # Check if card already exists
            stmt = select(PaymentMethod).where(
                PaymentMethod.stripe_payment_method_id == payment_method["id"]
            )
            result = await db.execute(stmt)
            existing = result.scalars().first()
            if existing:
                raise HTTPException(status_code=400, detail="Card already added")
            
            # Manage Defaults
            stmt_count = select(PaymentMethod).where(PaymentMethod.user_id == current_user.id)
            result_count = await db.execute(stmt_count)
            first_card = len(result_count.scalars().all()) == 0
            is_default = request.set_as_default or first_card
            
            if is_default:
                 stmt_update = (
                    update(PaymentMethod)
                    .where(PaymentMethod.user_id == current_user.id, PaymentMethod.is_default == True)
                    .values(is_default=False)
                )
                 await db.execute(stmt_update)
            
            # Create payment method record
            pm = PaymentMethod(
                user_id=current_user.id,
                stripe_customer_id=customer_id,
                stripe_payment_method_id=payment_method["id"],
                provider='stripe',
                card_brand=card.get("brand", "unknown"),
                card_last4=card.get("last4", "0000"),
                card_exp_month=card.get("exp_month", 1),
                card_exp_year=card.get("exp_year", 2030),
                card_funding=card.get("funding"),
                is_default=is_default,
                is_active=True
            )
        
        db.add(pm)
        await db.commit()
        await db.refresh(pm)
        
        logger.info(
            f"Payment method added: user_id={current_user.id}, "
            f"pm_id={pm.id}, provider={pm.provider}"
        )
        
        return pm
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to add payment method: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to add card: {str(e)}"
        )

@router.get("", response_model=List[PaymentMethodResponse])
async def list_payment_methods(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's payment methods"""
    
    stmt = (
        select(PaymentMethod)
        .where(
            PaymentMethod.user_id == current_user.id,
            PaymentMethod.is_active == True
        )
        .order_by(PaymentMethod.is_default.desc(), PaymentMethod.created_at.desc())
    )
    
    result = await db.execute(stmt)
    methods = result.scalars().all()
    
    # Check expiration dynamically if needed, but returning DB object is fine with schema
    return methods

@router.delete("/{payment_method_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_payment_method(
    payment_method_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove payment method"""
    
    stmt = select(PaymentMethod).where(
        PaymentMethod.id == payment_method_id,
        PaymentMethod.user_id == current_user.id
    )
    result = await db.execute(stmt)
    pm = result.scalars().first()
    
    if not pm:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    # Mark as inactive (don't delete for history)
    pm.is_active = False
    
    was_default = pm.is_default
    pm.is_default = False
    
    db.add(pm)
    
    # If was default, set another as default
    if was_default:
        stmt_next = (
            select(PaymentMethod)
            .where(
                PaymentMethod.user_id == current_user.id,
                PaymentMethod.is_active == True,
                PaymentMethod.id != pm.id
            )
            .order_by(PaymentMethod.created_at.desc())
        )
        result_next = await db.execute(stmt_next)
        next_pm = result_next.scalars().first()
        
        if next_pm:
            next_pm.is_default = True
            db.add(next_pm)
            
    await db.commit()

@router.put("/{payment_method_id}/set-default", response_model=PaymentMethodResponse)
async def set_default_payment_method(
    payment_method_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Set payment method as default"""
    
    stmt = select(PaymentMethod).where(
        PaymentMethod.id == payment_method_id,
        PaymentMethod.user_id == current_user.id,
        PaymentMethod.is_active == True
    )
    result = await db.execute(stmt)
    pm = result.scalars().first()
    
    if not pm:
        raise HTTPException(status_code=404, detail="Payment method not found")
    
    is_valid, error = CardValidator.validate_for_payment(pm)
    if not is_valid:
         raise HTTPException(status_code=400, detail=error)
    
    # Unset other defaults
    stmt_unset = (
        update(PaymentMethod)
        .where(PaymentMethod.user_id == current_user.id, PaymentMethod.is_default == True)
        .values(is_default=False)
    )
    await db.execute(stmt_unset)
    
    # Set as default
    pm.is_default = True
    db.add(pm)
    
    await db.commit()
    await db.refresh(pm)
    
    logger.info(f"Default payment method changed: user_id={current_user.id}, pm_id={pm.id}")
    
    return pm
