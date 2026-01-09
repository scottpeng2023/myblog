'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';

interface Comment {
  id: number;
  content: string;
  user?: { username: string };
  created_at: string;
  replies?: Comment[];
}

interface CommentsProps {
  postId: number;
}

export function Comments({ postId }: CommentsProps) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    // TODO: 替换为实际 API 调用
    // const data = await commentsApi.list(postId);
    // setComments(data);

    setComments([]);
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      // TODO: 替换为实际 API 调用
      // await commentsApi.create({ post_id: postId, content: newComment });
      // await loadComments();
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      // TODO: 替换为实际 API 调用
      // await commentsApi.create({ post_id: postId, content: replyContent, parent_id: parentId });
      // await loadComments();
      setReplyContent('');
      setReplyTo(null);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    // 简化的相对时间显示
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    return `${Math.floor(seconds / 86400)}天前`;
  };

  const renderComment = (comment: Comment, depth = 0) => (
    <div
      key={comment.id}
      className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'} bg-gray-50 rounded-lg p-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">
          {comment.user?.username || '匿名用户'}
        </span>
        <span className="text-sm text-gray-600">
          {formatRelativeTime(comment.created_at)}
        </span>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>

      {isAuthenticated && replyTo !== comment.id && (
        <button
          onClick={() => setReplyTo(comment.id)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          回复
        </button>
      )}

      {replyTo === comment.id && (
        <div className="mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="写下你的回复..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="mt-2 flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleSubmitReply(comment.id)}
              disabled={submitting || !replyContent.trim()}
            >
              {submitting ? '发送中...' : '发送'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyTo(null);
                setReplyContent('');
              }}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        评论 ({comments.length})
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : (
        <>
          {isAuthenticated ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? '发送中...' : '发表评论'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
              <p className="text-gray-600 mb-4">
                请先 <a href="/login" className="text-blue-600 hover:text-blue-700">登录</a> 后发表评论
              </p>
            </div>
          )}

          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              暂无评论，快来抢沙发吧！
            </div>
          ) : (
            <div>
              {comments.map((comment) => renderComment(comment))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
