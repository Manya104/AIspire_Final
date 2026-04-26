"""
AIspire Backend — New restructured entry point.

Run with: python -m backend.app_new
Or:       cd backend && python app_new.py
"""

import sys
import os
import json

# Ensure the project root is on the path so `backend.*` imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from flask_cors import CORS

from backend.config import AUDIT_FILE
from backend.routes.auth_routes import auth_bp
from backend.routes.search_routes import search_bp, init_search_engine
from backend.routes.career_routes import career_bp
from backend.routes.admin_routes import admin_bp, init_admin_engine
from backend.routes.ml_routes import ml_bp, init_ml_models


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Ensure audit log exists
    if not os.path.exists(AUDIT_FILE):
        os.makedirs(os.path.dirname(AUDIT_FILE), exist_ok=True)
        with open(AUDIT_FILE, "w") as f:
            json.dump([], f)

    # --- Load ML Models ---
    print("Loading Hybrid Search Engine (SBERT + BM25)...")
    from backend.ml.search_engine import HybridSearchEngine
    engine = HybridSearchEngine(alpha=0.7)

    print("Loading Intent Classifier...")
    from backend.ml.intent_classifier import IntentClassifier
    intent_clf = IntentClassifier()

    print("Loading NER Extractor...")
    from backend.ml.ner_extractor import NERExtractor
    ner = NERExtractor()

    print("Building Job Clusters...")
    from backend.ml.job_clustering import JobClusterModel
    cluster_model = JobClusterModel(engine, n_clusters=15)

    # --- Wire up engines to blueprints ---
    init_search_engine(engine)
    init_admin_engine(engine)
    init_ml_models(
        intent_classifier=intent_clf,
        cluster_model=cluster_model,
        ner_extractor=ner,
    )

    # --- Register Blueprints ---
    app.register_blueprint(auth_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(career_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(ml_bp)

    print("All models loaded. Server ready.")
    return app


if __name__ == "__main__":
    app = create_app()
    print("Starting AIspire server on port 5000...")
    app.run(port=5000, debug=False)