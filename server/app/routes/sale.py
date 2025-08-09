from flask import Blueprint, request, jsonify, current_app
from ..models.sale_model import Sale
from ..extensions import db
from werkzeug.utils import secure_filename
import os, json, datetime

sale_bp = Blueprint("sale", __name__)


@sale_bp.route("/uploadSale", methods=["POST"])
def register_sale():
    content_type = (request.content_type or "").lower()

    if content_type.startswith("multipart/form-data"):
        form = request.form
        files = request.files

        # 태그
        tag = _parse_tag(form.get("tag"))

        # 썸네일
        thumb_url = ""
        thumb_file = files.get("thumbnail")
        if thumb_file:
            thumb_url = _save_file(thumb_file)

        # 추가 이미지
        img_urls = []
        for f in files.getlist("images"):
            img_urls.append(_save_file(f))

        sale = Sale(
            name=form.get("name"),
            fuel=form.get("fuel"),
            type=form.get("type"),
            trim=form.get("trim"),
            year=form.get("year"),
            mileage=form.get("mileage"),
            color=form.get("color"),
            price=form.get("price"),
            manufacturer=tag.get("manufacturer", ""),
            model=tag.get("model", ""),
            sub_model=tag.get("subModel", ""),
            grade=tag.get("grade", ""),
            transmission=form.get("transmission"),
            thumbnail=thumb_url,
            content=form.get("content"),
            images=json.dumps(img_urls),
            simple_tags=form.get("simple_tags", "[]"),  # JSON 문자열로 넘어올 수 있음
        )

    else:
        # 기존 JSON 방식
        data = request.get_json(silent=True) or {}
        tag = _parse_tag(data.get("tag"))

        sale = Sale(
            name=data.get("name"),
            fuel=data.get("fuel"),
            type=data.get("type"),
            trim=data.get("trim"),
            year=data.get("year"),
            mileage=data.get("mileage"),
            color=data.get("color"),
            price=data.get("price"),
            manufacturer=tag.get("manufacturer", ""),
            model=tag.get("model", ""),
            sub_model=tag.get("subModel", ""),
            grade=tag.get("grade", ""),
            transmission=data.get("transmission"),
            thumbnail=data.get("thumbnail"),
            content=data.get("content"),
            images=data.get("images"),
            simple_tags=data.get("simple_tags", []),
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
def _ensure_upload_dir():
    upload_dir = os.path.join(current_app.root_path, "static", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    return upload_dir


def _save_file(f):
    """파일 저장 후 /static/uploads/... 경로 반환"""
    upload_dir = _ensure_upload_dir()
    ts = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    filename = f"{ts}_{secure_filename(f.filename)}"
    path = os.path.join(upload_dir, filename)
    f.save(path)
    return f"/static/uploads/{filename}"  # 정적 서빙 전제


def _parse_tag(raw):
    """tag는 JSON 문자열 또는 dict로 올 수 있음"""
    if not raw:
        return {}
    if isinstance(raw, dict):
        return raw
    try:
        return json.loads(raw)
    except Exception:
        return {}


# === 여기부터 바꿔 끼우기 ===
@sale_bp.route("/<int:sale_id>", methods=["PUT"])
def update_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if sale is None:
        return jsonify({"error": "해당 매물을 찾을 수 없습니다."}), 404

    content_type = (request.content_type or "").lower()

    # ---- A) multipart/form-data (FormData로 전송) ----
    if content_type.startswith("multipart/form-data"):
        form = request.form
        files = request.files

        # 텍스트 필드
        sale.name = form.get("name", sale.name)
        sale.fuel = form.get("fuel", sale.fuel)
        sale.type = form.get("type", sale.type)
        sale.trim = form.get("trim", sale.trim)
        sale.content = form.get("content", sale.content)

        # 숫자 캐스팅(값이 있을 때만)
        year = form.get("year")
        if year not in (None, ""):
            try:
                sale.year = int(year)
            except ValueError:
                pass

        mileage = form.get("mileage")
        if mileage not in (None, ""):
            sale.mileage = mileage

        color = form.get("color")
        if color not in (None, ""):
            sale.color = color

        price = form.get("price")
        if price not in (None, ""):
            try:
                sale.price = int(price)
            except ValueError:
                pass

        # 태그 (JSON 문자열 가능)
        tag = _parse_tag(form.get("tag"))
        if tag:
            sale.manufacturer = tag.get("manufacturer", sale.manufacturer)
            sale.model = tag.get("model", sale.model)
            sale.sub_model = tag.get("subModel", sale.sub_model)
            sale.grade = tag.get("grade", sale.grade)

        # 썸네일: 새 파일이 있으면 저장, 아니면 thumbnail_url로 유지/변경
        thumb_file = files.get("thumbnail")
        if thumb_file:
            sale.thumbnail = _save_file(thumb_file)
        else:
            thumb_url = form.get("thumbnail_url")
            if thumb_url:
                sale.thumbnail = thumb_url

        # 추가 이미지: 여러 개 허용
        incoming_images = files.getlist("images")
        if incoming_images:
            new_urls = [_save_file(f) for f in incoming_images]

            # Sale.images가 문자열(JSON) 컬럼일 가능성 고려
            current_images = []
            if isinstance(sale.images, list):
                current_images = sale.images
            else:
                try:
                    current_images = json.loads(sale.images or "[]")
                except Exception:
                    current_images = []

            merged = current_images + new_urls
            # 모델이 문자열 컬럼이면 직렬화
            sale.images = json.dumps(merged)

        db.session.commit()
        return jsonify({"message": "수정 성공", "car": sale.to_dict()}), 200

    # ---- B) application/json (기존 방식 유지) ----
    data = request.get_json(silent=True) or {}

    sale.name = data.get("name", sale.name)
    sale.fuel = data.get("fuel", sale.fuel)
    sale.type = data.get("type", sale.type)
    sale.trim = data.get("trim", sale.trim)
    sale.content = data.get("content", sale.content)

    if "year" in data:
        try:
            sale.year = int(data["year"])
        except (TypeError, ValueError):
            pass
    if "mileage" in data:
        sale.mileage = data["mileage"] or sale.mileage
    if "color" in data:
        sale.color = data["color"] or sale.color
    if "price" in data:
        try:
            sale.price = int(data["price"])
        except (TypeError, ValueError):
            pass

    tag = _parse_tag(data.get("tag"))
    if tag:
        sale.manufacturer = tag.get("manufacturer", sale.manufacturer)
        sale.model = tag.get("model", sale.model)
        sale.sub_model = tag.get("subModel", sale.sub_model)
        sale.grade = tag.get("grade", sale.grade)

    # JSON 경로에선 파일 업로드가 없으므로 URL/배열만 반영
    if "thumbnail" in data:
        sale.thumbnail = data["thumbnail"] or sale.thumbnail
    if "images" in data:
        # 문자열/리스트 모두 허용
        imgs = data["images"]
        if isinstance(imgs, list):
            sale.images = json.dumps(imgs)
        else:
            sale.images = imgs  # 이미 문자열(JSON)로 왔다면 그대로

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
