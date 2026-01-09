from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from ..core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Relationships
    posts = relationship("Post", secondary="post_categories", back_populates="categories")

    def __repr__(self):
        return f"<Category(id={self.id}, name={self.name})>"
