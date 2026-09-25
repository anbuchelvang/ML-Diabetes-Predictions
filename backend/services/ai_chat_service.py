import re

SAFETY_DISCLAIMER = (
    "\n\n*Medical Disclaimer: I am an AI Diabetes Health Assistant designed for general educational information. "
    "I cannot provide medical diagnoses, prescribe medications, or replace professional advice from a doctor.*"
)

FAQ_KNOWLEDGE_BASE = [
    {
        "keywords": ["what is diabetes", "define diabetes", "explain diabetes", "type 2"],
        "response": (
            "**Diabetes Mellitus** is a chronic metabolic condition characterized by elevated levels of blood glucose (sugar). "
            "It occurs when the pancreas does not produce enough insulin or when the body cannot effectively use the insulin it produces.\n\n"
            "• **Type 1 Diabetes:** An autoimmune condition where the body attacks insulin-producing beta cells.\n"
            "• **Type 2 Diabetes:** The most common form, driven by insulin resistance and relative insulin deficiency.\n"
            "• **Gestational Diabetes:** High blood sugar developing during pregnancy."
        )
    },
    {
        "keywords": ["normal glucose", "blood sugar range", "glucose level", "fasting glucose", "hba1c", "a1c", "blood sugar"],
        "response": (
            "**Standard Blood Glucose Ranges (Fasting):**\n\n"
            "• **Normal:** 70 – 99 mg/dL\n"
            "• **Prediabetes:** 100 – 125 mg/dL\n"
            "• **Diabetes Diagnosis:** 126 mg/dL or higher on two separate tests.\n\n"
            "**Post-meal (2 hours after eating):**\n"
            "• **Normal:** Below 140 mg/dL\n"
            "• **Prediabetes:** 140 – 199 mg/dL\n"
            "• **Diabetes:** 200 mg/dL or higher."
        )
    },
    {
        "keywords": ["what is bmi", "body mass index", "bmi range", "normal bmi"],
        "response": (
            "**Body Mass Index (BMI)** is a numerical measurement derived from your weight and height (BMI = weight in kg / (height in meters)²).\n\n"
            "• **Underweight:** Below 18.5\n"
            "• **Normal Weight:** 18.5 – 24.9\n"
            "• **Overweight:** 25.0 – 29.9\n"
            "• **Obesity:** 30.0 or higher\n\n"
            "Excess body fat, particularly around the abdomen (visceral fat), strongly correlates with increased insulin resistance."
        )
    },
    {
        "keywords": ["symptoms", "signs of diabetes", "warning signs", "frequent urination", "thirst", "fatigue"],
        "response": (
            "**Common Early Symptoms of Diabetes include:**\n\n"
            "1. **Polyuria:** Increased frequency of urination (especially at night).\n"
            "2. **Polydipsia:** Excessive or unquenchable thirst.\n"
            "3. **Polyphagia:** Extreme hunger despite adequate eating.\n"
            "4. **Unexplained weight loss** or persistent fatigue.\n"
            "5. **Blurry vision** or slow-healing cuts and sores.\n\n"
            "If you experience multiple symptoms, please schedule a check-up with a doctor."
        )
    },
    {
        "keywords": ["lifestyle", "prevention", "prevent diabetes", "reduce risk", "diet", "eat", "nutrition", "exercise", "habits"],
        "response": (
            "**Evidence-Based Lifestyle Habits to Reduce Diabetes Risk:**\n\n"
            "• **Physical Activity:** Aim for at least 150 minutes of moderate-intensity aerobic exercise (e.g., brisk walking, cycling) per week.\n"
            "• **Dietary Adjustments:** Focus on high-fiber foods, legumes, vegetables, and whole grains while limiting sugar-sweetened beverages and refined carbs.\n"
            "• **Weight Management:** Losing even 5–7% of your body weight can lower risk by up to 58% in adults with prediabetes.\n"
            "• **Routine Health Screenings:** Check blood pressure, lipid profile, and fasting blood sugar annually."
        )
    },
    {
        "keywords": ["pedigree", "genetics", "family history", "hereditary"],
        "response": (
            "**Diabetes Pedigree Function (DPF):**\n"
            "The Diabetes Pedigree Function is a mathematical calculation that estimates genetic likelihood based on family history of diabetes.\n\n"
            "While having a family history increases risk, active lifestyle modifications (diet & exercise) remain highly effective at preventing onset."
        )
    },
    {
        "keywords": ["urgent", "emergency", "very high blood sugar", "ketones", "confusion", "passed out"],
        "response": (
            "**Seek urgent medical help** for severe confusion, fainting, trouble breathing, repeated vomiting, "
            "or an inability to keep fluids down. Very high or very low blood sugar can be dangerous, especially "
            "when accompanied by these symptoms. Contact local emergency services or a medical professional immediately."
        )
    }
]

MEDICAL_REFUSAL_TRIGGERS = [
    "prescribe", "medication", "metformin", "insulin dose", "diagnose me",
    "do i have diabetes", "cure diabetes", "what drug should i take"
]

def generate_ai_response(user_query: str) -> str:
    query_lower = user_query.lower()

    for trigger in MEDICAL_REFUSAL_TRIGGERS:
        if trigger in query_lower:
            return (
                "**Refusal Notice:** As an AI assistant, I am not authorized to prescribe medication, provide medical diagnoses, "
                "or recommend specific drug dosages. Please consult a licensed medical physician or endocrinologist for clinical diagnosis and treatment options."
                + SAFETY_DISCLAIMER
            )

    for item in FAQ_KNOWLEDGE_BASE:
        for kw in item["keywords"]:
            if kw in query_lower:
                return item["response"] + SAFETY_DISCLAIMER

    return (
        "Thank you for asking! In general, diabetes risk is influenced by key factors including blood glucose levels, BMI, age, family history, and physical activity.\n\n"
        "You can assess your personal risk estimate using our **Prediction Page**, which evaluates your health metrics using our trained Machine Learning model."
        + SAFETY_DISCLAIMER
    )
