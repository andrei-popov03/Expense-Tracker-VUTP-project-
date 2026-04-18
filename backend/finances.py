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
    #print("Received data:", data)- debug
    user_id = get_jwt_identity()
    amount = data.get('amount')
    category = data.get('category', 'General')
    add_info = data.get('add_info') or 'General'

    # date = data.get('date', datetime.utcnow().date())
    date_str = data.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()

    new_income = Income(user_id=user_id, amount=amount, category=category, add_info=add_info, date=date)
    db.session.add(new_income)
    db.session.commit()
    return jsonify({"msg": "Income added"}), 201


@finance_bp.route('/expense', methods=['POST'])
@jwt_required()
def add_expense():
    
    data = request.get_json()
    #print("Received data:", data)- debug
    user_id = get_jwt_identity()
    amount = data.get('amount')
    category = data.get('category', 'General')
    add_info = data.get('add_info') or 'General'

    # date = data.get('date', datetime.utcnow().date())
    date_str = data.get('date')
    date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()


    new_expense = Expense(user_id=user_id, amount=amount, category=category, add_info=add_info, date=date)
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

#
@finance_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    print(f"Fetching transactions for user_id: {user_id}")  # Debug statement

    incomes = Income.query.filter_by(user_id=user_id).order_by(Income.date.desc()).all()
    print(f"Fetched {incomes} incomes")  # Debug statement
    expenses = Expense.query.filter_by(user_id=user_id).order_by(Expense.date.desc()).all()
    print(f"Fetched {expenses} expense")  # Debug statement

    return jsonify({
        "incomes": [
            {
                "id": i.id,
                "amount": i.amount,
                "category": i.category,
                "add_info": i.add_info,
                "date": i.date.strftime("%Y-%m-%d")
            } for i in incomes
        ],
        "expenses": [
            {
                "id": e.id,
                "amount": e.amount,
                "category": e.category,
                "add_info": e.add_info,
                "date": e.date.strftime("%Y-%m-%d")
            } for e in expenses
        ]
    }), 200