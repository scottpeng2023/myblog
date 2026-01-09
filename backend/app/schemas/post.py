from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.post import PostStatus


class PostBase(BaseModel):
    title: str
    content: str
    status: PostStatus = PostStatus.DRAFT
    excerpt: Optional[str] = None
    category_ids: Optional[List[int]] = []
    tag_ids: Optional[List[int]] = []


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[PostStatus] = None
    excerpt: Optional[str] = None
    category_ids: Optional[List[int]] = []
    tag_ids: Optional[List[int]] = []


class PostResponse(PostBase):
    id: int
    slug: str
    author_id: int
    cover_image: Optional[str] = None
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    items: List[PostResponse]
    total: int
    page: int
    size: int
    pages: int
