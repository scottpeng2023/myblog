from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from pathlib import Path
from typing import Optional
import uuid
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.media import Media
from app.schemas.media import MediaResponse, MediaListResponse
from app.core.config import settings

router = APIRouter()

# Allowed MIME types
ALLOWED_MIME_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
}


@router.post("/upload", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate file size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE} bytes",
        )

    # Validate file type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type. Allowed types: {', '.join(ALLOWED_MIME_TYPES.keys())}",
        )

    # Generate unique filename
    file_extension = ALLOWED_MIME_TYPES[file.content_type]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    # Create upload directory if it doesn't exist
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)

    # Save file
    file_path = upload_path / unique_filename
    with open(file_path, "wb") as f:
        f.write(content)

    # Create media record
    media = Media(
        filename=file.filename,
        filepath=str(file_path),
        mimetype=file.content_type,
        size=len(content),
        user_id=current_user.id,
    )

    db.add(media)
    db.commit()
    db.refresh(media)

    return MediaResponse.model_validate(media)


@router.get("/list", response_model=MediaListResponse)
def list_media(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Media)

    # Get total count
    total = query.count()

    # Paginate
    offset = (page - 1) * size
    media_items = query.order_by(Media.created_at.desc()).offset(offset).limit(size).all()

    pages = (total + size - 1) // size

    return MediaListResponse(
        items=[MediaResponse.model_validate(media) for media in media_items],
        total=total,
        page=page,
        size=size,
        pages=pages,
    )


@router.get("/{media_id}", response_model=MediaResponse)
def get_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    media = db.query(Media).filter(Media.id == media_id).first()

    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )

    return MediaResponse.model_validate(media)


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    media = db.query(Media).filter(Media.id == media_id).first()

    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found",
        )

    # Check ownership
    if media.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this media",
        )

    # Delete file from filesystem
    from pathlib import Path
    file_path = Path(media.filepath)
    if file_path.exists():
        file_path.unlink()

    # Delete database record
    db.delete(media)
    db.commit()

    return None
