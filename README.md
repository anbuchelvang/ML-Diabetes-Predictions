# DiaPredictAI - Machine Learning Diabetes Risk Prediction System

A complete, modern, full-stack **Diabetes Risk Prediction Application** powered by Machine Learning trained on the Pima Indians Diabetes Dataset, a Python Flask REST API backend, SQLite database with JWT authentication, and a React + Vite + Tailwind CSS frontend dashboard featuring Explainable AI (XAI) factor visualizations and an AI Health Assistant.

> **Medical Disclaimer**: This application is built for educational demonstration and risk screening purposes only. Predictions generated are statistical estimates based on historical machine learning data and do NOT constitute a clinical diagnosis. Always consult a qualified physician or endocrinologist for clinical advice.

---

## 1. Project Overview & Features

* **Real Machine Learning Predictions**: Trained Gradient Boosting classification model evaluating 8 key biomedical indicators.
* **Explainable AI (XAI)**: Visual breakdown displaying feature impact weights (Fasting Glucose, BMI, Age, Blood Pressure, etc.) for every individual risk prediction.
* **Clinical Preset Examples**: Quick preset buttons ("Low Risk Baseline", "Elevated Glucose Example", "High Risk Clinical Case") for immediate demonstration.
* **Interactive Analytics Dashboard**: Total assessments, risk distribution pie chart, fasting glucose & BMI range distributions, and historical timeline chart built with Recharts.
* **Secure User Authentication**: JWT token authentication with bcrypt password hashing (`werkzeug.security`) and SQLite database storage.
* **Prediction History Log**: Logged user assessments with tabular view, detail inspector modal, record deletion, and CSV export.
* **AI Diabetes Assistant**: Interactive chat interface providing evidence-based prediabetes education, glucose range information, and safety guardrails against diagnostic or prescription requests.
* **Admin Control Panel**: Aggregated system metrics, confusion matrix display, precision/recall/F1 benchmarks, and global feature importance weights.
* **Modern UI/UX**: Custom healthcare glassmorphism design system using Tailwind CSS, Lucide React icons, dark slate palette, glowing risk indicators, and responsive layouts.

---

## 2. Technology Stack

### Machine Learning
* **Language**: Python 3.13
* **Libraries**: Scikit-Learn, Pandas, NumPy, Joblib
* **Algorithms**: Gradient Boosting Classifier (Best ROC-AUC ~0.82), Random Forest, Logistic Regression
* **Explainability**: Local feature impact weighting and global feature importances

### Backend API
* **Framework**: Python Flask REST API
* **Database**: SQLite (`backend/database/diabetes_app.db`) with SQLAlchemy ORM (swappable to MySQL via `MYSQL_DATABASE_URI`)
* **Security & Auth**: PyJWT, Werkzeug password hashing, CORS configuration

### Frontend
* **Core**: React.js 19 + Vite 8
* **Styling**: Tailwind CSS v4, custom glassmorphism design system
* **Visuals & Charts**: Recharts, Lucide React Icons

---

## 3. Project Directory Structure

```
diabetes-prediction/
├── backend/
│   ├── database/
│   │   └── db.py               # SQLAlchemy database initialization
│   ├── models/
│   │   └── models.py           # User & PredictionRecord database models
│   ├── routes/
│   │   ├── auth_routes.py      # /api/auth/register, login, logout, profile
│   │   ├── predict_routes.py   # /api/predict, /api/history
│   │   ├── dashboard_routes.py # /api/dashboard, /api/admin/stats
│   │   └── chat_routes.py      # /api/chat
│   ├── services/
│   │   ├── auth_service.py     # JWT token generation & auth decorators
│   │   ├── ai_chat_service.py  # AI Assistant Q&A engine with safety rules
│   │   ├── model.pkl           # Synced ML model binary
│   │   ├── scaler.pkl          # Synced StandardScaler binary
│   │   └── metrics.json        # Model benchmarks & confusion matrix
│   ├── app.py                  # Main Flask application entrypoint
│   └── requirements.txt        # Python backend dependencies
│
├── ml/
│   ├── train_model.py          # Preprocessing, model training & comparison
│   ├── predict.py              # DiabetesPredictor class & XAI calculator
│   ├── evaluate_model.py       # Metrics report generator
│   ├── model.pkl               # Saved best ML model
│   ├── scaler.pkl              # Saved feature scaler
│   └── metrics.json            # Model evaluation metrics JSON
│
├── data/
│   ├── download_dataset.py     # Download/prepare Pima Indians Diabetes Dataset
│   └── diabetes.csv            # 768 clinical records dataset
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, AuthModal, ExplainableAIChart
│   │   ├── context/            # AuthContext.jsx
│   │   ├── pages/              # Home, Prediction, Dashboard, History, Chat, Admin, About
│   │   ├── services/           # api.js REST API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── tests/
│   └── test_app.py             # Automated Pytest suite for ML & API
├── .env.example
├── README.md
└── .gitignore
```

