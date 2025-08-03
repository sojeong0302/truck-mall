from flask import Blueprint, request, jsonify, send_from_directory
from app.extensions import db
from app.models.review_model import Review
from app.models.carTIP_model import CarTIP
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename

carTIP_bp = Blueprint("carTIP", __name__)

UPLOAD_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "carTIP")
)
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ✅ 차량 TIP 전체 리스트 조회
@carTIP_bp.route("/list", methods=["GET"])
def get_carTIP_list():
    carTIPs = CarTIP.query.order_by(CarTIP.id.desc()).all()

    result = [
        {
            "id": tip.id,
            "title": tip.title,
            "content": tip.content,
            "images": tip.images,
            "date": tip.date,
            "view": tip.view,
        }
        for tip in carTIPs
    ]
    return jsonify(result), 200


# ✅ 리뷰 업로드
@carTIP_bp.route("/uploadCarTIP", methods=["POST"])
def create_carTIP():
    title = request.form.get("title")
    content = request.form.get("content")
    images = request.files.getlist("images")
    date = datetime.now().strftime("%Y-%m-%d")
    view = 0

    saved_image_paths = []

    for image in images:
        ext = os.path.splitext(image.filename)[1]
        unique_filename = (
            f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}{ext}"
        )
        save_path = os.path.join(UPLOAD_DIR, unique_filename)
        image.save(save_path)

        # ✅ 저장할 경로는 외부에서 접근 가능한 URL로
        image_url = f"http://localhost:5000/carTIP/uploads/{unique_filename}"
        saved_image_paths.append(image_url)

    new_carTIP = CarTIP(
        title=title,
        images=saved_image_paths,
        content=content,
        date=date,
        view=view,
    )
    db.session.add(new_carTIP)
    db.session.commit()

    return jsonify({"message": "리뷰가 등록되었습니다."}), 201


# ✅ 특정 차량 TIP 상세 조회
@carTIP_bp.route("/<int:carTIP_id>", methods=["GET"])
def get_carTIP(carTIP_id):
    carTIP = CarTIP.query.get(carTIP_id)
    if not carTIP:
        return jsonify({"error": "CarTIP not found"}), 404

    return (
        jsonify(
            {
                "id": carTIP.id,
                "title": carTIP.title,
                "content": carTIP.content,
                "images": carTIP.images,
                "date": carTIP.date,
                "view": carTIP.view,
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
