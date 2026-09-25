import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from backend.database.db import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user') # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    predictions = db.relationship('PredictionRecord', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class PredictionRecord(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Nullable for guest predictions
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Input parameters
    pregnancies = db.Column(db.Float, nullable=False)
    glucose = db.Column(db.Float, nullable=False)
    blood_pressure = db.Column(db.Float, nullable=False)
    skin_thickness = db.Column(db.Float, nullable=False)
    insulin = db.Column(db.Float, nullable=False)
    bmi = db.Column(db.Float, nullable=False)
    diabetes_pedigree = db.Column(db.Float, nullable=False)
    age = db.Column(db.Float, nullable=False)

    # Output parameters
    prediction = db.Column(db.Integer, nullable=False) # 0 or 1
    probability = db.Column(db.Float, nullable=False) # e.g. 0.78
    risk_level = db.Column(db.String(50), nullable=False) # "Low Risk", "Moderate Risk", "High Risk"
    feature_impacts_json = db.Column(db.Text, nullable=True) # Store JSON string of Explainable AI impacts

    def to_dict(self):
        impacts = []
        if self.feature_impacts_json:
            try:
                impacts = json.loads(self.feature_impacts_json)
            except Exception:
                impacts = []

        return {
            "id": self.id,
            "user_id": self.user_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "inputs": {
                "Pregnancies": self.pregnancies,
                "Glucose": self.glucose,
                "BloodPressure": self.blood_pressure,
                "SkinThickness": self.skin_thickness,
                "Insulin": self.insulin,
                "BMI": self.bmi,
                "DiabetesPedigreeFunction": self.diabetes_pedigree,
                "Age": self.age
            },
            "prediction": self.prediction,
            "probability": round(self.probability, 4),
            "probability_percentage": round(self.probability * 100, 1),
            "risk_level": self.risk_level,
            "feature_contributions": impacts
        }
