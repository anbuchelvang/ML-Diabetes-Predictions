import os
import sys
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.app import create_app
from backend.database.db import db
from ml.train_model import train_and_evaluate
from ml.predict import DiabetesPredictor

@pytest.fixture
def client():
    # Ensure model is trained first
    metrics_path = os.path.join(BASE_DIR, "ml", "metrics.json")
    if not os.path.exists(metrics_path):
        train_and_evaluate()

    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client

def test_health_check(client):
    rv = client.get('/api/health')
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert json_data['status'] == 'healthy'

def test_ml_prediction_direct():
    predictor = DiabetesPredictor()
    sample = {
        "Pregnancies": 1,
        "Glucose": 85,
        "BloodPressure": 66,
        "SkinThickness": 29,
        "Insulin": 0,
        "BMI": 26.6,
        "DiabetesPedigreeFunction": 0.351,
        "Age": 31
    }
    result = predictor.predict(sample)
    assert 'risk_level' in result
    assert 'probability_percentage' in result
    assert 'feature_contributions' in result
    assert len(result['feature_contributions']) == 8

def test_predict_endpoint_guest(client):
    payload = {
        "Pregnancies": 6,
        "Glucose": 148,
        "BloodPressure": 72,
        "SkinThickness": 35,
        "Insulin": 0,
        "BMI": 33.6,
        "DiabetesPedigreeFunction": 0.627,
        "Age": 50
    }
    rv = client.post('/api/predict', json=payload)
    assert rv.status_code == 200
    data = rv.get_json()
    assert 'risk_level' in data
    assert 'probability_percentage' in data

def test_register_and_login(client):
    # Register
    reg_payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    rv = client.post('/api/auth/register', json=reg_payload)
    assert rv.status_code == 201
    reg_data = rv.get_json()
    token = reg_data['token']
    assert token is not None

    # Login
    login_payload = {
        "email_or_username": "testuser",
        "password": "password123"
    }
    rv_login = client.post('/api/auth/login', json=login_payload)
    assert rv_login.status_code == 200
    login_data = rv_login.get_json()
    assert login_data['user']['username'] == 'testuser'

if __name__ == '__main__':
    print("[*] Running API and ML Unit Verification...")
    train_and_evaluate()
    p = DiabetesPredictor()
    print("[+] Predictor verification success.")
