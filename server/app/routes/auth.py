from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import create_access_token


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    # 필수값 검사
    if not username or not password:
        return jsonify({"error": "모든 필드를 입력해주세요."}), 400

    # 사용자 중복 검사
    if User.query.filter(User.username == username).first():
        return jsonify({"error": "이미 존재하는 사용자입니다."}), 409

    # 사용자 생성 및 저장
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "회원가입이 완료되었습니다."}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "아이디와 비밀번호를 입력해주세요."}), 400

    # 사용자 조회
    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "아이디 또는 비밀번호가 올바르지 않습니다."}), 401

    # JWT 토큰 발급
    access_token = create_access_token(identity=user.id)

    return jsonify({"message": "로그인 성공", "access_token": access_token}), 200
