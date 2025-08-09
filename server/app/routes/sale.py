from flask import Blueprint, request, jsonify, current_app
from ..models.sale_model import Sale
from ..extensions import db
from werkzeug.utils import secure_filename
import os, json, datetime

sale_bp = Blueprint("sale", __name__)


# =========================
# Helpers (라우트 데코레이터 절대 X)
# =========================
def upload_dir_path():
    """업로드 폴더 생성/반환"""
    upload_dir = os.path.join(current_app.root_path, "static", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    return upload_dir


def save_uploaded_file(f):
    """파일 저장 후 /static/uploads/파일명 경로 반환"""
    base = upload_dir_path()
    ts = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    filename = f"{ts}_{secure_filename(f.filename)}"
    f.save(os.path.join(base, filename))
    return f"/static/uploads/{filename}"


def parse_tag(raw):
    """tag는 dict 또는 JSON 문자열 가능"""
    if not raw:
        return {}
    if isinstance(raw, dict):
        return raw
    try:
        return json.loads(raw)
    except Exception:
        return {}


def parse_simple_tags(raw):
    """simple_tags도 dict list 또는 JSON 문자열 가능 → 최종은 JSON 문자열로 저장"""
    if not raw:
        return "[]"
    if isinstance(raw, (list, dict)):
        try:
            return json.dumps(raw, ensure_ascii=False)
        except Exception:
            return "[]"
    if isinstance(raw, str):
        # 이미 문자열이면 유효성만 가볍게 확인
        try:
            json.loads(raw)
            return raw
        except Exception:
            return "[]"
    return "[]"


def to_int_or_none(v):
    if v is None:
        return None
    s = str(v).strip()
    if s == "":
        return None
    try:
        return int(s)
    except Exception:
        return None


# =========================
# Create
# =========================
@sale_bp.route("/uploadSale", methods=["POST"])
def register_sale():
    try:
        ct = (request.content_type or "").lower()

        if ct.startswith("multipart/form-data"):
            form, files = request.form, request.files

            tag = parse_tag(form.get("tag"))

            thumb_url = ""
            if files.get("thumbnail"):
                thumb_url = save_uploaded_file(files.get("thumbnail"))

            img_urls = []
            for f in files.getlist("images"):
                img_urls.append(save_uploaded_file(f))

            sale = Sale(
                name=form.get("name"),
                fuel=form.get("fuel"),
                type=form.get("type"),
                trim=form.get("trim"),
                year=to_int_or_none(form.get("year")),
                mileage=to_int_or_none(form.get("mileage")) or 0,
                color=form.get("color"),
                price=to_int_or_none(form.get("price")),
                manufacturer=tag.get("manufacturer", ""),
                model=tag.get("model", ""),
                sub_model=tag.get("subModel", ""),
                grade=tag.get("grade", ""),
                transmission=form.get("transmission"),
                thumbnail=thumb_url,
                content=form.get("content"),
                images=json.dumps(img_urls, ensure_ascii=False),
                simple_tags=parse_simple_tags(form.get("simple_tags")),
            )

        else:
            data = request.get_json(silent=True) or {}
            tag = parse_tag(data.get("tag"))

            sale = Sale(
                name=data.get("name"),
                fuel=data.get("fuel"),
                type=data.get("type"),
                trim=data.get("trim"),
                year=to_int_or_none(data.get("year")),
                mileage=to_int_or_none(data.get("mileage")) or 0,
                color=data.get("color"),
                price=to_int_or_none(data.get("price")),
                manufacturer=tag.get("manufacturer", ""),
                model=tag.get("model", ""),
                sub_model=tag.get("subModel", ""),
                grade=tag.get("grade", ""),
                transmission=data.get("transmission"),
                thumbnail=(data.get("thumbnail") or ""),
                content=data.get("content"),
                images=(
                    json.dumps(data.get("images"), ensure_ascii=False)
                    if isinstance(data.get("images"), list)
                    else (data.get("images") or "[]")
                ),
                simple_tags=parse_simple_tags(data.get("simple_tags")),
            )

        db.session.add(sale)
        db.session.commit()
        return jsonify({"message": "등록 성공", "car": sale.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": "create failed", "detail": str(e)}), 400


# =========================
# Read (list / detail)
# =========================
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

    sales = query.order_by(Sale.id.desc()).all()

    result = []
    for sale in sales:
        if simple_type and simple_grade:
            tags = sale.simple_tags or []
            if isinstance(tags, str):
                try:
                    tags = json.loads(tags)
                except json.JSONDecodeError:
                    tags = []
            ok = any(
                isinstance(tag, dict)
                and tag.get("type") == simple_type
                and tag.get("grade") == simple_grade
                for tag in tags
            )
            if not ok:
                continue
        result.append(sale.to_dict())

    return jsonify(result), 200


@sale_bp.route("/<int:sale_id>", methods=["GET"])
def get_sale_by_id(sale_id):
    sale = Sale.query.get(sale_id)
    if sale is None:
        return jsonify({"error": "해당 매물을 찾을 수 없습니다."}), 404
    return jsonify(sale.to_dict()), 200


# =========================
# Update
# =========================
@sale_bp.route("/<int:sale_id>", methods=["PUT"])
def update_sale(sale_id):
    try:
        sale = Sale.query.get(sale_id)
        if sale is None:
            return jsonify({"error": "해당 매물을 찾을 수 없습니다."}), 404

        ct = (request.content_type or "").lower()

        if ct.startswith("multipart/form-data"):
            form, files = request.form, request.files

            sale.name = form.get("name", sale.name)
            sale.fuel = form.get("fuel", sale.fuel)
            sale.type = form.get("type", sale.type)
            sale.trim = form.get("trim", sale.trim)
            sale.content = form.get("content", sale.content)

            year = to_int_or_none(form.get("year"))
            if year is not None:
                sale.year = year

            mileage = to_int_or_none(form.get("mileage"))
            if mileage is not None:
                sale.mileage = mileage

            color = form.get("color")
            if color is not None:
                sale.color = color

            price = to_int_or_none(form.get("price"))
            if price is not None:
                sale.price = price

            tag = parse_tag(form.get("tag"))
            if tag:
                sale.manufacturer = tag.get("manufacturer", sale.manufacturer)
                sale.model = tag.get("model", sale.model)
                sale.sub_model = tag.get("subModel", sale.sub_model)
                sale.grade = tag.get("grade", sale.grade)

            # 썸네일
            if files.get("thumbnail"):
                sale.thumbnail = save_uploaded_file(files.get("thumbnail"))
            else:
                thumb_url = form.get("thumbnail_url")
                if (
                    thumb_url
                    and isinstance(thumb_url, str)
                    and not thumb_url.startswith("blob:")
                ):
                    sale.thumbnail = thumb_url

            # 추가 이미지
            imgs = files.getlist("images")
            if imgs:
                new_urls = [save_uploaded_file(f) for f in imgs]
                try:
                    current = (
                        json.loads(sale.images or "[]")
                        if isinstance(sale.images, str)
                        else (sale.images or [])
                    )
                except Exception:
                    current = []
                merged = (current or []) + new_urls
                sale.images = json.dumps(merged, ensure_ascii=False)

            db.session.commit()
            return jsonify({"message": "수정 성공", "car": sale.to_dict()}), 200

        # ----- JSON -----
        data = request.get_json(silent=True) or {}

        sale.name = data.get("name", sale.name)
        sale.fuel = data.get("fuel", sale.fuel)
        sale.type = data.get("type", sale.type)
        sale.trim = data.get("trim", sale.trim)
        sale.content = data.get("content", sale.content)

        year = to_int_or_none(data.get("year"))
        if year is not None:
            sale.year = year

        mileage = to_int_or_none(data.get("mileage"))
        if mileage is not None:
            sale.mileage = mileage

        if "color" in data:
            sale.color = data.get("color") or sale.color

        price = to_int_or_none(data.get("price"))
        if price is not None:
            sale.price = price

        tag = parse_tag(data.get("tag"))
        if tag:
            sale.manufacturer = tag.get("manufacturer", sale.manufacturer)
            sale.model = tag.get("model", sale.model)
            sale.sub_model = tag.get("subModel", sale.sub_model)
            sale.grade = tag.get("grade", sale.grade)

        if "thumbnail" in data:
            val = data["thumbnail"]
            if isinstance(val, str) and val.strip() and not val.startswith("blob:"):
                sale.thumbnail = val

        if "images" in data:
            imgs = data["images"]
            if isinstance(imgs, list):
                sale.images = json.dumps(imgs, ensure_ascii=False)
            elif isinstance(imgs, str):
                sale.images = imgs

        db.session.commit()
        return jsonify({"message": "수정 성공", "car": sale.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": "update failed", "detail": str(e)}), 400


# =========================
# Delete
# =========================
@sale_bp.route("/<int:sale_id>", methods=["DELETE"])
def delete_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if sale is None:
        return jsonify({"error": "해당 매물을 찾을 수 없습니다."}), 404
    db.session.delete(sale)
    db.session.commit()
    return jsonify({"message": "삭제 성공"}), 200
