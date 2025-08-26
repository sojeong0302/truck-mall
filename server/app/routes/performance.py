from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.sale_model import Sale
from ..models.performance_model import PerformanceInspection

bp = Blueprint("performance", __name__, url_prefix="/performance")


# ▶ 등록/수정 (업서트)
@bp.post("")
def upsert_performance():
    """
    JSON Body:
    {
      "performance_number": "P-2025-0001",  # 필수
      "images": ["url1", "url2"]            # 1~2장, 필수
    }
    """
    data = request.get_json(silent=True) or {}
    perf_no = (data.get("performance_number") or "").strip()
    images = data.get("images")

    # --- 최소 검증 ---
    if not perf_no:
        return jsonify({"error": "performance_number is required"}), 400
    if not isinstance(images, list) or not (1 <= len(images) <= 2):
        return jsonify({"error": "images must be a list of length 1~2"}), 400
    if any((not isinstance(u, str) or not u.strip()) for u in images):
        return jsonify({"error": "images must contain non-empty strings"}), 400

    # 연결된 매물 존재 여부 확인
    sale = Sale.query.filter_by(performance_number=perf_no).first()
    if not sale:
        return jsonify({"error": "No Sale with this performance_number"}), 404

    # 업서트
    pi = PerformanceInspection.query.filter_by(performance_number=perf_no).first()
    if pi:
        pi.images = images
    else:
        pi = PerformanceInspection(performance_number=perf_no, images=images)
        db.session.add(pi)

    db.session.commit()
    return jsonify(pi.to_dict()), 200


# ▶ 조회 (상태점검보기)
@bp.get("/<performance_number>")
def get_performance(performance_number):
    pi = PerformanceInspection.query.filter_by(
        performance_number=performance_number
    ).first()
    if not pi:
        return jsonify({"error": "not found"}), 404
    return jsonify(pi.to_dict()), 200


# ▶ (선택) 삭제
@bp.delete("/<performance_number>")
def delete_performance(performance_number):
    pi = PerformanceInspection.query.filter_by(
        performance_number=performance_number
    ).first()
    if not pi:
        return jsonify({"error": "not found"}), 404
    db.session.delete(pi)
    db.session.commit()
    return jsonify({"ok": True}), 200
