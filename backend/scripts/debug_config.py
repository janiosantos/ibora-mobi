import sys
import os
sys.path.append(os.getcwd())

from app.core.config import settings
import app.core.config

print(f"Config File: {app.core.config.__file__}")
print(f"EFI_PIX_KEY from settings: '{settings.EFI_PIX_KEY}'")
print(f"EFI_PIX_KEY type: {type(settings.EFI_PIX_KEY)}")

# Check env
print(f"Env EFI_PIX_KEY: '{os.environ.get('EFI_PIX_KEY')}'")
