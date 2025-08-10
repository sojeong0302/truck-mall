from flask import Flask
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
import os
from flask_jwt_extended import JWTManager

load_dotenv()
jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_envvar("FLASK_CONFIG")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    # 확장 모듈 초기화
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)  # ✅ 이제 app이 정의된 후 migrate 초기화!

    # 블루프린트 등록
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(review_bp, url_prefix="/review")
    app.register_blueprint(carTIP_bp, url_prefix="/carTIP")
    app.register_blueprint(sale_bp, url_prefix="/sale")
    app.register_blueprint(sms_bp)
    app.register_blueprint(ping_bp)
    return app
