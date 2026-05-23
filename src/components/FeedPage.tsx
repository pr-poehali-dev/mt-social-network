import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import BadgeIcon from './BadgeIcon';
import { formatTime, formatNumber } from '@/data/mockData';
import { ALL_BADGES, Badge } from '@/data/badges';
import { api } from '@/lib/api';

interface ApiUser {
  id: number;
  mt_id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
  active_badge_id?: string;
  badges?: Array<{ id: string }>;
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
  mt_coins?: number;
  streak?: number;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  is_online?: boolean;
  join_date?: string;
  daily_claimed_at?: string;
}

interface ApiPost {
  id: number;
  author_id: number;
  author?: ApiUser;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  liked?: boolean;
}

interface ApiComment {
  id: number;
  author_id: number;
  author?: ApiUser;
  content: string;
  created_at: string;
}

interface FeedPageProps {
  currentUser: ApiUser;
  onOpenProfile?: (userId: number) => void;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const PostSkeleton: React.FC = () => (
  <div className="mt-card mb-3 p-4">
    <div className="flex items-start gap-3">
      <div className="shimmer-skeleton w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="shimmer-skeleton h-3 w-32 rounded-full" />
        <div className="shimmer-skeleton h-3 w-full rounded-full" />
        <div className="shimmer-skeleton h-3 w-4/5 rounded-full" />
        <div className="shimmer-skeleton h-3 w-2/3 rounded-full" />
      </div>
    </div>
    <div className="flex gap-4 mt-4 pt-3 border-t" style={{ borderColor: 'var(--mt-border)' }}>
      <div className="shimmer-skeleton h-6 w-12 rounded-lg" />
      <div className="shimmer-skeleton h-6 w-12 rounded-lg" />
      <div className="shimmer-skeleton h-6 w-12 rounded-lg" />
    </div>
  </div>
);

// ── PostCard ──────────────────────────────────────────────────────────────────
interface PostCardProps {
  post: ApiPost;
  currentUser: ApiUser;
  onLike: (postId: number) => void;
  onOpenProfile?: (userId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onLike, onOpenProfile }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.comments_count);

