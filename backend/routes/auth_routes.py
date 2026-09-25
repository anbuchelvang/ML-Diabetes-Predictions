from flask import Blueprint, request, jsonify
from backend.database.db import db
from backend.models.models import User
from backend.services.auth_service import generate_token, token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not username or not email or not password:
        return jsonify({'error': 'Username, email, and password are required fields.'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long.'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username is already taken.'}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email address is already registered.'}), 409

    role = 'admin' if email.startswith('admin@') else 'user'
    user = User(username=username, email=email, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id, user.role)
    return jsonify({
        'message': 'Account created successfully!',
        'token': token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email_or_username = data.get('email_or_username', '').strip().lower()
    password = data.get('password', '')

    if not email_or_username or not password:
        return jsonify({'error': 'Please provide email/username and password.'}), 400

    user = User.query.filter(
        (User.email == email_or_username) | (User.username == email_or_username)
    ).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials. Please check your username/email and password.'}), 401

    token = generate_token(user.id, user.role)
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Client drops JWT token
    return jsonify({'message': 'Logged out successfully.'}), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required(optional=False)
def profile(current_user):
    return jsonify({
        'user': current_user.to_dict()
    }), 200
