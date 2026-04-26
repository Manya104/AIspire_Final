"""
AIspire Backend — Render-ready entry point
"""

import sys
import os
import json

# Ensure project root is in path
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

    # ----------------------------
    # Ensure audit file exists
    # ----------------------------
    if not os.path.exists(AUDIT_FILE):
        os.makedirs(os.path.dirname(AUDIT_FILE), exist_ok=True)
        with open(AUDIT_FILE, "w") as f:
            json.dump([], f)

    # ----------------------------
    # Lazy ML loading (IMPORTANT for Render stability)
    # ----------------------------
    print("Initializing AIspire backend...")

    from backend.ml.search_engine import HybridSearchEngine
    from backend.ml.intent_classifier import IntentClassifier
    from backend.ml.ner_extractor import NERExtractor
    from backend.ml.job_clustering import JobClusterModel

    print("Loading Hybrid Search Engine...")
    engine = HybridSearchEngine(alpha=0.7)

    print("Loading Intent Classifier...")
    intent_clf = IntentClassifier()

    print("Loading NER Extractor...")
    ner = NERExtractor()

    print("Building Job Clusters...")
    cluster_model = JobClusterModel(engine, n_clusters=15)

    # ----------------------------
    # Wire ML models
    # ----------------------------
    init_search_engine(engine)
    init_admin_engine(engine)

    init_ml_models(
        intent_classifier=intent_clf,
        cluster_model=cluster_model,
        ner_extractor=ner,
    )

    # ----------------------------
    # Register routes
    # ----------------------------
    app.register_blueprint(auth_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(career_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(ml_bp)

    print("AIspire backend ready!")
    return app


# Create app instance for Gunicorn
app = create_app()


# ----------------------------
# LOCAL RUN ONLY (NOT USED IN RENDER)
# ----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)