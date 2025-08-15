from flask import Blueprint, request, jsonify, current_app
from ..models.sale_model import Sale
from ..extensions import db
from werkzeug.utils import secure_filename
import os, json, datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from urllib.parse import urlparse

sale_bp = Blueprint("sale", __name__)


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


# 등록 api
@sale_bp.route("/uploadSale", methods=["POST"])
@jwt_required()
def register_sale():
    try:
        ct = (request.content_type or "").lower()
        if ct.startswith("multipart/form-data"):
            form, files = request.form, request.files

            tags = {}
            tags_raw = form.get("tags")
            if tags_raw:
                try:
                    tags = (
                        json.loads(tags_raw) if isinstance(tags_raw, str) else tags_raw
                    )
                except Exception as e:
                    current_app.logger.warning(f"tags 파싱 실패: {e}")

            thumb_url = ""
            if files.get("thumbnail"):
                thumb_url = save_uploaded_file(files.get("thumbnail"))

            img_files = files.getlist("images") or files.getlist("images[]")
            valid_files = [f for f in img_files if getattr(f, "filename", None)]
            img_urls = [save_uploaded_file(f) for f in valid_files]
            sale = Sale(
                name=form.get("name"),
                fuel=form.get("fuel"),
                type=form.get("type"),
                trim=form.get("trim"),
                year=to_int_or_none(form.get("year")),
                mileage=to_int_or_none(form.get("mileage")),
                color=form.get("color"),
                price=to_int_or_none(form.get("price")),
                manufacturer=tags.get("manufacturer", ""),
                model=tags.get("model", ""),
                sub_model=tags.get("subModel", ""),
                grade=tags.get("grade", ""),
                transmission=form.get("transmission"),
                thumbnail=thumb_url,
                content=form.get("content"),
                images=img_urls,
                simple_tags=parse_simple_tags(form.get("simple_tags")),
                tags=tags,
                status=True,
            )

        else:
            data = request.get_json(silent=True) or {}
            tags = parse_tag(data.get("tags"))

            sale = Sale(
                name=data.get("name"),
                fuel=data.get("fuel"),
                type=data.get("type"),
                trim=data.get("trim"),
                year=to_int_or_none(data.get("year")),
                mileage=to_int_or_none(data.get("mileage")),
                color=data.get("color"),
                price=to_int_or_none(data.get("price")),
                manufacturer=tags.get("manufacturer", ""),
                model=tags.get("model", ""),
                sub_model=tags.get("subModel", ""),
                grade=tags.get("grade", ""),
                transmission=data.get("transmission"),
                thumbnail=(data.get("thumbnail") or ""),
                content=data.get("content"),
                images=(
                    json.dumps(data.get("images"), ensure_ascii=False)
                    if isinstance(data.get("images"), list)
                    else (data.get("images") or "[]")
                ),
                simple_tags=parse_simple_tags(data.get("simple_tags")),
                tags=tags,
                status=True,
            )
        db.session.add(sale)
        db.session.commit()
        return jsonify({"message": "등록 성공", "car": sale.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": "create failed", "detail": str(e)}), 400


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


# 수정 api
# @sale_bp.route("/<int:sale_id>", methods=["PUT"])
# @jwt_required()
# def update_sale(sale_id):
#     sale = Sale.query.get_or_404(sale_id)

#     ct = (request.content_type or "").lower()

#     if ct.startswith("multipart/form-data"):
#         form, files = request.form, request.files

#         if "status" in form:
#             status_val = (form.get("status") or "").lower()
#             sale.status = status_val in ["true", "1", "yes"]
#         # tags 처리
#         tags_raw = form.get("tags")
#         if tags_raw:
#             try:
#                 tags = json.loads(tags_raw) if isinstance(tags_raw, str) else tags_raw
#                 sale.tags = tags  # 전체 계층 구조 저장
#                 sale.manufacturer = tags.get("manufacturer", "")
#                 sale.model = tags.get("model", "")
#                 sale.sub_model = tags.get("subModel", "")
#                 sale.grade = tags.get("grade", "")
#             except Exception as e:
#                 current_app.logger.warning(f"tags 파싱 실패: {e}")

#         sale.year = to_int_or_none(form.get("year"))
#         sale.price = to_int_or_none(form.get("price"))
#         sale.mileage = to_int_or_none(form.get("mileage"))
#         sale.name = form.get("name") or ""
#         sale.fuel = form.get("fuel") or ""
#         sale.type = form.get("type") or ""
#         sale.trim = form.get("trim") or ""
#         sale.color = form.get("color") or ""
#         sale.content = form.get("content") or ""
#         sale.transmission = form.get("transmission") or ""

#         # 썸네일
#         if files.get("thumbnail"):
#             sale.thumbnail = save_uploaded_file(files.get("thumbnail"))

#         # 기존 이미지 URL
#         existing_urls = []
#         if form.get("originURLs"):
#             try:
#                 existing_urls = json.loads(form.get("originURLs"))
#             except Exception as e:
#                 current_app.logger.warning(f"originURLs 파싱 실패: {e}")

#         # 새 파일 처리
#         incoming_files = files.getlist("images") or files.getlist("images[]")
#         valid_files = [f for f in incoming_files if getattr(f, "filename", None)]
#         new_urls = [save_uploaded_file(f) for f in valid_files]

#         # 합치기
#         final_urls = existing_urls + new_urls

#         # DB 저장 (컬럼 타입에 따라)
#         sale.images = final_urls  # JSON 컬럼
#         # sale.images = json.dumps(final_urls, ensure_ascii=False)  # TEXT 컬럼이면

#         sale.simple_tags = parse_simple_tags(form.get("simple_tags"))

#     else:
#         # JSON 요청일 경우
#         data = request.get_json(silent=True) or {}

#         # ✅ status만 넘어올 수도 있으니 먼저 처리
#         if "status" in data:
#             sale.status = bool(data.get("status"))

#         # ✅ tag가 없을 수도 있으니 안전하게 처리
#         tag = parse_tag(data.get("tag")) if data.get("tag") else {}
#         if isinstance(tag, dict):
#             sale.manufacturer = tag.get("manufacturer", "")
#             sale.model = tag.get("model", "")
#             sale.sub_model = tag.get("subModel", "")
#             sale.grade = tag.get("grade", "")

#         # 이하 나머지 필드 처리
#         sale.year = to_int_or_none(data.get("year"))
#         sale.price = to_int_or_none(data.get("price"))
#         sale.mileage = to_int_or_none(data.get("mileage"))
#         sale.name = data.get("name") or ""
#         sale.fuel = data.get("fuel") or ""
#         sale.type = data.get("type") or ""
#         sale.trim = data.get("trim") or ""
#         sale.color = data.get("color") or ""
#         sale.content = data.get("content") or ""

#         if data.get("thumbnail") is not None:
#             sale.thumbnail = data.get("thumbnail") or ""

#         if data.get("images") is not None:
#             if isinstance(data.get("images"), list):
#                 sale.images = json.dumps(data.get("images"), ensure_ascii=False)
#             else:
#                 sale.images = data.get("images") or "[]"

#         sale.simple_tags = parse_simple_tags(data.get("simple_tags"))
#     db.session.commit()
#     return jsonify({"message": "success", "sale": sale.to_dict()})


def delete_file_if_exists(web_path: str | None):
    if not web_path:
        return
    try:
        if web_path.startswith("http://") or web_path.startswith("https://"):
            web_path = urlparse(web_path).path  # "/static/uploads/xxx.png" 로 변환
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
        sale.manufacturer = tags.get("manufacturer", "")
        sale.model = tags.get("model", "")
        sale.sub_model = tags.get("subModel", "")
        sale.grade = tags.get("grade", "")

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
