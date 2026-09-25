import json
from flask import Blueprint, request, jsonify
from backend.database.db import db
from backend.models.models import PredictionRecord
from backend.services.auth_service import token_required
from ml.predict import DiabetesPredictor

predict_bp = Blueprint('predict', __name__, url_prefix='/api')

_predictor_instance = None

def get_predictor():
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = DiabetesPredictor()
    return _predictor_instance

@predict_bp.route('/predict', methods=['POST'])
@token_required(optional=True)
def make_prediction(current_user):
    data = request.get_json() or {}

    required_fields = [
        "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
        "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
    ]

    # Input Validation
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({'error': f'Missing required input parameters: {", ".join(missing)}'}), 400

    try:
        inputs = {f: float(data[f]) for f in required_fields}
    except (ValueError, TypeError):
        return jsonify({'error': 'All health parameters must be valid numeric numbers.'}), 400

    # Range Sanity Validation
    if not (0 <= inputs["Glucose"] <= 500) or not (0 <= inputs["BMI"] <= 100) or not (0 <= inputs["Age"] <= 120):
        return jsonify({'error': 'Inputs contain biologically implausible values. Please check measurements.'}), 400

    try:
        predictor = get_predictor()
        result = predictor.predict(inputs)

        # Save to database
        record = PredictionRecord(
            user_id=current_user.id if current_user else None,
            pregnancies=inputs["Pregnancies"],
            glucose=inputs["Glucose"],
            blood_pressure=inputs["BloodPressure"],
            skin_thickness=inputs["SkinThickness"],
            insulin=inputs["Insulin"],
            bmi=inputs["BMI"],
            diabetes_pedigree=inputs["DiabetesPedigreeFunction"],
            age=inputs["Age"],
            prediction=result["prediction"],
            probability=result["raw_probability"],
            risk_level=result["risk_level"],
            feature_impacts_json=json.dumps(result["feature_contributions"])
        )

        db.session.add(record)
        db.session.commit()

        result["record_id"] = record.id
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': f'Model prediction failed: {str(e)}'}), 500

@predict_bp.route('/history', methods=['GET'])
@token_required(optional=False)
def get_prediction_history(current_user):
    records = PredictionRecord.query.filter_by(user_id=current_user.id).order_by(PredictionRecord.timestamp.desc()).all()
    history_list = [r.to_dict() for r in records]
    return jsonify({
        'count': len(history_list),
        'history': history_list
    }), 200

@predict_bp.route('/history/<int:record_id>', methods=['DELETE'])
@token_required(optional=False)
def delete_prediction(current_user, record_id):
    record = PredictionRecord.query.filter_by(id=record_id, user_id=current_user.id).first()
    if not record:
        return jsonify({'error': 'Prediction record not found or access denied.'}), 404

    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': 'Prediction record removed.'}), 200
