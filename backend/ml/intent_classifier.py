"""
Query Intent Classifier for AIspire.

Classifies user queries into intent categories:
- skill_based: "jobs for data analysis skills"
- education_based: "career after diploma in electronics"
- demographic: "jobs for women", "jobs for disabled"
- sector_based: "agriculture jobs", "IT sector careers"
- location_based: "jobs in Noida", "careers near Delhi"
- general: catch-all

Uses a simple TF-IDF + Logistic Regression pipeline trained on
synthetic labeled data. Can be upgraded to fine-tuned DistilBERT.
"""

import os
import json
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score


INTENT_LABELS = [
    "skill_based",
    "education_based",
    "demographic",
    "sector_based",
    "location_based",
    "general",
]

TRAINING_DATA = [
    # skill_based
    ("jobs requiring programming skills", "skill_based"),
    ("careers for people who know data analysis", "skill_based"),
    ("work for someone good at welding", "skill_based"),
    ("jobs that need typing skills", "skill_based"),
    ("occupations requiring communication skills", "skill_based"),
    ("careers needing electrical knowledge", "skill_based"),
    ("jobs for people skilled in carpentry", "skill_based"),
    ("work requiring plumbing expertise", "skill_based"),
    ("jobs needing accounting skills", "skill_based"),
    ("careers for those with cooking skills", "skill_based"),
    ("jobs that require machine learning", "skill_based"),
    ("occupations for people who can do repair work", "skill_based"),
    ("work requiring software development", "skill_based"),
    ("jobs for skilled mechanics", "skill_based"),
    ("careers that need design skills", "skill_based"),

    # education_based
    ("career after diploma in electronics", "education_based"),
    ("jobs for 10th pass students", "education_based"),
    ("career options after MBA", "education_based"),
    ("jobs for engineering graduates", "education_based"),
    ("career after ITI", "education_based"),
    ("what can I do with a BA degree", "education_based"),
    ("jobs for medical graduates", "education_based"),
    ("career options for science students", "education_based"),
    ("jobs after completing 12th arts", "education_based"),
    ("occupations for PhD holders", "education_based"),
    ("career for diploma holders", "education_based"),
    ("jobs after BSc chemistry", "education_based"),
    ("what to do after BCA", "education_based"),
    ("career path after law degree", "education_based"),
    ("jobs for nursing graduates", "education_based"),

    # demographic
    ("jobs for women in rural areas", "demographic"),
    ("career options for disabled people", "demographic"),
    ("jobs for senior citizens", "demographic"),
    ("work for differently abled persons", "demographic"),
    ("employment for visually impaired", "demographic"),
    ("jobs for women", "demographic"),
    ("careers for youth", "demographic"),
    ("work opportunities for tribal communities", "demographic"),
    ("jobs for physically handicapped", "demographic"),
    ("employment for hearing impaired", "demographic"),
    ("jobs for retired army personnel", "demographic"),
    ("careers for rural women", "demographic"),
    ("opportunities for specially abled", "demographic"),
    ("jobs for transgender persons", "demographic"),
    ("work for single mothers", "demographic"),

    # sector_based
    ("agriculture jobs", "sector_based"),
    ("careers in healthcare sector", "sector_based"),
    ("IT sector job opportunities", "sector_based"),
    ("jobs in construction industry", "sector_based"),
    ("manufacturing sector careers", "sector_based"),
    ("hospitality industry jobs", "sector_based"),
    ("banking and finance careers", "sector_based"),
    ("jobs in education sector", "sector_based"),
    ("textile industry occupations", "sector_based"),
    ("energy sector careers", "sector_based"),
    ("transportation jobs", "sector_based"),
    ("mining sector employment", "sector_based"),
    ("retail sector careers", "sector_based"),
    ("pharmaceutical industry jobs", "sector_based"),
    ("telecom sector opportunities", "sector_based"),

    # location_based
    ("jobs in Noida", "location_based"),
    ("careers near Delhi", "location_based"),
    ("employment in Mumbai", "location_based"),
    ("work in Lucknow", "location_based"),
    ("jobs in Gurgaon", "location_based"),
    ("careers in Bangalore", "location_based"),
    ("opportunities near Pune", "location_based"),
    ("jobs in Uttar Pradesh", "location_based"),
    ("employment in rural India", "location_based"),
    ("work in Hyderabad", "location_based"),

    # general
    ("find me a job", "general"),
    ("what jobs are available", "general"),
    ("search for occupations", "general"),
    ("tell me about careers", "general"),
    ("help me find work", "general"),
    ("show me all jobs", "general"),
    ("best career options", "general"),
    ("popular occupations", "general"),
    ("trending jobs", "general"),
    ("job recommendations", "general"),
    ("teacher", "general"),
    ("engineer", "general"),
    ("doctor", "general"),
    ("nurse", "general"),
    ("accountant", "general"),
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "intent_model.pkl")


class IntentClassifier:
    def __init__(self):
        self.pipeline = None
        self.labels = INTENT_LABELS
        self._load_or_train()

    def _load_or_train(self):
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, "rb") as f:
                    self.pipeline = pickle.load(f)
                print("Intent classifier loaded from disk.")
                return
            except Exception:
                pass

        self._train()

    def _train(self):
        texts = [t[0] for t in TRAINING_DATA]
        labels = [t[1] for t in TRAINING_DATA]

        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=5000,
                sublinear_tf=True,
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                C=1.0,
                class_weight="balanced",
                )),
        ])

        self.pipeline.fit(texts, labels)

        scores = cross_val_score(self.pipeline, texts, labels, cv=3, scoring="f1_macro")
        print(f"Intent classifier trained. CV F1-macro: {scores.mean():.3f} (+/- {scores.std():.3f})")

        with open(MODEL_PATH, "wb") as f:
            pickle.dump(self.pipeline, f)

    def predict(self, query):
        if not self.pipeline:
            return {"intent": "general", "confidence": 0.0}

        intent = self.pipeline.predict([query])[0]
        proba = self.pipeline.predict_proba([query])[0]
        confidence = float(proba.max())

        all_intents = {
            label: round(float(p), 4)
            for label, p in zip(self.pipeline.classes_, proba)
        }

        return {
            "intent": intent,
            "confidence": round(confidence, 4),
            "all_intents": all_intents,
        }

    def retrain(self):
        os.remove(MODEL_PATH) if os.path.exists(MODEL_PATH) else None
        self._train()
