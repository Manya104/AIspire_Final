import json
from flask import Blueprint, request, jsonify
from backend.config import CAREER_PATHS_FILE

career_bp = Blueprint("career", __name__)


@career_bp.route("/api/careers", methods=["GET"])
def get_careers():
    try:
        with open(CAREER_PATHS_FILE, "r", encoding="utf-8") as f:
            paths = json.load(f)
        titles = [{"title": title} for title in paths.keys()]
        return jsonify(titles)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@career_bp.route("/api/career-path", methods=["GET"])
def get_career_path_api():
    title = request.args.get("title", "")
    try:
        with open(CAREER_PATHS_FILE, "r", encoding="utf-8") as f:
            paths = json.load(f)
        if title in paths:
            return jsonify(paths[title])
        return jsonify({"error": "Career not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@career_bp.route("/career-path", methods=["GET"])
def get_career_path_legacy():
    job_query = request.args.get("job", "").strip()
    if not job_query:
        return jsonify({"error": "Missing 'job' query parameter"}), 400

    try:
        with open(CAREER_PATHS_FILE, "r", encoding="utf-8") as f:
            paths = json.load(f)
    except Exception as e:
        return jsonify({"error": f"Failed to load career paths: {e}"}), 500

    lowered = job_query.lower()
    for title in paths:
        if title.lower() == lowered:
            return jsonify(paths[title])

    candidates = [(t, d) for t, d in paths.items() if lowered in t.lower()]
    if not candidates:
        return jsonify({"error": f"No career path found for '{job_query}'"}), 404

    return jsonify(candidates[0][1])
