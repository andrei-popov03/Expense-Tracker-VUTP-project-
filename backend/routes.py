from flask import Blueprint, jsonify, request
from services import generate_token
from models import User
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"msg": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(username=username, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Missing required fields"}), 400

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        token = generate_token(identity=user.id)
        return jsonify({"token": token,
                        "user_id": user.id,
                        "username": user.username}), 200

    return jsonify({"msg": "Invalid credentials"}), 401

@auth_bp.route('/all_users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    user_list = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
    return jsonify(user_list), 200