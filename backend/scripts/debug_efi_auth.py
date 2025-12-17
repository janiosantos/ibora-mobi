from gerencianet import Gerencianet
import logging

logging.basicConfig(level=logging.DEBUG)

credentials = {
    'client_id': 'Client_Id_d45febcef25500d2ff3b56fbf32b9a61b30dea2a',
    'client_secret': 'Client_Secret_09c6be42a50a96c9a38c0074e0ba7a104c63a7a9',
    'certificate': '/home/jpsantos/Projetos-dev/ibora-mobi/backend/cert.pem', 
    'sandbox': True
}

gn = Gerencianet(credentials)

try:
    print("1. Creating Charge...")
    body = {
        'calendario': {'expiracao': 3600},
        'valor': {'original': '1.00'},
        'chave': 'efipay@sejaefi.com.br',
        'solicitacaoPagador': 'Debug Charge'
    }
    charge = gn.pix_create_immediate_charge(body=body)
    print("Charge Created:", charge)
    
    loc_id = charge['loc']['id']
    print(f"2. Generating QR Code for Loc ID: {loc_id}")
    
    qrcode = gn.pix_generate_QRCode(params={'id': loc_id})
    print("QR Code Generated:", qrcode)

except Exception as e:
    print("Error:", e)
    import traceback
    traceback.print_exc()
