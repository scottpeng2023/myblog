from pydantic import BaseModel


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    pass


class TagUpdate(BaseModel):
    name: str


class TagResponse(TagBase):
    id: int
    slug: str

    class Config:
        from_attributes = True
