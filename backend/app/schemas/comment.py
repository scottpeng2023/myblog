from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    post_id: int
    parent_id: Optional[int] = None


class CommentResponse(CommentBase):
    id: int
    post_id: int
    user_id: Optional[int] = None
    parent_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
