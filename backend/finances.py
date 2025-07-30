from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Income, Expense, User
from extensions import db
from datetime import datetime

finance_bp = Blueprint('finance', __name__)

@finance_bp.route('/income', methods=['POST'])
@jwt_required()
def add_income():
    data = request.get_json()
    user_id = get_jwt_identity()
    amount = data.get('amount')
    category = data.get('category', 'General')

    # date = data.get('date', datetime.utcnow().date())
    date_str = data.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()

    new_income = Income(user_id=user_id, amount=amount, category=category, date=date)
    db.session.add(new_income)
    db.session.commit()
    return jsonify({"msg": "Income added"}), 201


@finance_bp.route('/expense', methods=['POST'])
@jwt_required()
def add_expense():
    
    data = request.get_json()
    user_id = get_jwt_identity()
    amount = data.get('amount')
    category = data.get('category', 'General')

    # date = data.get('date', datetime.utcnow().date())
    date_str = data.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()


    new_expense = Expense(user_id=user_id, amount=amount, category=category, date=date)
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"msg": "Expense added"}), 201


@finance_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    user_id = get_jwt_identity()
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)

    incomes = Income.query.filter(
        Income.user_id == user_id,
        db.extract('month', Income.date) == month,
        db.extract('year', Income.date) == year
    ).all()

    expenses = Expense.query.filter(
        Expense.user_id == user_id,
        db.extract('month', Expense.date) == month,
        db.extract('year', Expense.date) == year
    ).all()

    total_income = sum(i.amount for i in incomes)
    total_expense = sum(e.amount for e in expenses)

    return jsonify({
        "total_income": total_income,
        "total_expense": total_expense,
        "savings": total_income - total_expense
    }), 200