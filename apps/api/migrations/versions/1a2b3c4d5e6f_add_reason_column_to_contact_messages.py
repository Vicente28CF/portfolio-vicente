"""add reason column to contact_messages

Revision ID: 1a2b3c4d5e6f
Revises: 2ff3ff07be85
Create Date: 2026-07-01 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a2b3c4d5e6f'
down_revision: Union[str, Sequence[str], None] = '2ff3ff07be85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('contact_messages',
        sa.Column('reason', sa.String(length=50), nullable=False, server_default='other')
    )
    op.alter_column('contact_messages', 'reason', server_default=None)


def downgrade() -> None:
    op.drop_column('contact_messages', 'reason')
