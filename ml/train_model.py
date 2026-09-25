import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "diabetes.csv")
ML_DIR = os.path.join(BASE_DIR, "ml")
BACKEND_SERVICES_DIR = os.path.join(BASE_DIR, "backend", "services")

FEATURE_COLUMNS = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]
TARGET_COLUMN = "Outcome"

ZERO_IMPUTE_COLS = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]

def load_and_preprocess_data():
    if not os.path.exists(DATA_PATH):
        # Auto-download or generate
        from data.download_dataset import prepare_dataset
        prepare_dataset()

    df = pd.read_csv(DATA_PATH)
    print(f"[*] Loaded dataset with shape: {df.shape}")

    # Compute feature medians (excluding zeros for biological features)
    medians = {}
    for col in ZERO_IMPUTE_COLS:
        non_zero_median = df[df[col] > 0][col].median()
        medians[col] = float(non_zero_median if not np.isnan(non_zero_median) else df[col].median())
        # Replace 0 values in dataset with non-zero median
        df[col] = df[col].replace(0, medians[col])

    # For columns not in ZERO_IMPUTE_COLS (Pregnancies, DPF, Age)
    for col in FEATURE_COLUMNS:
        if col not in medians:
            medians[col] = float(df[col].median())

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    return X, y, medians, df

def train_and_evaluate():
    os.makedirs(ML_DIR, exist_ok=True)
    os.makedirs(BACKEND_SERVICES_DIR, exist_ok=True)

    X, y, medians, df = load_and_preprocess_data()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    candidate_models = {
        "RandomForest": RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=4, random_state=42),
        "LogisticRegression": LogisticRegression(C=1.0, max_iter=1000, random_state=42)
    }

    model_results = {}
    best_model_name = None
    best_f1 = -1.0
    best_model = None
    best_metrics = None

    print("\n--- Model Training & Comparison ---")
    for name, model in candidate_models.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        y_prob = model.predict_proba(X_test_scaled)[:, 1]

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred))
        rec = float(recall_score(y_test, y_pred))
        f1 = float(f1_score(y_test, y_pred))
        roc_auc = float(roc_auc_score(y_test, y_prob))
        cm = confusion_matrix(y_test, y_pred).tolist()

        model_results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": cm
        }

        print(f"[{name}] Acc: {acc:.4f} | F1: {f1:.4f} | ROC-AUC: {roc_auc:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            best_metrics = model_results[name]

    print(f"\n[+] Winner Model Selected: {best_model_name} (F1: {best_f1:.4f})")

    # Feature Importance Calculation
    if hasattr(best_model, "feature_importances_"):
        raw_importances = best_model.feature_importances_
    elif hasattr(best_model, "coef_"):
        raw_importances = np.abs(best_model.coef_[0])
    else:
        raw_importances = np.ones(len(FEATURE_COLUMNS)) / len(FEATURE_COLUMNS)

    importance_dict = {
        col: round(float(imp), 4)
        for col, imp in zip(FEATURE_COLUMNS, raw_importances)
    }

    # Save Model & Scaler Artifacts
    model_file = os.path.join(ML_DIR, "model.pkl")
    scaler_file = os.path.join(ML_DIR, "scaler.pkl")
    metrics_file = os.path.join(ML_DIR, "metrics.json")

    joblib.dump(best_model, model_file)
    joblib.dump(scaler, scaler_file)

    full_metrics_payload = {
        "best_model_name": best_model_name,
        "metrics": best_metrics,
        "all_models_comparison": model_results,
        "feature_importances": importance_dict,
        "feature_medians": medians,
        "feature_names": FEATURE_COLUMNS,
        "dataset_summary": {
            "total_samples": len(df),
            "diabetic_count": int(y.sum()),
            "non_diabetic_count": int((y == 0).sum())
        }
    }

    with open(metrics_file, "w") as f:
        json.dump(full_metrics_payload, f, indent=2)

    # Sync artifacts to backend/services/ for seamless runtime loading
    joblib.dump(best_model, os.path.join(BACKEND_SERVICES_DIR, "model.pkl"))
    joblib.dump(scaler, os.path.join(BACKEND_SERVICES_DIR, "scaler.pkl"))
    with open(os.path.join(BACKEND_SERVICES_DIR, "metrics.json"), "w") as f:
        json.dump(full_metrics_payload, f, indent=2)

    print(f"[+] All ML artifacts saved to '{ML_DIR}' and synced to '{BACKEND_SERVICES_DIR}'")
    return full_metrics_payload

if __name__ == "__main__":
    import sys
    sys.path.append(BASE_DIR)
    train_and_evaluate()
