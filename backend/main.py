from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1 import auth, posts, comments, categories, tags, media

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["auth"])
app.include_router(posts.router, prefix=f"{settings.API_V1_PREFIX}/posts", tags=["posts"])
app.include_router(comments.router, prefix=f"{settings.API_V1_PREFIX}/comments", tags=["comments"])
app.include_router(categories.router, prefix=f"{settings.API_V1_PREFIX}/categories", tags=["categories"])
app.include_router(tags.router, prefix=f"{settings.API_V1_PREFIX}/tags", tags=["tags"])
app.include_router(media.router, prefix=f"{settings.API_V1_PREFIX}/media", tags=["media"])


@app.get("/")
def root():
    return {
        "message": "Welcome to MyBlog API",
        "version": settings.APP_VERSION,
        "docs": f"{settings.API_V1_PREFIX}/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
