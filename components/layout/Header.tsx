'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '../common/Button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              MyBlog
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/posts"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                文章
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                分类
              </Link>
              <Link
                href="/tags"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                标签
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'author' || user?.role === 'admin' ? (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      管理后台
                    </Button>
                  </Link>
                ) : null}
                <Link href="/posts/create">
                  <Button size="sm">写文章</Button>
                </Link>
                <span className="text-gray-700">{user?.username}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  退出
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">注册</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
