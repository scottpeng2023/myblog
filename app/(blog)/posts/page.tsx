import Link from 'next/link';
import { postsApi } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils/date';

async function getPosts(page: number = 1) {
  // TODO: 替换为实际 API 调用
  // const response = await postsApi.list({ page, size: 10 });
  // return response;

  return {
    items: [
      {
        id: 1,
        title: '欢迎使用 MyBlog',
        slug: 'welcome-to-myblog',
        content: '这是一个基于 Next.js 和 FastAPI 构建的现代化博客平台。',
        status: 'published' as const,
        author_id: 1,
        author: { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' as const, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    total: 1,
    page: 1,
    size: 10,
    pages: 1,
  };
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const data = await getPosts(page);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">文章列表</h1>
        <p className="text-gray-600">浏览所有发布的文章</p>
      </div>

      {data.items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">暂无文章</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.items.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <span>作者: {post.author?.username}</span>
                <span className="mx-2">•</span>
                <span>{formatRelativeTime(post.created_at)}</span>
              </div>
              <p className="mt-3 text-gray-700 line-clamp-2">{post.content}</p>
              <Link
                href={`/posts/${post.slug}`}
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                阅读更多 →
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          {page > 1 && (
            <Link
              href={`/posts?page=${page - 1}`}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              上一页
            </Link>
          )}
          <span className="px-4 py-2">
            第 {page} / {data.pages} 页
          </span>
          {page < data.pages && (
            <Link
              href={`/posts?page=${page + 1}`}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              下一页
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
