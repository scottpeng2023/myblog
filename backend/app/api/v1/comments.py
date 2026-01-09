from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentResponse

router = APIRouter()


@router.get("/post/{post_id}", response_model=list[CommentResponse])
def list_post_comments(post_id: int, db: Session = Depends(get_db)):
    comments = (
        db.query(Comment)
        .filter(Comment.post_id == post_id, Comment.parent_id.is_(None))
        .order_by(Comment.created_at.desc())
        .all()
    )

    # Recursively load replies
    def load_replies(comment: Comment) -> dict:
        data = CommentResponse.model_validate(comment).model_dump()
        replies = (
            db.query(Comment)
            .filter(Comment.parent_id == comment.id)
            .order_by(Comment.created_at.asc())
            .all()
        )
        data["replies"] = [load_replies(reply) for reply in replies]
        return data

    return [load_replies(comment) for comment in comments]


@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify post exists
    from app.models.post import Post
    post = db.query(Post).filter(Post.id == comment_data.post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # If parent_id is specified, verify it exists and belongs to the same post
    if comment_data.parent_id:
        parent = db.query(Comment).filter(Comment.id == comment_data.parent_id).first()
        if not parent or parent.post_id != comment_data.post_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid parent comment",
            )

    comment = Comment(
        post_id=comment_data.post_id,
        user_id=current_user.id,
        content=comment_data.content,
        parent_id=comment_data.parent_id,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return CommentResponse.model_validate(comment)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )

    # Check ownership or admin
    if comment.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment",
        )

    db.delete(comment)
    db.commit()

    return None
