from flask import Blueprint, request, jsonify, current_app
from ..models.sale_model import Sale
from ..extensions import db
from werkzeug.utils import secure_filename
import os, json, datetime
from flask_jwt_extended import jwt_required
from urllib.parse import urlparse

sale_bp = Blueprint("sale", __name__)


# 계층형 normal_tags 생성 함수 (매물 등록 api)
def create_normal_tags(manufacturer, model, sub_model, grade):
    return {
        "manufacturer": manufacturer,
        "models": [
            {"name": model, "subModels": [{"name": sub_model, "grades": [grade]}]}
        ],
    }


# 매물 등록 api
@sale_bp.route("/uploadSale", methods=["POST"])
@jwt_required()
def register_sale():
    try:
        data = request.get_json(silent=True) or {}

        # 계층형 구조로 만듦
        manufacturer = data.get("manufacturer")
        model = data.get("model")
        sub_model = data.get("sub_model")
        grade = data.get("grade")
        normal_tags = create_normal_tags(manufacturer, model, sub_model, grade)

        # DB 행 하나의 구성
        sale = Sale(
            name=data.get("name"),
            fuel=data.get("fuel"),
            type=data.get("type"),
            trim=data.get("trim"),
            year=data.get("year"),
            mileage=data.get("mileage"),
            color=data.get("color"),
            price=data.get("price"),
            car_number=data.get("car_number"),
            vin=data.get("vin"),
            accident_info=data.get("accident_info"),
            combination_info=data.get("combination_info"),
            manufacturer=data.get("manufacturer"),
            model=data.get("model"),
            sub_model=data.get("sub_model"),
            grade=data.get("grade"),
            transmission=data.get("transmission"),
            thumbnail=data.get("thumbnail"),
            content=data.get("content"),
            status=data.get("status"),
            images=data.get("images") if isinstance(data.get("images"), list) else [],
            simple_tags=data.get("simple_tags"),
            normal_tags=normal_tags,
        )

        db.session.add(sale)
        db.session.commit()

        return jsonify({"message": "등록 성공", "sale": sale.to_dict()}), 201

    except Exception as e:
        return jsonify({"error" "detail": str(e)}), 400


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
    if not raw:
        return None
    if isinstance(raw, (list, dict)):
        return raw
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except Exception:
            return None
    return None


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


def flatten_tags(tags: dict) -> dict:
    """중첩 tags({manufacturer, models[0].name, ...})를 평탄화해서 반환"""
    out = {"manufacturer": "", "model": "", "subModel": "", "grade": ""}
    if not isinstance(tags, dict):
        return out

    out["manufacturer"] = tags.get("manufacturer", "") or ""
    models = tags.get("models")
    if isinstance(models, list) and models:
        m0 = models[0] if isinstance(models[0], dict) else {}
        out["model"] = m0.get("name", "") or ""
        subs = m0.get("subModels")
        if isinstance(subs, list) and subs:
            s0 = subs[0] if isinstance(subs[0], dict) else {}
            out["subModel"] = s0.get("name", "") or ""
            grades = s0.get("grades")
            if isinstance(grades, list) and grades:
                out["grade"] = grades[0] or ""
    return out


def parse_bool(v):
    if v is None:
        return None
    if isinstance(v, bool):
        return v
    if isinstance(v, (int, float)):
        return bool(v)
    if isinstance(v, str):
        s = v.strip().lower()
        if s in ("true", "1", "yes", "y", "on"):
            return True
        if s in ("false", "0", "no", "n", "off"):
            return False
    return None


