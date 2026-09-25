import os
import sys
import logging
from flask import Flask, jsonify
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.database.db import db, get_database_uri
from backend.models.models import User
from backend.routes.auth_routes import auth_bp
from backend.routes.predict_routes import predict_bp
from backend.routes.dashboard_routes import dashboard_bp
from backend.routes.chat_routes import chat_bp

def create_app():
    app = Flask(__name__)

    # Suppress werkzeug default logs noise if desired
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.INFO)

    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'diabetes-prediction-super-secret-2026')
    app.config['SQLALCHEMY_DATABASE_URI'] = get_database_uri(BASE_DIR)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize Database
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(chat_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "service": "Diabetes Risk Prediction API", "version": "1.0.0"}), 200

    # Auto-initialize DB and Seed Admin User
    with app.app_context():
        db.create_all()
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin = User(username='admin', email='admin@diabetes.org', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("[+] Seeded default admin account: admin / admin123")

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"==================================================")
    print(f"  DIABETES PREDICTION BACKEND API SERVER IS LIVE  ")
    print(f"  URL: http://127.0.0.1:{port}")
    print(f"==================================================")
    print(f"[*] Server listening for incoming frontend requests...")
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
