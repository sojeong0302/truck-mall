from enum import Enum
from sqlalchemy import Boolean, Column
from ..extensions import db
from sqlalchemy.dialects.sqlite import JSON
from .performance_model import PerformanceInspection


class Sale(db.Model):
    __tablename__ = "sale"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # 이름
    car_number = db.Column(db.String(50))  # 차량번호
    price = db.Column(db.Integer)  # 가격
    year = db.Column(db.Integer)  # 연식
    month = db.Column(db.Integer)  # 월
    fuel = db.Column(db.String(50))  # 연료
    transmission = db.Column(db.String(20))  # 변속기
    color = db.Column(db.String(30))  # 색상
    mileage = db.Column(db.Integer)  # 주행 거리
    vin = db.Column(db.String(50))  # 차대번호

    # 추가
    suggest_number = db.Column(db.String(50))  # 제시 번호
    performance_number = db.Column(db.String(50), unique=True, index=True)  # 성능 번호

    # Filter
    manufacturer = db.Column(db.String(50))
    model = db.Column(db.String(50))
    sub_model = db.Column(db.String(50))
    grade = db.Column(db.String(50))

    # Filter 계층형 구조
    normal_tags = db.Column(JSON)

    thumbnail = db.Column(db.String(255))  # 썸네일
    content = db.Column(db.Text)  # 내용
    simple_content = db.Column(db.String(100))  # 간단 내용
    images = db.Column(JSON)  # 기타 사진
    status = db.Column(Boolean, default=True, nullable=False)  # 판매 상태
    simple_tags = db.Column(JSON)  # SimpleFilter

    performance = db.relationship(
        "PerformanceInspection",
        primaryjoin="Sale.performance_number==foreign(PerformanceInspection.performance_number)",
        uselist=False,
        viewonly=True,
    )

    # json 형태로 변환
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "car_number": self.car_number,
            "price": self.price,
            "year": self.year,
            "month": self.month,
            "fuel": self.fuel,
            "transmission": self.transmission,
            "color": self.color,
            "mileage": self.mileage,
            "vin": self.vin,
            "performance_number": self.performance_number,
            "suggest_number": self.suggest_number,
            "manufacturer": self.manufacturer,
            "model": self.model,
            "sub_model": self.sub_model,
            "grade": self.grade,
            "normal_tags": self.normal_tags,
            "thumbnail": self.thumbnail,
            "content": self.content,
            "simple_content": self.simple_content,
            "images": self.images,
            "status": self.status,
            "simple_tags": self.simple_tags,
        }
