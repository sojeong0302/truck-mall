from enum import Enum
from sqlalchemy import Boolean, Column, Integer, String, Text
from ..extensions import db
from sqlalchemy.dialects.sqlite import JSON


class Sale(db.Model):
    __tablename__ = "sale"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    fuel = db.Column(db.String(50))
    type = db.Column(db.String(50))
    trim = db.Column(db.String(50))
    year = db.Column(db.Integer)
    mileage = db.Column(db.String(50))
    color = db.Column(db.String(30))
    price = db.Column(db.Integer)
    manufacturer = db.Column(db.String(50))
    model = db.Column(db.String(50))
    sub_model = db.Column(db.String(50))
    grade = db.Column(db.String(50))
    transmission = db.Column(db.String(20))
    thumbnail = db.Column(db.Text)
    content = db.Column(db.Text)
    images = db.Column(JSON)
    status = db.Column(Boolean, default=True, nullable=False)
    simple_tags = Column(JSON)
    tags = db.Column(JSON)

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
            "images": self.images if isinstance(self.images, list) else [],
            "simple_tags": (
                self.simple_tags if isinstance(self.simple_tags, (dict, list)) else None
            ),
            "tags": self.tags if isinstance(self.tags, dict) else {},
        }
