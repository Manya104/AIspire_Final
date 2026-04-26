from flask import Blueprint, request, jsonify
from backend.config import ADMIN_USERNAME, ADMIN_PASSWORD
from backend.utils.auth import create_token

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        token = create_token(username)
        return jsonify({"token": token, "message": "Login successful"})

    return jsonify({"error": "Invalid credentials"}), 401
