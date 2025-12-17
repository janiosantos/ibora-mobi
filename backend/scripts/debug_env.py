import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings

print(f"DEBUG: settings.DATABASE_URL = {settings.DATABASE_URL}")
print(f"DEBUG: settings.SQLALCHEMY_DATABASE_URI = {settings.SQLALCHEMY_DATABASE_URI}")
print(f"DEBUG: settings.POSTGRES_USER = {settings.POSTGRES_USER}")
print(f"DEBUG: os.environ.get('DATABASE_URL') = {os.environ.get('DATABASE_URL')}")
print(f"DEBUG: os.environ.get('POSTGRES_USER') = {os.environ.get('POSTGRES_USER')}")