  const activeBadge: Badge | undefined = post.author?.active_badge_id
    ? ALL_BADGES.find(b => b.id === post.author!.active_badge_id)
    : undefined;

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setCommentsLoading(true);
      try {
        const res = await api.posts.comments(post.id);
        setComments(Array.isArray(res.comments) ? res.comments : []);
      } catch {
        // ignore
      } finally {
        setCommentsLoading(false);
      }
    }
    setShowComments(v => !v);
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || sendingComment) return;
    setSendingComment(true);
    try {
      const res = await api.posts.comment(post.id, commentText.trim());
      const newComment: ApiComment = res.comment ?? {
        id: Date.now(),
        author_id: currentUser.id,
        author: currentUser,
        content: commentText.trim(),
        created_at: new Date().toISOString(),
      };
      setComments(prev => [...prev, newComment]);
      setLocalCommentsCount(c => c + 1);
      setCommentText('');
    } catch {
      // ignore
    } finally {
      setSendingComment(false);
    }
  };

  const authorName = post.author
    ? `${post.author.first_name} ${post.author.last_name}`
    : 'Пользователь';
  const authorUsername = post.author?.username ?? post.author?.mt_id ?? '';
  const authorAvatar = post.author?.avatar ?? `https://api.dicebear.com/7.x/notionists/svg?seed=${post.author_id}`;

  return (
    <div className="mt-card mb-3 overflow-hidden animate-fade-in-up">
      <div className="p-4">
        {/* Author row */}
        <div className="flex items-start gap-3">
          <button onClick={() => onOpenProfile?.(post.author_id)} className="flex-shrink-0">
            <img
              src={authorAvatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity"
            />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenProfile?.(post.author_id)}
                className="font-semibold text-sm hover:underline"
                style={{ color: 'var(--mt-text)' }}
              >
                {authorName}
              </button>
              {activeBadge && <BadgeIcon badge={activeBadge} size="sm" showTooltip />}
              <span className="text-xs" style={{ color: 'var(--mt-text-2)' }}>
                {post.author?.mt_id ? `mt${post.author.id}` : `@${authorUsername}`}
              </span>
              <span className="text-xs" style={{ color: 'var(--mt-text-2)' }}>
                · {formatTime(new Date(post.created_at))}
              </span>
            </div>
            <p className="text-sm mt-2 leading-relaxed whitespace-pre-line" style={{ color: 'var(--mt-text)' }}>
              {post.content}
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div
          className="flex items-center gap-1 mt-3 pt-3 border-t"
          style={{ borderColor: 'var(--mt-border)' }}
        >
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{
              color: post.liked ? '#ef4444' : 'var(--mt-text-2)',
              background: post.liked ? '#ef444415' : 'transparent',
            }}
          >
            <Icon
              name="Heart"
              size={15}
              className={post.liked ? 'fill-red-500' : ''}
              style={{ color: post.liked ? '#ef4444' : undefined }}
            />
            {formatNumber(post.likes_count)}
          </button>

          <button
            onClick={handleToggleComments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ color: showComments ? 'var(--mt-blue)' : 'var(--mt-text-2)' }}
          >
            <Icon name="MessageCircle" size={15} />
            {formatNumber(localCommentsCount)}
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ color: 'var(--mt-text-2)' }}
          >
            <Icon name="Repeat2" size={15} />
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ml-auto"
            style={{ color: 'var(--mt-text-2)' }}
          >
            <Icon name="Bookmark" size={15} />
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ color: 'var(--mt-text-2)' }}
          >
            <Icon name="Share2" size={15} />
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-3 space-y-2 animate-fade-in-up">
            {commentsLoading ? (
              <div className="space-y-2">
                <div className="shimmer-skeleton h-3 w-2/3 rounded-full" />
                <div className="shimmer-skeleton h-3 w-1/2 rounded-full" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-xs py-2 text-center" style={{ color: 'var(--mt-text-2)' }}>
                Пока нет комментариев. Будьте первым!
              </p>
            ) : (
              <div className="space-y-2">
                {comments.map(c => {
                  const cAvatar = c.author?.avatar ?? `https://api.dicebear.com/7.x/notionists/svg?seed=${c.author_id}`;
                  const cName = c.author
                    ? `${c.author.first_name} ${c.author.last_name}`
                    : 'Пользователь';
                  return (
                    <div key={c.id} className="flex items-start gap-2">
                      <img src={cAvatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      <div
                        className="flex-1 px-3 py-2 rounded-xl"
                        style={{ background: 'var(--mt-surface-2)' }}
                      >
                        <span className="text-xs font-semibold mr-1" style={{ color: 'var(--mt-text)' }}>
                          {cName}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--mt-text)' }}>
                          {c.content}
                        </span>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--mt-text-2)' }}>
                          {formatTime(new Date(c.created_at))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* New comment input */}
            <div className="flex gap-2 mt-2">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendComment();
                    }
                  }}
                  placeholder="Написать комментарий..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl"
                  style={{
                    background: 'var(--mt-surface-2)',
                    border: '1.5px solid var(--mt-border)',
                    color: 'var(--mt-text)',
                  }}
                />
                <button
                  onClick={handleSendComment}
                  disabled={!commentText.trim() || sendingComment}
                  className="px-3 py-2 rounded-xl text-white text-xs font-medium disabled:opacity-40 transition-opacity hover:opacity-90"
                  style={{ background: 'var(--mt-blue)' }}
                >
                  <Icon name="Send" size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── FeedPage ──────────────────────────────────────────────────────────────────
const FeedPage: React.FC<FeedPageProps> = ({ currentUser, onOpenProfile }) => {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [publishing, setPublishing] = useState(false);

  const loadPosts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.posts.list({ limit: 30 });
      const list: ApiPost[] = Array.isArray(res.posts) ? res.posts : [];
      setPosts(list);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePost = async () => {
    if (!newPost.trim() || publishing) return;
    setPublishing(true);
    try {
      const res = await api.posts.create(newPost.trim());
      const created: ApiPost = res.post ?? {
        id: Date.now(),
        author_id: currentUser.id,
        author: currentUser,
        content: newPost.trim(),
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        liked: false,
      };
      setPosts(prev => [created, ...prev]);
      setNewPost('');
    } catch {
      // ignore
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (postId: number) => {
    // Optimistic update
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1 }
          : p,
      ),
    );
    try {
      await api.posts.like(postId);
    } catch {
      // Revert on error
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, liked: !p.liked, likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1 }
            : p,
        ),
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-3 py-4">
      {/* New post composer */}
      <div className="mt-card mb-4 p-4">
        <div className="flex gap-3">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Что у вас нового?"
              className="w-full resize-none text-sm p-3 rounded-xl min-h-[80px]"
              style={{
                background: 'var(--mt-surface-2)',
                border: '1.5px solid var(--mt-border)',
                color: 'var(--mt-text)',
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                <button
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--mt-text-2)' }}
                >
                  <Icon name="Image" size={16} />
                </button>
                <button
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--mt-text-2)' }}
                >
                  <Icon name="MapPin" size={16} />
                </button>
                <button
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--mt-text-2)' }}
                >
                  <Icon name="Smile" size={16} />
                </button>
              </div>
              <button
                onClick={handlePost}
                disabled={!newPost.trim() || publishing}
                className="px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: 'var(--mt-blue)' }}
              >
                {publishing ? 'Публикация...' : 'Опубликовать'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh button */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--mt-text-2)' }}>
          Лента
        </span>
        <button
          onClick={() => loadPosts(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-40"
          style={{ color: 'var(--mt-text-2)', background: 'var(--mt-surface-2)' }}
        >
          <Icon name="RefreshCw" size={13} className={refreshing ? 'animate-spin' : ''} />
          Обновить
        </button>
      </div>

      {/* Posts */}
      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : posts.length === 0 ? (
        <div
          className="mt-card p-12 text-center animate-fade-in-up"
          style={{ color: 'var(--mt-text-2)' }}
        >
          <Icon name="FileText" size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Постов пока нет. Станьте первым!</p>
        </div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={handleLike}
            onOpenProfile={onOpenProfile}
          />
        ))
      )}
    </div>
  );
};

export default FeedPage;
