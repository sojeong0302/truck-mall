from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.review_model import Review
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import uuid


review_bp = Blueprint("review", __name__)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # ❗ uploads 폴더가 없으면 생성


@review_bp.route("/uploadReview", methods=["POST"])
def create_review():
    title = request.form.get("title")
    content = request.form.get("content")
    images = request.files.getlist("images")  # ✅ 여기서 images 정의
    date = datetime.now().strftime("%Y-%m-%d")

    view = 0

    saved_image_paths = []

    for image in images:
        # 1. 파일 확장자 얻기
        ext = os.path.splitext(image.filename)[1]

        # 2. 고유한 파일명 생성 (timestamp + uuid)
        unique_filename = (
            f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}{ext}"
        )

        # 3. 저장 경로 생성
        save_path = os.path.join(UPLOAD_DIR, unique_filename)

        # 4. 파일 저장
        image.save(save_path)

        # 5. DB에 저장할 경로 추가
        saved_image_paths.append(save_path)

    # Review 모델 저장
    new_review = Review(
        title=title,
        images=saved_image_paths,  # 저장된 이미지 경로 리스트
        content=content,
        date=date,
        view=view,
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify({"message": "리뷰가 등록되었습니다."}), 201


@review_bp.route("/list", methods=["GET"])
def get_review_list():
    reviews = Review.query.order_by(Review.id.desc()).all()  # 최신순
    result = []

    for review in reviews:
        result.append(
            {
                "id": review.id,
                "title": review.title,
                "content": review.content,
                "images": review.images,  # JSON으로 저장된 리스트
                "date": review.date,
                "view": review.view,
            }
        )

    return jsonify(result), 200
