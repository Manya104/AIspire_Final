from flask import Blueprint, request, jsonify

ml_bp = Blueprint("ml", __name__, url_prefix="/api")

_intent_classifier = None
_cluster_model = None
_ner_extractor = None


def init_ml_models(intent_classifier=None, cluster_model=None, ner_extractor=None):
    global _intent_classifier, _cluster_model, _ner_extractor
    _intent_classifier = intent_classifier
    _cluster_model = cluster_model
    _ner_extractor = ner_extractor


@ml_bp.route("/intent", methods=["GET"])
def analyze_intent():
    query = request.args.get("query", "")
    if not query.strip():
        return jsonify({"error": "Empty query"}), 400

    result = {"intent": "general", "confidence": 0.5, "entities": []}

    if _intent_classifier:
        try:
            result.update(_intent_classifier.predict(query))
        except Exception as e:
            print(f"Intent classification error: {e}")

    if _ner_extractor:
        try:
            result["entities"] = _ner_extractor.extract(query)
        except Exception as e:
            print(f"NER extraction error: {e}")

    return jsonify(result)


@ml_bp.route("/clusters", methods=["GET"])
def get_clusters():
    if not _cluster_model:
        return jsonify({"error": "Clustering not available"}), 503

    try:
        return jsonify(_cluster_model.get_cluster_data())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
