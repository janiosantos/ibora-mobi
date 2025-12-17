"""update ride status constraints

Revision ID: df3c4d3527fb
Revises: a7270428583e
Create Date: 2025-12-17 12:15:14.674230

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'df3c4d3527fb'
down_revision: Union[str, None] = 'a7270428583e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop old constraint
    op.drop_constraint('valid_ride_status', 'rides', type_='check')
    
    # Data migration: STARTED -> IN_PROGRESS
    op.execute("UPDATE rides SET status = 'IN_PROGRESS' WHERE status = 'STARTED'")
    
    # Create new constraint
    op.create_check_constraint(
        'valid_ride_status',
        'rides',
        "status IN ('REQUESTED', 'SEARCHING', 'OFFERED', 'ACCEPTED', 'DRIVER_ARRIVING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')"
    )

def downgrade() -> None:
    # Revert to old constraint
    op.drop_constraint('valid_ride_status', 'rides', type_='check')
    op.create_check_constraint(
        'valid_ride_status',
        'rides',
        "status IN ('REQUESTED', 'SEARCHING', 'OFFERED', 'ACCEPTED', 'ARRIVED', 'STARTED', 'COMPLETED', 'CANCELLED')"
    )
