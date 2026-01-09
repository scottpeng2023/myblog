import Link from 'next/link';

// 模拟数据
async function getTags() {
  // TODO: 替换为实际 API 调用
  return [
    { id: 1, name: 'JavaScript', slug: 'javascript' },
    { id: 2, name: 'Python', slug: 'python' },
    { id: 3, name: 'Next.js', slug: 'nextjs' },
    { id: 4, name: 'FastAPI', slug: 'fastapi' },
  ];
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">标签</h1>
        <p className="text-gray-600">浏览所有文章标签</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 hover:text-blue-600 transition-all"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
