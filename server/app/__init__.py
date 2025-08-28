# app/__init__.py
from flask import Flask, request
from .config import Config
from .extensions import db, jwt
from .routes.auth import auth_bp
from flask_cors import CORS
from .routes.review import review_bp
from .routes.carTIP import carTIP_bp
from flask_migrate import Migrate
from .routes.sale import sale_bp
from app.routes.sms import sms_bp
from dotenv import load_dotenv
from .routes.ping import ping_bp
from flask_jwt_extended import JWTManager
import os
import logging
import sys
from .routes.performance import bp as performance_bp

load_dotenv()

jwt = JWTManager()
migrate = Migrate()

# 프론트 허용 도메인(필요시 여기에 추가)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://truck-mall-truck-mall.vercel.app",
]


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.DEBUG)
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

    # 환경설정
    # (환경변수 파일을 FLASK_CONFIG로 지정해 두었다면 사용)
    app.config.from_envvar("FLASK_CONFIG", silent=True)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    # 확장 모듈 초기화
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # 블루프린트 등록
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(review_bp, url_prefix="/review")
    app.register_blueprint(carTIP_bp, url_prefix="/carTIP")
    app.register_blueprint(sale_bp, url_prefix="/sale")
    app.register_blueprint(sms_bp)
    app.register_blueprint(ping_bp)
    app.register_blueprint(performance_bp, url_prefix="/performance")

    # 이미지/정적 업로드 응답에 CORS/캐시 헤더 보강
    @app.after_request
    def add_cors_headers(resp):
        path = request.path or ""
        if path.startswith(("/carTIP/uploads", "/sale/uploads", "/review/uploads")):
            resp.headers["Vary"] = "Origin"
            if "Cache-Control" not in resp.headers:
                resp.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return resp

    return app
