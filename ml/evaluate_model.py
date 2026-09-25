import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
METRICS_PATH = os.path.join(BASE_DIR, "ml", "metrics.json")

def print_evaluation_report():
    if not os.path.exists(METRICS_PATH):
        print("[!] No metrics.json found. Please run train_model.py first.")
        return

    with open(METRICS_PATH, "r") as f:
        data = json.load(f)

    print("==================================================")
    print("      DIABETES ML MODEL EVALUATION REPORT        ")
    print("==================================================")
    print(f"Selected Best Model: {data.get('best_model_name')}")
    print(f"Dataset Total Samples: {data.get('dataset_summary', {}).get('total_samples')}")
    print(f"Diabetic Samples: {data.get('dataset_summary', {}).get('diabetic_count')}")
    print(f"Non-Diabetic Samples: {data.get('dataset_summary', {}).get('non_diabetic_count')}")
    print("--------------------------------------------------")
    print("Metrics for Winning Model:")
    metrics = data.get("metrics", {})
    for k, v in metrics.items():
        print(f"  - {k.capitalize()}: {v}")

    print("--------------------------------------------------")
    print("Feature Importances:")
    importances = data.get("feature_importances", {})
    for feat, imp in sorted(importances.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {feat:25s}: {imp:.4f}")

    print("==================================================")

if __name__ == "__main__":
    print_evaluation_report()
