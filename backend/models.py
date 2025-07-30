import uuid
from extensions import db
#finances
from uuid import uuid4
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(256), primary_key=True, default=lambda: str(uuid.uuid4()))
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
    

    # finances 

class Income(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(120), nullable=True)
    date = db.Column(db.Date, default=datetime.utcnow)
    

class Expense(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(120), nullable=True)
    date = db.Column(db.Date, default=datetime.utcnow)