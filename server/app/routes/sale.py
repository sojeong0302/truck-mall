# server/routes/car.py

from flask import Blueprint, request, jsonify
from ..models.sale_model import Sale
from ..extensions import db

sale_bp = Blueprint("sale", __name__)


@sale_bp.route("/", methods=["POST"])
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
    )

    db.session.add(sale)
    db.session.commit()

    return jsonify({"message": "등록 성공", "car": sale.to_dict()}), 201
