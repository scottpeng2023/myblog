import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

async function getPosts() {
  // TODO: 实现后端 API 后调用真实数据
  return [
    {
      id: 1,
      title: '欢迎使用 MyBlog',
      slug: 'welcome-to-myblog',
      excerpt: '这是一个基于 Next.js 和 FastAPI 构建的现代化博客平台。',
      content: '...',
      created_at: new Date().toISOString(),
      author: { username: 'admin' },
    },
  ];
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">最新文章</h1>
            <p className="text-gray-600">探索我们的最新内容</p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">暂无文章</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
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
                    <span>
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="mt-3 text-gray-700 line-clamp-2">{post.excerpt}</p>
                  )}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
