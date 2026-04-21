from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Income, Expense
from extensions import db
from datetime import datetime, timezone

finance_bp = Blueprint('finance', __name__)

SUPPORTED_CURRENCIES = {'BGN', 'EUR', 'USD'}

# Fixed rates: how many BGN equals 1 unit of each currency.
# 1 BGN = 0.5113 EUR  →  1 EUR = 1/0.5113 = 1.95583 BGN
# 1 BGN = 0.6012 USD  →  1 USD = 1/0.6012 = 1.6633 BGN
RATES_TO_BGN = {'BGN': 1.0, 'EUR': 1.95583, 'USD': 1.6633}


def to_display(amount, from_currency, to_currency):
    """Convert an amount from its stored currency to the requested display currency."""
    bgn = amount * RATES_TO_BGN.get(from_currency, 1.0)
    return bgn / RATES_TO_BGN[to_currency]


# Shared logic for /income and /expense — model_class is either Income or Expense
def _add_transaction(model_class):
    data = request.get_json()
    # get_jwt_identity() returns the user's UUID stored in the token at login
    user_id = get_jwt_identity()
    amount = data.get('amount')

    if amount is None:
        return jsonify({"msg": "Amount is required"}), 400
    try:
        amount = float(amount)
    except (ValueError, TypeError):
        return jsonify({"msg": "Amount must be a number"}), 400
    if amount <= 0:
        return jsonify({"msg": "Amount must be greater than zero"}), 400

    currency = data.get('currency', 'BGN').upper()
    if currency not in SUPPORTED_CURRENCIES:
        return jsonify({"msg": f"Unsupported currency. Use: {', '.join(SUPPORTED_CURRENCIES)}"}), 400

    category = data.get('category', 'General')
    add_info = data.get('add_info') or 'General'

    date_str = data.get('date')
    try:
        # If the client sends a date string use it; otherwise default to today (UTC)
        date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.now(timezone.utc).date()
    except ValueError:
        return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD"}), 400

    try:
        entry = model_class(
            user_id=user_id, amount=amount, currency=currency,
            category=category, add_info=add_info, date=date
        )
        db.session.add(entry)
        db.session.commit()
        return jsonify({"msg": f"{model_class.__name__} added"}), 201
    except Exception:
        # Roll back so the session stays clean for the next request
        db.session.rollback()
        return jsonify({"msg": "Database error"}), 500


@finance_bp.route('/income', methods=['POST'])
@jwt_required()
def add_income():
    return _add_transaction(Income)


@finance_bp.route('/expense', methods=['POST'])
@jwt_required()
def add_expense():
    return _add_transaction(Expense)


@finance_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    user_id = get_jwt_identity()
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)
    display_currency = request.args.get('currency', 'BGN').upper()

    if not month or not year:
        return jsonify({"msg": "month and year are required"}), 400
    if display_currency not in SUPPORTED_CURRENCIES:
        return jsonify({"msg": f"Unsupported currency"}), 400

    # db.extract pulls the month/year part from the stored date for filtering
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

    # Each transaction may be stored in a different currency — convert all to display currency
    total_income = sum(to_display(i.amount, i.currency or 'BGN', display_currency) for i in incomes)
    total_expense = sum(to_display(e.amount, e.currency or 'BGN', display_currency) for e in expenses)

    return jsonify({
        "total_income": total_income,
        "total_expense": total_expense,
        "savings": total_income - total_expense,
        "currency": display_currency,
    }), 200


@finance_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()

    incomes = Income.query.filter_by(user_id=user_id).order_by(Income.date.desc()).all()
    expenses = Expense.query.filter_by(user_id=user_id).order_by(Expense.date.desc()).all()

    return jsonify({
        "incomes": [
            {
                "id": i.id,
                "amount": i.amount,
                "currency": i.currency or 'BGN',
                "category": i.category,
                "add_info": i.add_info,
                "date": i.date.strftime("%Y-%m-%d")
            } for i in incomes
        ],
        "expenses": [
            {
                "id": e.id,
                "amount": e.amount,
                "currency": e.currency or 'BGN',
                "category": e.category,
                "add_info": e.add_info,
                "date": e.date.strftime("%Y-%m-%d")
            } for e in expenses
        ]
    }), 200
