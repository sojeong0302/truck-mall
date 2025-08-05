from flask import Blueprint, request, jsonify
from ..models.sale_model import Sale
from ..extensions import db
import json

sale_bp = Blueprint("sale", __name__)


@sale_bp.route("/uploadSale", methods=["POST"])
def register_sale():
    data = request.get_json()
    simple_tags = data.get("simple_tags", [])

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
        transmission=data.get("transmission"),
        thumbnail=data.get("thumbnail"),
        content=data.get("content"),
        images=data.get("images"),
        simple_tags=simple_tags,
    )

    db.session.add(sale)
    db.session.commit()

    return jsonify({"message": "등록 성공", "car": sale.to_dict()}), 201


@sale_bp.route("/list", methods=["GET"])
def get_sales():
    simple_type = request.args.get("simple_type")
    simple_grade = request.args.get("simple_grade")

    manufacturer = request.args.get("manufacturer")
    model = request.args.get("model")
    sub_model = request.args.get("sub_model")
    grade = request.args.get("grade")
    transmission = request.args.get("transmission")

    min_price = request.args.get("min_price", type=int)
    max_price = request.args.get("max_price", type=int)
    min_year = request.args.get("min_year", type=int)
    max_year = request.args.get("max_year", type=int)

    # ✅ query 객체로 필터 조건을 누적
    query = Sale.query

    if manufacturer:
        query = query.filter(Sale.manufacturer == manufacturer)
    if model:
        query = query.filter(Sale.model == model)
    if sub_model:
        query = query.filter(Sale.sub_model == sub_model)
    if grade:
        query = query.filter(Sale.grade == grade)
    if transmission:
        query = query.filter(Sale.transmission == transmission)
    if min_price is not None:
        query = query.filter(Sale.price >= min_price)
    if max_price is not None:
        query = query.filter(Sale.price <= max_price)
    if min_year is not None:
        query = query.filter(Sale.year >= min_year)
    if max_year is not None:
        query = query.filter(Sale.year <= max_year)

    query = query.order_by(Sale.id.desc())
    sales = query.all()

    result = []

    for sale in sales:
        # ✅ simple_tag 조건은 여전히 따로 검사
        if simple_type and simple_grade:
            tags = sale.simple_tags or []
            if isinstance(tags, str):
                try:
                    tags = json.loads(tags)
                except json.JSONDecodeError:
                    tags = []

            if not any(
                isinstance(tag, dict)
                and tag.get("type") == simple_type
                and tag.get("grade") == simple_grade
                for tag in tags
            ):
                continue

        result.append(sale.to_dict())

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
