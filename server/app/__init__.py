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

load_dotenv()


migrate = Migrate()  # 먼저 migrate 객체만 생성해두고


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS 설정

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
    return app
