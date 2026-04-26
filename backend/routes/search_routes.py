import time
import json
import math
from flask import Blueprint, request, jsonify
from deep_translator import GoogleTranslator

search_bp = Blueprint("search", __name__)

_engine = None


def init_search_engine(engine):
    global _engine
    _engine = engine


def calculate_confidence_score(job, total_jobs):
    match_score = float(job.get("raw_score", 0))
    job_frequency = int(job.get("frequency", 1))
    rarity_factor = math.log10((total_jobs + 1) / (job_frequency + 1))
    relativity = match_score * rarity_factor
    score_percent = relativity * 100
    return round(min(max(score_percent, 0), 100), 2)


@search_bp.route("/search")
def search():
    query = request.args.get("query", "")
    lang = request.args.get("lang", "en")
    request_start = time.time()

    if not query.strip():
        return jsonify({"error": "Empty query"}), 400

    try:
        results = _engine.hybrid_search(query, top_k=20)
    except Exception as e:
        print(f"Search error: {e}")
        return jsonify({"error": "Search failed"}), 500

    seen_titles = set()
    unique_results = []
    total_jobs = _engine.total_jobs()

    for r in results:
        title = r.get("title")
        if title and title not in seen_titles:
            seen_titles.add(title)
            if "raw_score" not in r:
                r["raw_score"] = 0.0
            score = calculate_confidence_score(r, total_jobs)
            r["confidence_score"] = score
            r["confidence"] = score
            unique_results.append(r)

    unique_results.sort(key=lambda x: x.get("confidence_score", 0), reverse=True)
    unique_results = unique_results[:10]

    if lang != "en":
        try:
            translator = GoogleTranslator(source="en", target=lang)
            for job in unique_results:
                if job.get("title"):
                    job["title"] = translator.translate(job["title"])
                if job.get("description"):
                    job["description"] = translator.translate(job["description"])
        except Exception as e:
            print(f"Translation failed: {e}")

    print(f"Search finished in {time.time() - request_start:.3f}s")
    return jsonify(unique_results)
