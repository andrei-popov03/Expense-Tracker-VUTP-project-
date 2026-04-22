"""add currency column to income and expense

Revision ID: a3f1c2d4e5b6
Revises: 7c09a5f2180b
Create Date: 2026-04-22 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'a3f1c2d4e5b6'
down_revision = '7c09a5f2180b'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('income', schema=None) as batch_op:
        batch_op.add_column(sa.Column('currency', sa.String(length=3), nullable=False, server_default='BGN'))

    with op.batch_alter_table('expense', schema=None) as batch_op:
        batch_op.add_column(sa.Column('currency', sa.String(length=3), nullable=False, server_default='BGN'))


def downgrade():
    with op.batch_alter_table('income', schema=None) as batch_op:
        batch_op.drop_column('currency')

    with op.batch_alter_table('expense', schema=None) as batch_op:
        batch_op.drop_column('currency')
