# routes/ping.py
from flask import Blueprint

ping_bp = Blueprint("ping", __name__)


@ping_bp.route("/", methods=["GET"])
def home():
    return "✅ 백엔드 서버가 정상적으로 작동 중입니다!"
