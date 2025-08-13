from flask import Blueprint, request, jsonify, send_from_directory, current_app
from app.extensions import db
from app.models.review_model import Review
from app.models.carTIP_model import CarTIP
from datetime import datetime
import os, uuid, traceback
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from .utils import to_abs_url
from datetime import datetime, timezone

carTIP_bp = Blueprint("carTIP", __name__)

UPLOAD_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "carTIP")
)
os.makedirs(UPLOAD_DIR, exist_ok=True)

BASE_URL = os.getenv("BASE_URL", "https://www.saemaeultruck.pics")


# ✅ 차량 TIP 전체 리스트 조회
@carTIP_bp.route("/list", methods=["GET"])
def car_tip_list():
    tips = CarTIP.query.order_by(CarTIP.id.desc()).all()
    result = []
    for tip in tips:
        images = tip.images or []
        abs_images = [to_abs_url(p) for p in images]
        result.append(
            {
                "id": tip.id,
                "title": tip.title,
                "content": tip.content,
                "images": abs_images,
                "date": tip.date,
                "view": tip.view,
            }
        )
    return jsonify(result), 200


# 등록 api
# @carTIP_bp.route("/uploadCarTIP", methods=["POST"])
# @jwt_required()
# def create_carTIP():
#     title = request.form.get("title")
#     content = request.form.get("content")
#     images = request.files.getlist("images")
#     date = datetime.now().strftime("%Y-%m-%d")
#     view = 0

#     saved_image_paths = []

#     for image in images:
#         ext = os.path.splitext(image.filename)[1]
#         unique_filename = (
#             f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}{ext}"
#         )
#         save_path = os.path.join(UPLOAD_DIR, unique_filename)
#         image.save(save_path)

#         # ✅ 절대 URL 대신 상대 경로로 저장
#         image_url = f"/carTIP/uploads/{unique_filename}"
#         # saved_image_paths.append(image_url)
#         saved_image_paths.append(f"{BASE_URL}/carTIP/uploads/{unique_filename}")

#     new_carTIP = CarTIP(
#         title=title,
#         images=saved_image_paths,
#         content=content,
#         date=date,
#         view=view,
#     )
#     db.session.add(new_carTIP)
#     db.session.commit()

#     return jsonify({"message": "리뷰가 등록되었습니다."}), 201


@carTIP_bp.route("/uploadCarTIP", methods=["POST"])
@jwt_required()
def create_carTIP():
    try:
        # 1) 입력 정규화: None -> "" (문자열 컬럼은 "" 허용)
        title = (request.form.get("title") or "").strip()
        content = (request.form.get("content") or "").strip()

        # 2) 업로드 디렉토리 보장
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # 3) 파일 저장
        files = request.files.getlist("images") or []
        saved_image_paths = []
        for f in files:
            if not f or not getattr(f, "filename", ""):
                continue
            ext = os.path.splitext(f.filename)[1]
            unique_filename = (
                f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}{ext}"
            )
            save_path = os.path.join(UPLOAD_DIR, unique_filename)
            f.save(save_path)
            # 상대 경로로 저장(도메인 바뀌어도 안전)
            saved_image_paths.append(f"/carTIP/uploads/{unique_filename}")

        # 4) date는 넣지 않음(서버 기본값이 채움)
        new_carTIP = CarTIP(
            title=title,
            content=content,
            images=saved_image_paths,  # []도 OK
            view=0,
        )
        db.session.add(new_carTIP)
        db.session.commit()

        return jsonify({"message": "등록되었습니다.", "id": new_carTIP.id}), 201

    except Exception as e:
        db.session.rollback()
        # 🔎 디버그 정보: 정확한 에러 원인을 응답으로 보기
        current_app.logger.exception("CarTIP upload failed")
        return (
            jsonify(
                {
                    "error": str(e),
                    "trace": traceback.format_exc(),
                    "form_keys": list(request.form.keys()),
                    "file_keys": list(request.files.keys()),
                }
            ),
            500,
        )


# ✅ 특정 차량 TIP 상세 조회
@carTIP_bp.route("/<int:carTIP_id>", methods=["GET"])
def get_carTIP(carTIP_id):
    tip = CarTIP.query.get_or_404(carTIP_id)
    abs_images = [to_abs_url(p) for p in (tip.images or [])]
    return (
        jsonify(
            {
                "id": tip.id,
                "title": tip.title,
                "content": tip.content,
                "images": abs_images,
                "date": tip.date,
                "view": tip.view,
            }
        ),
        200,
    )


# ✅ 차량 TIP 조회수 증가
@carTIP_bp.route("/<int:carTIP_id>/view", methods=["POST"])
def increment_carTIP_view(carTIP_id):
    carTIP = CarTIP.query.get(carTIP_id)
    if not carTIP:
        return jsonify({"error": "CarTIP not found"}), 404

    carTIP.view += 1
    db.session.commit()
    return jsonify({"message": "View incremented"}), 200


@carTIP_bp.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_DIR, filename)


# ✅ 차량 TIP 조회수 증가
@carTIP_bp.route("/<int:carTIP_id>/view", methods=["POST"])
def increment_cartip_view(carTIP_id):
    cartip = CarTIP.query.get(carTIP_id)
    if not cartip:
        return jsonify({"error": "CarTIP not found"}), 404

    cartip.view += 1
    db.session.commit()
    return jsonify({"message": "View incremented"}), 200


# ✅ 이미지 파일 서빙
@carTIP_bp.route("/uploads/<path:filename>")
def serve_cartip_image(filename):
    return send_from_directory(UPLOAD_DIR, filename)


# ✅ 차량 TIP 수정
@carTIP_bp.route("/<int:carTIP_id>", methods=["PATCH"])
def update_cartip(carTIP_id):
    cartip = CarTIP.query.get(carTIP_id)
    if not cartip:
        return jsonify({"error": "CarTIP not found"}), 404

    title = request.form.get("title")
    content = request.form.get("content")
    prev_images = request.form.getlist("prevImages")
    new_images = request.files.getlist("images")

    cartip.title = title
    cartip.content = content

    new_image_urls = []
    for image in new_images:
        ext = os.path.splitext(image.filename)[1]
        unique_filename = (
            f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}{ext}"
        )
        save_path = os.path.join(UPLOAD_DIR, unique_filename)
        image.save(save_path)
        image_url = f"/carTIP/uploads/{unique_filename}"
        new_image_urls.append(image_url)

    cartip.images = prev_images + new_image_urls

    db.session.commit()

    return jsonify({"message": "차량 TIP이 수정되었습니다."}), 200


# ✅ 차량 TIP 삭제
@carTIP_bp.route("/<int:carTIP_id>", methods=["DELETE"])
def delete_cartip(carTIP_id):  # ✅ 고침
    cartip = CarTIP.query.get(carTIP_id)
    if not cartip:
        return jsonify({"error": "CarTIP not found"}), 404

    db.session.delete(cartip)
    db.session.commit()
    return jsonify({"message": "차량 TIP이 삭제되었습니다."}), 200
