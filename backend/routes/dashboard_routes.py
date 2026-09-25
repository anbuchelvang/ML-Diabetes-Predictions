import os
import json
from flask import Blueprint, jsonify
from backend.database.db import db
from backend.models.models import User, PredictionRecord
from backend.services.auth_service import token_required, admin_required

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
METRICS_FILE = os.path.join(BASE_DIR, "ml", "metrics.json")

@dashboard_bp.route('/dashboard', methods=['GET'])
@token_required(optional=True)
def get_user_dashboard(current_user):
    """
    Returns user dashboard KPI metrics and graph dataset series.
    If authenticated, targets user's history; if guest, targets recent aggregate data.
    """
    if current_user:
        records = PredictionRecord.query.filter_by(user_id=current_user.id).order_by(PredictionRecord.timestamp.asc()).all()
    else:
        records = PredictionRecord.query.order_by(PredictionRecord.timestamp.asc()).limit(50).all()

    total_count = len(records)
    if total_count == 0:
        return jsonify({
            "total_predictions": 0,
            "high_risk_count": 0,
            "low_risk_count": 0,
            "avg_glucose": 0,
            "avg_bmi": 0,
            "risk_distribution": [{"name": "Low Risk", "value": 0}, {"name": "High Risk", "value": 0}],
            "glucose_distribution": [],
            "bmi_distribution": [],
            "timeline": []
        }), 200

    high_risk = sum(1 for r in records if r.prediction == 1)
    low_risk = total_count - high_risk
    avg_glucose = round(sum(r.glucose for r in records) / total_count, 1)
    avg_bmi = round(sum(r.bmi for r in records) / total_count, 1)

    glucose_buckets = {"<100 (Normal)": 0, "100-139 (Prediabetes)": 0, "140+ (Elevated)": 0}
    for r in records:
        if r.glucose < 100:
            glucose_buckets["<100 (Normal)"] += 1
        elif r.glucose < 140:
            glucose_buckets["100-139 (Prediabetes)"] += 1
        else:
            glucose_buckets["140+ (Elevated)"] += 1

    glucose_dist = [{"range": k, "count": v} for k, v in glucose_buckets.items()]

    bmi_buckets = {"<25 (Normal)": 0, "25-29.9 (Overweight)": 0, "30+ (Obese)": 0}
    for r in records:
        if r.bmi < 25:
            bmi_buckets["<25 (Normal)"] += 1
        elif r.bmi < 30:
            bmi_buckets["25-29.9 (Overweight)"] += 1
        else:
            bmi_buckets["30+ (Obese)"] += 1

    bmi_dist = [{"range": k, "count": v} for k, v in bmi_buckets.items()]

    timeline_data = []
    for r in records[-15:]:
        timeline_data.append({
            "date": r.timestamp.strftime("%b %d %H:%M") if r.timestamp else "N/A",
            "glucose": r.glucose,
            "bmi": r.bmi,
            "probability": round(r.probability * 100, 1),
            "risk": r.risk_level
        })

    return jsonify({
        "total_predictions": total_count,
        "high_risk_count": high_risk,
        "low_risk_count": low_risk,
        "avg_glucose": avg_glucose,
        "avg_bmi": avg_bmi,
        "risk_distribution": [
            {"name": "Low Risk", "value": low_risk},
            {"name": "High Risk", "value": high_risk}
        ],
        "glucose_distribution": glucose_dist,
        "bmi_distribution": bmi_dist,
        "timeline": timeline_data
    }), 200


@dashboard_bp.route('/admin/stats', methods=['GET'])
@token_required(optional=True)
def get_admin_stats(current_user):
    """
    Returns system admin statistics and ML evaluation metrics.
    """
    total_users = User.query.count()
    total_predictions = PredictionRecord.query.count()
    high_risk_global = PredictionRecord.query.filter_by(prediction=1).count()
    low_risk_global = total_predictions - high_risk_global

    metrics_data = {}
    if os.path.exists(METRICS_FILE):
        with open(METRICS_FILE, "r") as f:
            metrics_data = json.load(f)

    return jsonify({
        "summary": {
            "total_users": total_users,
            "total_predictions": total_predictions,
            "high_risk_predictions": high_risk_global,
            "low_risk_predictions": low_risk_global
        },
        "model_evaluation": metrics_data
    }), 200
