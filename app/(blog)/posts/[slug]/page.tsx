import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { formatRelativeTime } from '@/lib/utils/date';
import { Comments } from '@/components/blog/Comments';

// 模拟数据获取
async function getPost(slug: string) {
  // TODO: 替换为实际 API 调用
  // const post = await postsApi.getBySlug(slug);
  // return post;

  return {
    id: 1,
    title: '欢迎使用 MyBlog',
    slug: 'welcome-to-myblog',
    content: `# 欢迎使用 MyBlog

这是一个基于 **Next.js** 和 **FastAPI** 构建的现代化博客平台。

## 特性

- 🚀 基于 Next.js 16 App Router
- 🐍 FastAPI 后端
- 📝 Markdown 编辑器支持
- 💬 评论系统
- 🏷️ 分类和标签

\`\`\`typescript
console.log('Hello, MyBlog!');
\`\`\`

开始你的写作之旅吧！`,
    status: 'published' as const,
    author_id: 1,
    author: { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' as const, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <span>作者: {post.author?.username}</span>
          <span className="mx-2">•</span>
          <span>{formatRelativeTime(post.created_at)}</span>
        </div>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← 返回文章列表
          </Link>
        </div>
      </article>

      <Comments postId={post.id} />
    </div>
  );
}
