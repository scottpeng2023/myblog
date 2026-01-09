from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.core.deps import get_current_user, require_role
from app.models.user import User
from app.models.post import Post, PostStatus
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostListResponse
import slugify

router = APIRouter()


def generate_slug(title: str) -> str:
    """Generate a URL slug from a title."""
    return slugify.slugify(title)


@router.get("", response_model=PostListResponse)
def list_posts(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[PostStatus] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Post)

    # Filter by status if specified (only show published posts to non-authenticated users)
    if status:
        query = query.filter(Post.status == status)
    else:
        query = query.filter(Post.status == PostStatus.PUBLISHED)

    # Get total count
    total = query.count()

    # Paginate
    offset = (page - 1) * size
    posts = query.order_by(Post.created_at.desc()).offset(offset).limit(size).all()

    pages = (total + size - 1) // size

    return PostListResponse(
        items=[PostResponse.model_validate(post) for post in posts],
        total=total,
        page=page,
        size=size,
        pages=pages,
    )


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # Increment view count
    post.view_count += 1
    db.commit()

    return PostResponse.model_validate(post)


@router.get("/slug/{slug}", response_model=PostResponse)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # Increment view count
    post.view_count += 1
    db.commit()

    return PostResponse.model_validate(post)


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("author", "admin")),
):
    # Generate slug from title
    slug = generate_slug(post_data.title)

    # Check if slug already exists
    if db.query(Post).filter(Post.slug == slug).first():
        # Add timestamp to make unique
        import time
        slug = f"{slug}-{int(time.time())}"

    # Create post
    post = Post(
        title=post_data.title,
        slug=slug,
        content=post_data.content,
        excerpt=post_data.excerpt,
        status=post_data.status,
        author_id=current_user.id,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    # Add categories and tags
    if post_data.category_ids:
        from app.models import post_categories
        for cat_id in post_data.category_ids:
            db.execute(
                post_categories.insert().values(post_id=post.id, category_id=cat_id)
            )

    if post_data.tag_ids:
        from app.models import post_tags
        for tag_id in post_data.tag_ids:
            db.execute(
                post_tags.insert().values(post_id=post.id, tag_id=tag_id)
            )

    db.commit()
    db.refresh(post)

    return PostResponse.model_validate(post)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("author", "admin")),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # Check ownership
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post",
        )

    # Update fields
    if post_data.title:
        post.title = post_data.title
        post.slug = generate_slug(post_data.title)

    if post_data.content is not None:
        post.content = post_data.content

    if post_data.excerpt is not None:
        post.excerpt = post_data.excerpt

    if post_data.status:
        post.status = post_data.status

    # Update categories and tags
    if post_data.category_ids is not None:
        from app.models import post_categories
        # Delete existing associations
        db.execute(post_categories.delete().where(post_categories.c.post_id == post_id))
        # Add new ones
        for cat_id in post_data.category_ids:
            db.execute(
                post_categories.insert().values(post_id=post_id, category_id=cat_id)
            )

    if post_data.tag_ids is not None:
        from app.models import post_tags
        # Delete existing associations
        db.execute(post_tags.delete().where(post_tags.c.post_id == post_id))
        # Add new ones
        for tag_id in post_data.tag_ids:
            db.execute(
                post_tags.insert().values(post_id=post_id, tag_id=tag_id)
            )

    db.commit()
    db.refresh(post)

    return PostResponse.model_validate(post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("author", "admin")),
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # Check ownership
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post",
        )

    db.delete(post)
    db.commit()

    return None
