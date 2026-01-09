import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} MyBlog. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">
              关于
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
              隐私政策
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
