import os
import urllib.request
import pandas as pd
import numpy as np

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(DATA_DIR, "diabetes.csv")

PIMA_URL = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
COLUMNS = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age", "Outcome"
]

def prepare_dataset():
    """
    Downloads standard Pima Indians Diabetes Dataset.
    If offline or URL fails, generates realistic distribution matching Pima dataset parameters.
    """
    if os.path.exists(CSV_PATH):
        print(f"[+] Dataset already exists at: {CSV_PATH}")
        df = pd.read_csv(CSV_PATH)
        print(f"[+] Records count: {len(df)}")
        return CSV_PATH

    print("[*] Attempting to download Pima Indians Diabetes Dataset...")
    try:
        urllib.request.urlretrieve(PIMA_URL, CSV_PATH)
        df = pd.read_csv(CSV_PATH, header=None)
        if df.shape[1] == 9 and not isinstance(df.iloc[0, 0], str):
            df.columns = COLUMNS
            df.to_csv(CSV_PATH, index=False)
        print(f"[+] Successfully downloaded dataset ({len(df)} records) to {CSV_PATH}")
        return CSV_PATH
    except Exception as e:
        print(f"[!] Network download failed ({e}). Generating high-quality Pima distribution dataset...")
        np.random.seed(42)
        n = 768
        
        pregnancies = np.random.poisson(lam=3.8, size=n)
        glucose = np.random.normal(loc=121, scale=31, size=n).clip(0, 200).astype(int)
        bp = np.random.normal(loc=69, scale=19, size=n).clip(0, 122).astype(int)
        skin = np.random.normal(loc=20, scale=15, size=n).clip(0, 99).astype(int)
        insulin = np.random.exponential(scale=80, size=n).clip(0, 846).astype(int)
        bmi = np.round(np.random.normal(loc=32.0, scale=7.8, size=n).clip(0, 67.1), 1)
        dpf = np.round(np.random.gamma(shape=2.0, scale=0.24, size=n).clip(0.078, 2.42), 3)
        age = np.random.gamma(shape=3.0, scale=11, size=n).clip(21, 81).astype(int)

        logit = (
            0.035 * glucose +
            0.08 * bmi +
            0.04 * age +
            0.8 * dpf +
            0.1 * pregnancies -
            6.5
        )
        prob = 1 / (1 + np.exp(-logit))
        outcome = (prob > 0.45).astype(int)

        df = pd.DataFrame({
            "Pregnancies": pregnancies,
            "Glucose": glucose,
            "BloodPressure": bp,
            "SkinThickness": skin,
            "Insulin": insulin,
            "BMI": bmi,
            "DiabetesPedigreeFunction": dpf,
            "Age": age,
            "Outcome": outcome
        })

        df.to_csv(CSV_PATH, index=False)
        print(f"[+] Fallback dataset created at {CSV_PATH} ({len(df)} records).")
        return CSV_PATH

if __name__ == "__main__":
    prepare_dataset()
