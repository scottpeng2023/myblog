'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

interface MediaItem {
  id: number;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  created_at: string;
}

export default function AdminMediaPage() {
  const { isAuthenticated } = useAuth();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadMedia();
    }
  }, [isAuthenticated]);

  const loadMedia = async () => {
    // TODO: 替换为实际 API 调用
    setMedia([]);
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // TODO: 替换为实际 API 调用
      // const uploaded = await mediaApi.upload(selectedFile);
      // setMedia([uploaded, ...media]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个文件吗？')) return;

    // TODO: 替换为实际 API 调用
    setMedia(media.filter(m => m.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">媒体管理</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">上传文件</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? '上传中...' : '上传'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3"
          >
            <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
              {item.mimetype.startsWith('image/') ? (
                <img
                  src={item.filepath}
                  alt={item.filename}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
            </div>
            <p className="text-xs text-gray-900 truncate" title={item.filename}>
              {item.filename}
            </p>
            <p className="text-xs text-gray-600">{formatFileSize(item.size)}</p>
            <button
              onClick={() => handleDelete(item.id)}
              className="mt-2 text-xs text-red-600 hover:text-red-700"
            >
              删除
            </button>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无媒体文件
        </div>
      )}
    </div>
  );
}
