from flask import Blueprint, request, jsonify, current_app
from ..models.sale_model import Sale
from ..extensions import db
from werkzeug.utils import secure_filename
import os, json, datetime
from flask_jwt_extended import jwt_required
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
        form = request.form
        files = request.files

        # string -> dict
        normal_tags = parse_tag(form.get("normal_tags"))
        simple_tags = parse_tag(form.get("simple_tags"))

        sale = Sale(
            # 차량 정보
            name=form.get("name"),
            car_number=form.get("car_number"),
            price=to_int_or_none(form.get("price")),
            year=to_int_or_none(form.get("year")),
            fuel=form.get("fuel"),
            transmission=form.get("transmission"),
            color=form.get("color"),
            mileage=to_int_or_none(form.get("mileage")),
            vin=form.get("vin"),
            # 제시/성능 번호
            suggest_number=form.get("suggest_number"),
            performance_number=form.get("performance_number"),
            # 필터 정보
            manufacturer=form.get("manufacturer"),
            model=form.get("model"),
            sub_model=form.get("sub_model"),
            grade=form.get("grade"),
            normal_tags=normal_tags,
            simple_tags=simple_tags,
            # 기타 정보
            thumbnail=None,  # 아래에서 처리
            content=form.get("content"),
            simple_content=form.get("simple_content"),
            images=[],  # 기타 이미지들 처리 예정
            status=True,
        )

        # 썸네일 저장
        if files.get("thumbnail"):
            sale.thumbnail = save_uploaded_file(files["thumbnail"])

        # 기타 이미지 저장 (이 코드 추가!)
        image_files = files.getlist("images")
        image_paths = []

        for image in image_files:
            if image and getattr(image, "filename", ""):
                path = save_uploaded_file(image)
                image_paths.append(path)

        sale.images = image_paths

        db.session.add(sale)
        db.session.commit()

        return jsonify({"message": "등록 성공", "sale": sale.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# 전체 매물 조회
@sale_bp.route("/list", methods=["GET"])
def get_sales():
    args = request.args
    query = Sale.query

    # 기본 필터
    if args.get("manufacturer"):
        query = query.filter(Sale.manufacturer == args["manufacturer"])
    if args.get("model"):
        query = query.filter(Sale.model == args["model"])
    if args.get("sub_model"):
        query = query.filter(Sale.sub_model == args["sub_model"])
    if args.get("grade"):
        query = query.filter(Sale.grade == args["grade"])
    if args.get("transmission"):
        query = query.filter(Sale.transmission == args["transmission"])

    # 숫자 필터
    if args.get("min_price", type=int) is not None:
        query = query.filter(Sale.price >= args.get("min_price", type=int))
    if args.get("max_price", type=int) is not None:
        query = query.filter(Sale.price <= args.get("max_price", type=int))
    if args.get("min_year", type=int) is not None:
        query = query.filter(Sale.year >= args.get("min_year", type=int))
    if args.get("max_year", type=int) is not None:
        query = query.filter(Sale.year <= args.get("max_year", type=int))

    # 전체 결과 조회
    sales = query.order_by(Sale.id.desc()).all()
    result = []

    # simple filter 처리
    simple_type = args.get("simple_type")
    simple_grade = args.get("simple_grade")

    for sale in sales:
        if simple_type and simple_grade:
            st = sale.simple_tags or {}
            if isinstance(st, str):
                try:
                    st = json.loads(st)
                except Exception:
                    st = {}

            match = False
            if isinstance(st, dict):
                match = (
                    st.get("type") == simple_type and st.get("grade") == simple_grade
                )
            elif isinstance(st, list):
                match = any(
                    tag.get("type") == simple_type and tag.get("grade") == simple_grade
                    for tag in st
                    if isinstance(tag, dict)
                )
            if not match:
                continue

        result.append(sale.to_dict())

    return jsonify(result), 200


# 특정 매물 조회
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


# 특정 매물 수정
from traceback import format_exc


@sale_bp.route("/<int:sale_id>", methods=["PUT"])
@jwt_required()
def update_sale(sale_id):
    try:
        # ⬇️ 기존 코드 전부 유지
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

        # 기본 정보
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

        # 추가 필드
        sale.car_number = get_val("car_number", sale.car_number)
        sale.vin = get_val("vin", sale.vin)
        sale.suggest_number = get_val("suggest_number", sale.suggest_number)
        sale.performance_number = get_val("performance_number", sale.performance_number)
        sale.simple_content = get_val("simple_content", sale.simple_content)

        # tags / normal_tags
        # normal_tags 및 필터 정보
        raw_tags = form.get("normal_tags") if is_multipart else data.get("normal_tags")
        normal_tags = parse_tag(raw_tags)
        if normal_tags:
            sale.normal_tags = normal_tags
            flat = flatten_tags(normal_tags)
            sale.manufacturer = flat["manufacturer"]
            sale.model = flat["model"]
            sale.sub_model = flat["subModel"]
            sale.grade = flat["grade"]

        # simple_tags
        raw_simple_tags = (
            form.get("simple_tags") if is_multipart else data.get("simple_tags")
        )
        sale.simple_tags = parse_simple_tags(raw_simple_tags)

        # 썸네일
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

        # 이미지
        if is_multipart:
            # 🔑 프론트 키 불일치 대비
            existing_urls = (
                form.getlist("originImages") or form.getlist("originURLs") or []
            )
            incoming_files = files.getlist("images") or []
            valid_files = [f for f in incoming_files if getattr(f, "filename", None)]
            new_urls = [save_uploaded_file(f) for f in valid_files]
            sale.images = existing_urls + new_urls
        else:
            if "images" in data:
                if isinstance(data["images"], list):
                    sale.images = data["images"]
                else:
                    sale.images = json.loads(data["images"])

        db.session.commit()
        return jsonify({"message": "success", "sale": sale.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error("update_sale error: %s\n%s", e, format_exc())
        return jsonify({"error": str(e)}), 500


# 삭제 api
@sale_bp.route("/<int:sale_id>", methods=["DELETE"])
@jwt_required()
def delete_sale(sale_id):
    sale = Sale.query.get_or_404(sale_id)

    # 썸네일 삭제
    delete_file_if_exists(sale.thumbnail)

    # 기타 이미지 삭제
    if isinstance(sale.images, list):
        for image_url in sale.images:
            delete_file_if_exists(image_url)

    db.session.delete(sale)
    db.session.commit()
    return jsonify({"message": "삭제 성공"}), 200
