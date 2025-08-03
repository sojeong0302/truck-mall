from flask import Blueprint, request, jsonify, send_from_directory
from app.extensions import db
from app.models.review_model import Review
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename

review_bp = Blueprint("review", __name__)

UPLOAD_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "review")
)
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ✅ 리뷰 업로드
@review_bp.route("/uploadReview", methods=["POST"])
def create_review():
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
        image_url = f"http://localhost:5000/review/uploads/{unique_filename}"
        saved_image_paths.append(image_url)

    new_review = Review(
        title=title,
        images=saved_image_paths,
        content=content,
        date=date,
        view=view,
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify({"message": "리뷰가 등록되었습니다."}), 201


# ✅ 전체 리뷰 리스트
@review_bp.route("/list", methods=["GET"])
def get_review_list():
    reviews = Review.query.order_by(Review.id.desc()).all()
    result = []

    for review in reviews:
        result.append(
            {
                "id": review.id,
                "title": review.title,
                "content": review.content,
                "images": review.images,
                "date": review.date,
                "view": review.view,
            }
        )

    return jsonify(result), 200


# ✅ 특정 리뷰 상세 조회
@review_bp.route("/<int:review_id>", methods=["GET"])
def get_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found"}), 404

    db.session.commit()

    return (
        jsonify(
            {
                "id": review.id,
                "title": review.title,
                "content": review.content,
                "images": review.images,
                "date": review.date,
                "view": review.view,
            }
        ),
        200,
    )


@review_bp.route("/<int:review_id>/view", methods=["POST"])
def increment_view(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found"}), 404

    review.view += 1
    db.session.commit()
    return jsonify({"message": "View incremented"}), 200


# ✅ 이미지 파일 서빙
@review_bp.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_DIR, filename)


# ✅ 리뷰 수정
@review_bp.route("/<int:review_id>", methods=["PATCH"])
def update_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found"}), 404

    # 폼 데이터
    title = request.form.get("title")
    content = request.form.get("content")
    # 클라이언트에서 유지할 기존 이미지들
    prev_images = request.form.getlist("prevImages")
    new_images = request.files.getlist("images")

    # ✅ 제목과 내용 반영
    review.title = title
    review.content = content

    # 새 이미지 저장
    new_image_urls = []
    for image in new_images:
        ext = os.path.splitext(image.filename)[1]
        unique_filename = (
            f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}{ext}"
        )
        save_path = os.path.join(UPLOAD_DIR, unique_filename)
        image.save(save_path)
        image_url = f"http://localhost:5000/review/uploads/{unique_filename}"
        new_image_urls.append(image_url)

    # ✅ 완전 새로운 이미지 배열로 덮어쓰기 (삭제된 이미지 제거됨)
    review.images = prev_images + new_image_urls

    db.session.commit()

    return jsonify({"message": "리뷰가 수정되었습니다."}), 200


@review_bp.route("/<int:review_id>", methods=["DELETE"])
def delete_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found"}), 404

    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "리뷰가 삭제되었습니다."}), 200
