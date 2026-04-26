"""
AIspire Backend — Render Production Safe Entry Point
"""

import os
import json
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

    print("🚀 Initializing AIspire Backend...")

    # ----------------------------
    # Ensure audit file exists
    # ----------------------------
    if not os.path.exists(AUDIT_FILE):
        os.makedirs(os.path.dirname(AUDIT_FILE), exist_ok=True)
        with open(AUDIT_FILE, "w") as f:
            json.dump([], f)

    # ----------------------------
    # SAFE ML LOADING (Render-friendly)
    # ----------------------------
    engine = None
    intent_clf = None
    ner = None
    cluster_model = None

    try:
        print("📦 Loading ML models... (this may take time on Render)")

        from backend.ml.search_engine import HybridSearchEngine
        from backend.ml.intent_classifier import IntentClassifier
        from backend.ml.ner_extractor import NERExtractor
        from backend.ml.job_clustering import JobClusterModel

        engine = HybridSearchEngine(alpha=0.7)
        print("✔ HybridSearchEngine loaded")

        intent_clf = IntentClassifier()
        print("✔ IntentClassifier loaded")

        ner = NERExtractor()
        print("✔ NERExtractor loaded")

        cluster_model = JobClusterModel(engine, n_clusters=10)
        print("✔ JobClusterModel built")

    except Exception as e:
        print("⚠ ML loading failed, continuing without full ML stack:")
        print(str(e))

    # ----------------------------
    # Wire engines (safe even if None)
    # ----------------------------
    init_search_engine(engine)
    init_admin_engine(engine)

    init_ml_models(
        intent_classifier=intent_clf,
        cluster_model=cluster_model,
        ner_extractor=ner,
    )

    # ----------------------------
    # Register Blueprints
    # ----------------------------
    app.register_blueprint(auth_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(career_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(ml_bp)

    print("✅ AIspire Backend Ready!")
    return app


# ----------------------------
# Gunicorn Entry Point
# ----------------------------
app = create_app()


# ----------------------------
# LOCAL DEVELOPMENT ONLY
# ----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🔥 Running locally on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False)git status