---

## 4. Dataset Information & ML Workflow

### Pima Indians Diabetes Dataset (`data/diabetes.csv`)
* **Total Samples**: 768 clinical records
* **Target Variable**: `Outcome` (`0 = Non-Diabetic`, `1 = Diabetic`)
* **Input Features**:
  1. `Pregnancies`: Number of times pregnant
  2. `Glucose`: Fasting blood glucose concentration (mg/dL)
  3. `BloodPressure`: Diastolic blood pressure (mmHg)
  4. `SkinThickness`: Triceps skin fold thickness (mm)
  5. `Insulin`: 2-Hour serum insulin (mu U/ml)
  6. `BMI`: Body Mass Index (weight in kg / height in m²)
  7. `DiabetesPedigreeFunction`: Genetic likelihood score
  8. `Age`: Age in years

### Training & Preprocessing Steps
1. **Zero Imputation**: Biologically invalid zeros in `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, and `BMI` are automatically imputed with feature medians computed from non-zero records.
2. **Feature Scaling**: Inputs are normalized using `StandardScaler`.
3. **Model Selection**: Compares Logistic Regression, Random Forest, and Gradient Boosting Classifiers using a 80/20 stratified train/test split.
4. **Serialization**: Exports winning model (`model.pkl`), scaler (`scaler.pkl`), and metrics (`metrics.json`).

---

## 5. Installation & Setup Instructions (Windows)

### Prerequisites
* Python 3.10+ installed
* Node.js v18+ & npm installed

### Step 1: Clone or Navigate to Project
```powershell
cd "C:\Users\Anbuchelvan G\.gemini\antigravity\scratch\diabetes-prediction"
```

### Step 2: Install Backend Dependencies & Train ML Model
```powershell
# Install Python packages
pip install -r backend/requirements.txt

# Run dataset download & ML model training
python ml/train_model.py
```

### Step 3: Run Automated Test Suite
```powershell
pytest tests/test_app.py
```

### Step 4: Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

---

## 6. How to Run the Application

### Option A: Running Backend and Frontend Simultaneously

1. **Start Backend Flask Server** (Terminal 1):
```powershell
python backend/app.py
```
*Backend API will run on `http://127.0.0.1:5000`*
*Default Seed Admin Credentials*: Username `admin` | Password `admin123`

2. **Start Frontend Vite Dev Server** (Terminal 2):
```powershell
cd frontend
npm run dev
```
*Frontend Web App will run on `http://localhost:5173`*

---

## 7. Backend REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | API health check | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/profile` | Get current user profile | Yes (JWT) |
| `POST` | `/api/predict` | Predict diabetes risk & XAI factors | Optional (JWT) |
| `GET` | `/api/history` | Get logged user prediction history | Yes (JWT) |
| `DELETE` | `/api/history/<id>` | Delete prediction record | Yes (JWT) |
| `GET` | `/api/dashboard` | Get dashboard statistics & charts | Optional |
| `GET` | `/api/admin/stats` | Get admin metrics & confusion matrix | Optional |
| `POST` | `/api/chat` | AI Diabetes Assistant Q&A endpoint | No |

---

## 8. Screenshots Placeholder

*(Place screenshots of the Home Page, Prediction Page with Explainable AI chart, Analytics Dashboard, and History log here)*

* **Home Page**: Modern hero section with metrics counter and workflow steps.
* **Prediction Page**: Input form with clinical sample presets and Explainable AI factor impact breakdown.
* **Analytics Dashboard**: Recharts risk pie chart, glucose distribution, and timeline.
* **Admin Panel**: Confusion matrix and ML model benchmark metrics.

---

## 9. Future Improvements & Extensions

1. **SHAP Integration**: Integrate tree SHAP explainer for kernel-density SHAP value plots.
2. **MySQL Database Migration**: Swap SQLite connection string to `MYSQL_DATABASE_URI` for cloud production deployment.
3. **External LLM Integration**: Connect AI Assistant endpoint to OpenAI or Gemini API for expanded natural language conversation.
4. **PDF Health Report Download**: Export formatted medical summary report as PDF for doctor consultations.
