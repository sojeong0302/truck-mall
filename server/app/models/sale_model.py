# server/app/models/sale_model.py

from ..extensions import db
from datetime import datetime


class Sale(db.Model):
    __tablename__ = "sale"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    fuel = db.Column(db.String(50))
    type = db.Column(db.String(50))
    trim = db.Column(db.String(50))
    year = db.Column(db.String(20))
    mileage = db.Column(db.String(50))
    color = db.Column(db.String(50))
    price = db.Column(db.String(50))
    manufacturer = db.Column(db.String(50))
    model = db.Column(db.String(50))
    sub_model = db.Column(db.String(50))
    grade = db.Column(db.String(50))
    thumbnail = db.Column(db.Text)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
            "subModel": self.sub_model,
            "grade": self.grade,
            "thumbnail": self.thumbnail,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
        }
