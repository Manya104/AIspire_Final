import json
from datetime import datetime
from flask import Blueprint, request, jsonify
from backend.config import DATA_FILE, AUDIT_FILE
from backend.utils.auth import admin_required

admin_bp = Blueprint("admin", __name__)

_engine = None


def init_admin_engine(engine):
    global _engine
    _engine = engine


@admin_bp.route("/log_audit", methods=["POST"])
def log_audit():
    data = request.json
    log_entry = {
        "device": data.get("device", "Unknown"),
        "action": data.get("action", "Unknown"),
        "details": data.get("details", {}),
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    try:
        with open(AUDIT_FILE, "r") as f:
            logs = json.load(f)
        logs.append(log_entry)
        with open(AUDIT_FILE, "w") as f:
            json.dump(logs, f, indent=2)
        return jsonify({"status": "success", "message": "Audit logged"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@admin_bp.route("/get_audit_logs", methods=["GET"])
@admin_required
def get_audit_logs():
    try:
        with open(AUDIT_FILE, "r", encoding="utf-8") as f:
            logs = json.load(f)
        return jsonify(logs)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@admin_bp.route("/get_embeddings", methods=["GET"])
@admin_required
def get_embeddings():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            jobs = json.load(f)
        return jsonify(jobs)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@admin_bp.route("/update_embeddings", methods=["POST"])
@admin_required
def update_embeddings():
    try:
        payload = request.get_json()
        if not payload or "data" not in payload:
            return jsonify({"status": "error", "message": "Invalid request format"}), 400
        jobs = payload["data"]
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)
        if _engine:
            _engine.reload_data()
        return jsonify({"status": "success", "message": "Jobs updated and embeddings refreshed"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@admin_bp.route("/update-json", methods=["POST"])
@admin_required
def update_json():
    try:
        data = request.get_json()
        if not isinstance(data, list):
            return jsonify({"error": "Invalid data format. Expected a list."}), 400
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        if _engine:
            _engine.reload_data()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
