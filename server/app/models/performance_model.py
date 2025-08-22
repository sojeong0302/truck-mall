from sqlalchemy.dialects.sqlite import JSON
from ..extensions import db


class PerformanceInspection(db.Model):
    __tablename__ = "performance_inspection"

    id = db.Column(db.Integer, primary_key=True)

    # Sale.performance_number 를 FK로 참조 (1:1 보장 위해 unique)
    performance_number = db.Column(
        db.String(50),
        db.ForeignKey("sale.performance_number", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # ["url1", "url2"] 형태 (1~2장)
    images = db.Column(JSON, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "performance_number": self.performance_number,
            "images": self.images,
        }
