"""add_postgis_and_update_drivers

Revision ID: 037fa9810bfe
Revises: defa1c8a3aa1
Create Date: 2025-12-17 11:16:51.834821

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '037fa9810bfe'
down_revision: Union[str, None] = 'defa1c8a3aa1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable PostGIS
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis')
    
    # Create driver online status enum
    op.execute("CREATE TYPE driveronlinestatus AS ENUM ('online', 'offline', 'in_ride')")
    
    # Add new columns to existing drivers table
    op.add_column('drivers', sa.Column('online_status', sa.Enum('online', 'offline', 'in_ride', name='driveronlinestatus'), nullable=False, server_default='offline'))
    
    # Add Geography column (requires geoalchemy2)
    from geoalchemy2 import Geography
    op.add_column('drivers', sa.Column('location', Geography(geometry_type='POINT', srid=4326), nullable=True))
    
    # Create indexes
    op.create_index(op.f('ix_drivers_online_status'), 'drivers', ['online_status'], unique=False)
    op.create_index('ix_drivers_location', 'drivers', ['location'], postgresql_using='gist')
    
    # Drop old columns
    op.drop_column('drivers', 'current_lat')
    op.drop_column('drivers', 'current_lon')
    op.drop_column('drivers', 'current_heading')
    op.drop_column('drivers', 'online')


def downgrade() -> None:
    # Revert changes
    op.add_column('drivers', sa.Column('online', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.add_column('drivers', sa.Column('current_heading', sa.NUMERIC(precision=5, scale=2), autoincrement=False, nullable=True))
    op.add_column('drivers', sa.Column('current_lon', sa.NUMERIC(precision=11, scale=8), autoincrement=False, nullable=True))
    op.add_column('drivers', sa.Column('current_lat', sa.NUMERIC(precision=10, scale=8), autoincrement=False, nullable=True))
    
    op.drop_index('ix_drivers_location', table_name='drivers')
    op.drop_index(op.f('ix_drivers_online_status'), table_name='drivers')
    op.drop_column('drivers', 'location')
    op.drop_column('drivers', 'online_status')
    
    op.execute('DROP TYPE driveronlinestatus')
    # op.execute('DROP EXTENSION postgis') # Usually safer to keep extension
