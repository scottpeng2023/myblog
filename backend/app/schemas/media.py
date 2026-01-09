from pydantic import BaseModel
from datetime import datetime


class MediaResponse(BaseModel):
    id: int
    filename: str
    filepath: str
    mimetype: str
    size: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MediaListResponse(BaseModel):
    items: list[MediaResponse]
    total: int
    page: int
    size: int
    pages: int
