from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "auth blueprint 연결 성공!"})
