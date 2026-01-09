'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      router.push('/');
    } catch (err: unknown) {
      const apiError = err as { detail?: string };
      setError(apiError.detail || '登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">登录</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          label="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loading className="h-5 w-5" /> : '登录'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        还没有账号？{' '}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          注册
        </Link>
      </p>
    </div>
  );
}
