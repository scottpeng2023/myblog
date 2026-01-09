import Link from 'next/link';

// 模拟统计数据
const stats = {
  totalPosts: 12,
  publishedPosts: 8,
  draftPosts: 4,
  totalComments: 24,
  totalViews: 1234,
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">仪表盘</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">总文章数</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalPosts}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">已发布</div>
          <div className="mt-2 text-3xl font-bold text-green-600">{stats.publishedPosts}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">草稿</div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">{stats.draftPosts}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">总评论数</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{stats.totalComments}</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">快速操作</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/posts-manage/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            新建文章
          </Link>
          <Link
            href="/admin/media"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            媒体管理
          </Link>
        </div>
      </div>
    </div>
  );
}
