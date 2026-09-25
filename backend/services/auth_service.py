import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from backend.models.models import User
from backend.database.db import db

SECRET_KEY = os.environ.get("JWT_SECRET", "super-secret-diabetes-ml-key-2026")

def generate_token(user_id, role="user"):
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def token_required(optional=False):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            auth_header = request.headers.get("Authorization")

            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

            current_user = None
            if token:
                payload = decode_token(token)
                if payload:
                    current_user = User.query.get(payload.get("user_id"))

            if not optional and not current_user:
                return jsonify({"error": "Unauthorized or session expired. Please log in."}), 401

            return f(current_user, *args, **kwargs)
        return decorated
    return decorator

def admin_required():
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            auth_header = request.headers.get("Authorization")

            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

            if not token:
                return jsonify({"error": "Admin access token required."}), 401

            payload = decode_token(token)
            if not payload or payload.get("role") != "admin":
                return jsonify({"error": "Forbidden. Admin privileges required."}), 403

            current_user = User.query.get(payload.get("user_id"))
            if not current_user:
                return jsonify({"error": "Admin user account not found."}), 404

            return f(current_user, *args, **kwargs)
        return decorated
    return decorator
