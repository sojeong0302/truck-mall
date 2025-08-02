from app.extensions import db
from sqlalchemy.dialects.sqlite import JSON


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    images = db.Column(JSON)  # 리스트 형태로 저장
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(100), nullable=False)
    view = db.Column(db.Integer, default=0)
