# MyBlog 项目设置指南

这是一个基于 Next.js 和 FastAPI 的全栈博客系统。

## 项目结构

```
myblog/
├── app/                      # Next.js 前端应用
│   ├── (auth)/              # 认证相关页面
│   │   ├── login/
│   │   └── register/
│   ├── (blog)/              # 博客前台页面
│   │   ├── posts/
│   │   ├── categories/
│   │   └── tags/
│   ├── (admin)/             # 管理后台
│   │   ├── dashboard/
│   │   ├── posts/
│   │   └── media/
│   ├── api/                 # API 代理（可选）
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页
├── components/              # React 组件
│   ├── layout/              # 布局组件
│   ├── common/              # 通用组件
│   ├── blog/                # 博客组件
│   └── admin/               # 管理后台组件
├── lib/                     # 工具库
│   ├── api/                 # API 客户端
│   ├── hooks/               # 自定义 Hooks
│   ├── providers/           # Context Providers
│   ├── stores/              # Zustand 状态管理
│   ├── types/               # TypeScript 类型
│   └── utils/               # 工具函数
├── backend/                 # FastAPI 后端应用
│   ├── alembic/             # 数据库迁移
│   ├── app/
│   │   ├── api/v1/          # API 路由
│   │   ├── core/            # 核心配置
│   │   ├── models/          # SQLAlchemy 模型
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # 业务逻辑
│   ├── main.py              # 应用入口
│   └── requirements.txt     # Python 依赖
└── public/                  # 静态文件
```

## 环境要求

- Node.js >= 18
- Python >= 3.10
- MySQL >= 8.0

## 后端设置

1. 安装 Python 依赖：
```bash
cd backend
pip install -r requirements.txt
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

3. 创建数据库：
```sql
CREATE DATABASE myblog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. 运行数据库迁移：
```bash
alembic upgrade head
```

5. 启动后端服务：
```bash
python main.py
# 或使用 uvicorn
uvicorn main:app --reload
```

后端 API 将在 http://localhost:8000 运行

API 文档：http://localhost:8000/api/v1/docs

## 前端设置

1. 安装 Node.js 依赖：
```bash
pnpm install
```

2. 配置环境变量：
```bash
cp .env.local.example .env.local
# 编辑 .env.local 文件，配置 API 地址
```

3. 启动开发服务器：
```bash
pnpm dev
```

前端应用将在 http://localhost:3000 运行

## 数据库索引优化

运行以下 SQL 创建索引以提高性能：

```sql
-- 文章表索引
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_status ON posts(author_id, status);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- 评论表索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- 标签和分类索引
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
```

## 默认用户

首次运行后，需要手动创建管理员用户：

```python
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
admin = User(
    username="admin",
    email="admin@example.com",
    password_hash=get_password_hash("admin123"),
    role="author"
)
db.add(admin)
db.commit()
```

## 功能清单

### 已实现
- ✅ 用户认证（JWT）
- ✅ 文章 CRUD
- ✅ 分类和标签管理
- ✅ 评论系统（支持嵌套回复）
- ✅ 媒体文件上传
- ✅ 管理后台

### 待实现
- ⏳ OAuth 登录（Google/GitHub）
- ⏳ 手机验证码登录
- ⏳ 邮箱验证
- ⏳ SSG/ISR 优化
- ⏳ 图片优化（缩略图生成）
- ⏳ CSRF 保护
- ⏳ API 限流

## 开发命令

### 前端
```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建生产版本
pnpm start    # 启动生产服务器
pnpm lint     # 运行 ESLint
```

### 后端
```bash
python main.py           # 启动开发服务器
alembic revision --autogenerate -m "message"  # 创建迁移
alembic upgrade head     # 应用迁移
alembic downgrade -1     # 回滚迁移
```

## 技术栈

### 前端
- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript
- Tailwind CSS 4
- Zustand (状态管理)
- React Query (数据获取)
- react-markdown (Markdown 渲染)

### 后端
- FastAPI
- SQLAlchemy (ORM)
- Alembic (数据库迁移)
- PyJWT (认证)
- MySQL
- Pillow (图片处理)

## 许可证

MIT
