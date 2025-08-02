from flask import Flask
from .config import Config
from .extensions import db, jwt
from .routes.auth import auth_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # 확장 모듈 초기화
    db.init_app(app)
    jwt.init_app(app)

    # 블루프린트 등록
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
