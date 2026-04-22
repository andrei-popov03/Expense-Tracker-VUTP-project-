from uuid import uuid4
from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(256), primary_key=True, default=lambda: str(uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    incomes = db.relationship('Income', backref='user', lazy=True)
    expenses = db.relationship('Expense', backref='user', lazy=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __repr__(self):
        return f'<User {self.username}>'


class Income(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='BGN', server_default='BGN')
    category = db.Column(db.String(120), nullable=True)
    add_info = db.Column(db.String(120), nullable=True)
    date = db.Column(db.Date, default=datetime.utcnow)


class Expense(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='BGN', server_default='BGN')
    category = db.Column(db.String(120), nullable=True)
    add_info = db.Column(db.String(120), nullable=True)
    date = db.Column(db.Date, default=datetime.utcnow)


class RecurringTransaction(db.Model):
    __tablename__ = 'recurring_transactions'
    id = db.Column(db.String(256), primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(10), nullable=False)  # 'income' or 'expense'
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='BGN')
    category = db.Column(db.String(120), nullable=True)
    add_info = db.Column(db.String(120), nullable=True)
    frequency = db.Column(db.String(20), nullable=False, default='monthly')  # 'weekly', 'monthly', 'yearly'
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())