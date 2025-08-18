from enum import Enum
from sqlalchemy import Boolean, Column
from ..extensions import db
from sqlalchemy.dialects.sqlite import JSON


class Sale(db.Model):
    __tablename__ = "sale"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # 이름 0
    fuel = db.Column(db.String(50))  # 연료 0
    type = db.Column(db.String(50))  # 타입
    trim = db.Column(db.String(50))  # 트림
    year = db.Column(db.Integer)  # 연식
    mileage = db.Column(db.String(50))  # 주행 거리 0
    color = db.Column(db.String(30))  # 색상 0
    price = db.Column(db.Integer)  # 가격
    car_number = db.Column(db.String(50))  # 차량번호
    vin = db.Column(db.String(50))  # 차대번호
    accident_info = db.Column(db.String(50))  # 사고정보
    combination_info = db.Column(db.String(50))  # 조합정보

    # Filter
    manufacturer = db.Column(db.String(50))
    model = db.Column(db.String(50))
    sub_model = db.Column(db.String(50))
    grade = db.Column(db.String(50))

    transmission = db.Column(db.String(20))  # 변속기 0
    thumbnail = db.Column(db.Text)  # 썸네일
    content = db.Column(db.Text)  # 내용
    images = db.Column(JSON)  # 기타 사진
    status = db.Column(Boolean, default=True, nullable=False)  # 판매 상태
    simple_tags = db.Column(JSON)  # SimpleFilter

    # Filter 계층형 구조
    normal_tags = db.Column(JSON)

    # json 형태로 변환
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "fuel": self.fuel,
            "type": self.type,
            "trim": self.trim,
            "year": self.year,
            "mileage": self.mileage,
            "color": self.color,
            "price": self.price,
            "manufacturer": self.manufacturer,
            "model": self.model,
            "sub_model": self.sub_model,
            "grade": self.grade,
            "transmission": self.transmission,
            "thumbnail": self.thumbnail,
            "content": self.content,
            "status": self.status,
            "images": self.images,
            "simple_tags": self.simple_tags,
            "normal_tags": self.normal_tags,
            "car_number": self.car_number,
            "vin": self.vin,
            "accident_info": self.accident_info,
            "combination_info": self.combination_info,
        }
