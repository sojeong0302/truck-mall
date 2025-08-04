from flask import Blueprint, request, jsonify
from ..models.sale_model import Sale
from ..extensions import db

sale_bp = Blueprint("sale", __name__)


@sale_bp.route("/uploadSale", methods=["POST"])
def register_sale():
    data = request.get_json()

    sale = Sale(
        name=data.get("name"),
        fuel=data.get("fuel"),
        type=data.get("type"),
        trim=data.get("trim"),
        year=data.get("year"),
        mileage=data.get("mileage"),
        color=data.get("color"),
        price=data.get("price"),
        manufacturer=data.get("tag", {}).get("manufacturer", ""),
        model=data.get("tag", {}).get("model", ""),
        sub_model=data.get("tag", {}).get("subModel", ""),
        grade=data.get("tag", {}).get("grade", ""),
        thumbnail=data.get("thumbnail"),
        content=data.get("content"),
        images=data.get("images"),
    )

    db.session.add(sale)
    db.session.commit()

    return jsonify({"message": "등록 성공", "car": sale.to_dict()}), 201


@sale_bp.route("/list", methods=["GET"])
def get_sales():
    sales = Sale.query.order_by(Sale.id.desc()).all()  # 최신순 정렬 (원하면 변경 가능)
    result = [sale.to_dict() for sale in sales]
    return jsonify(result), 200


@sale_bp.route("/<int:sale_id>", methods=["GET"])
def get_sale_by_id(sale_id):
    sale = Sale.query.get(sale_id)
    if sale is None:
        return jsonify({"error": "해당 매물을 찾을 수 없습니다."}), 404

    return jsonify(sale.to_dict()), 200


@sale_bp.route("/<int:sale_id>", methods=["PUT"])
def update_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if sale is None:
        return jsonify({"error": "해당 매물을 찾을 수 없습니다."}), 404

    data = request.get_json()

    sale.name = data.get("name", sale.name)
    sale.fuel = data.get("fuel", sale.fuel)
    sale.type = data.get("type", sale.type)
    sale.trim = data.get("trim", sale.trim)
    sale.year = data.get("year", sale.year)
    sale.mileage = data.get("mileage", sale.mileage)
    sale.color = data.get("color", sale.color)
    sale.price = data.get("price", sale.price)
    sale.manufacturer = data.get("tag", {}).get("manufacturer", sale.manufacturer)
    sale.model = data.get("tag", {}).get("model", sale.model)
    sale.sub_model = data.get("tag", {}).get("subModel", sale.sub_model)
    sale.grade = data.get("tag", {}).get("grade", sale.grade)
    sale.thumbnail = data.get("thumbnail", sale.thumbnail)
    sale.content = data.get("content", sale.content)
    sale.images = data.get("images", sale.images)

    db.session.commit()

    return jsonify({"message": "수정 성공", "car": sale.to_dict()}), 200


@sale_bp.route("/<int:sale_id>", methods=["DELETE"])
def delete_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if sale is None:
        return jsonify({"error": "해당 매물을 찾을 수 없습니다."}), 404

    db.session.delete(sale)
    db.session.commit()

    return jsonify({"message": "삭제 성공"}), 200
