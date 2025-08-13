from app.extensions import db
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.sql import func


class CarTIP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    images = db.Column(JSON)
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    view = db.Column(db.Integer, default=0)