# 전체 데이터 조회
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
            st = sale.simple_tags or None
            if isinstance(st, str):
                try:
                    st = json.loads(st)
                except json.JSONDecodeError:
                    st = None

            ok = False
            if isinstance(st, dict):
                ok = st.get("type") == simple_type and st.get("grade") == simple_grade
            elif isinstance(st, list):
                ok = any(
                    isinstance(tag, dict)
                    and tag.get("type") == simple_type
                    and tag.get("grade") == simple_grade
                    for tag in st
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


def delete_file_if_exists(web_path: str | None):
    if not web_path:
        return
    try:
        if web_path.startswith("http://") or web_path.startswith("https://"):
            web_path = urlparse(web_path).path
        abs_path = os.path.join(current_app.root_path, web_path.lstrip("/"))
        if os.path.exists(abs_path):
            os.remove(abs_path)
    except Exception as e:
        current_app.logger.warning(f"thumb delete fail: {e}")


def apply_if_present(val, current):
    if val is None:
        return current
    if isinstance(val, str) and val.strip() == "":
        return current
    return val


@sale_bp.route("/<int:sale_id>", methods=["PUT"])
@jwt_required()
def update_sale(sale_id):
    sale = Sale.query.get_or_404(sale_id)

    ct = (request.content_type or "").lower()
    is_multipart = ct.startswith("multipart/form-data")
    form = request.form if is_multipart else None
    files = request.files if is_multipart else None
    data = None if is_multipart else (request.get_json(silent=True) or {})

    raw_status = form.get("status") if is_multipart else data.get("status")
    parsed_status = parse_bool(raw_status)
    if parsed_status is not None:
        sale.status = parsed_status

    thumb_state = (
        (
            (
                form.get("thumbnail_state")
                if is_multipart
                else data.get("thumbnail_state")
            )
            or "keep"
        )
        .strip()
        .lower()
    )

    def get_val(key, default=""):
        return (form.get(key) if is_multipart else data.get(key)) or default

    sale.name = get_val("name", sale.name)
    sale.fuel = get_val("fuel", sale.fuel)
    sale.type = get_val("type", sale.type)
    sale.trim = get_val("trim", sale.trim)
    sale.year = to_int_or_none(get_val("year", sale.year))
    sale.mileage = to_int_or_none(get_val("mileage", sale.mileage))
    sale.color = get_val("color", sale.color)
    sale.price = to_int_or_none(get_val("price", sale.price))
    sale.content = get_val("content", sale.content)
    sale.transmission = get_val("transmission", sale.transmission)

    raw_tags = form.get("tags") if is_multipart else data.get("tags")
    tags = parse_tag(raw_tags)
    if tags:
        sale.tags = tags
        flat = flatten_tags(tags)
        sale.manufacturer = flat["manufacturer"]
        sale.model = flat["model"]
        sale.sub_model = flat["subModel"]
        sale.grade = flat["grade"]

    raw_simple_tags = (
        form.get("simple_tags") if is_multipart else data.get("simple_tags")
    )
    sale.simple_tags = parse_simple_tags(raw_simple_tags)

    if thumb_state == "remove":
        delete_file_if_exists(sale.thumbnail)
        sale.thumbnail = None
    elif is_multipart and thumb_state == "new" and files and files.get("thumbnail"):
        delete_file_if_exists(sale.thumbnail)
        sale.thumbnail = save_uploaded_file(files.get("thumbnail"))
    elif not is_multipart and "thumbnail" in data:
        tv = data.get("thumbnail")
        if tv in (None, "", "null"):
            delete_file_if_exists(sale.thumbnail)
            sale.thumbnail = None
        else:
            sale.thumbnail = tv

    if is_multipart:
        existing_urls = form.getlist("originImages") or []
        incoming_files = files.getlist("images") or []
        valid_files = [f for f in incoming_files if getattr(f, "filename", None)]
        new_urls = [save_uploaded_file(f) for f in valid_files]
        sale.images = existing_urls + new_urls
    else:
        if "images" in data:
            if isinstance(data["images"], list):
                sale.images = data["images"]
            else:
                try:
                    sale.images = json.loads(data["images"])
                except Exception:
                    pass

    db.session.commit()
    return jsonify({"message": "success", "sale": sale.to_dict()}), 200


# 삭제 api
@sale_bp.route("/<int:sale_id>", methods=["DELETE"])
@jwt_required()
def delete_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if sale is None:
        return jsonify({"error": "해당 매물을 찾을 수 없습니다."}), 404
    db.session.delete(sale)
    db.session.commit()
    return jsonify({"message": "삭제 성공"}), 200
