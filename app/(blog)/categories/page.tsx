import Link from 'next/link';

// 模拟数据
async function getCategories() {
  // TODO: 替换为实际 API 调用
  return [
    { id: 1, name: '技术', slug: 'tech', description: '技术相关文章' },
    { id: 2, name: '生活', slug: 'life', description: '生活随笔' },
  ];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">分类</h1>
        <p className="text-gray-600">浏览所有文章分类</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {category.name}
            </h2>
            {category.description && (
              <p className="mt-2 text-gray-600">{category.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
