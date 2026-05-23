import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import BadgeIcon from './BadgeIcon';
import { formatNumber, formatTime } from '@/data/mockData';
import { Badge, ALL_BADGES, RARITY_CONFIG } from '@/data/badges';
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

interface ProfilePageProps {
  userId?: number;
  currentUser: ApiUser;
  isOwn?: boolean;
  onEdit?: () => void;
  onOpenChat?: (userId: number) => void;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const ProfileSkeleton: React.FC = () => (
  <div className="max-w-xl mx-auto animate-fade-in-up">
    <div className="shimmer-skeleton h-40 rounded-b-2xl" />
    <div className="px-4 pb-4" style={{ background: 'var(--mt-surface)' }}>
      <div className="flex items-end justify-between -mt-12 mb-3">
        <div className="shimmer-skeleton w-24 h-24 rounded-2xl border-4" style={{ borderColor: 'var(--mt-surface)' }} />
        <div className="shimmer-skeleton w-28 h-9 rounded-xl mb-1" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="shimmer-skeleton h-5 w-40 rounded-full" />
        <div className="shimmer-skeleton h-3 w-24 rounded-full" />
        <div className="shimmer-skeleton h-3 w-64 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-2 py-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="text-center space-y-1">
            <div className="shimmer-skeleton h-6 w-12 rounded-full mx-auto" />
            <div className="shimmer-skeleton h-3 w-16 rounded-full mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PostSkeleton: React.FC = () => (
  <div className="mt-card p-4 space-y-2">
    <div className="shimmer-skeleton h-3 w-full rounded-full" />
    <div className="shimmer-skeleton h-3 w-4/5 rounded-full" />
    <div className="shimmer-skeleton h-3 w-2/3 rounded-full" />
    <div className="flex gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--mt-border)' }}>
      <div className="shimmer-skeleton h-5 w-10 rounded" />
      <div className="shimmer-skeleton h-5 w-10 rounded" />
      <div className="shimmer-skeleton h-5 w-10 rounded" />
    </div>
  </div>
);

// ── ProfilePage ───────────────────────────────────────────────────────────────
const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
  currentUser,
  isOwn = false,
  onEdit,
  onOpenChat,
}) => {
  const targetId = userId ?? currentUser.id;
  const isOwnProfile = isOwn || targetId === currentUser.id;

  const [user, setUser] = useState<ApiUser | null>(isOwnProfile ? currentUser : null);
  const [userLoading, setUserLoading] = useState(!isOwnProfile);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [tab, setTab] = useState<'posts' | 'badges' | 'photos'>('posts');
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [localFollowers, setLocalFollowers] = useState<number>(0);

  // ── Load user ──────────────────────────────────────────────────────────────
  const loadUser = useCallback(async () => {
    if (isOwnProfile) {
      setUser(currentUser);
      setLocalFollowers(currentUser.followers_count ?? 0);
      return;
    }
    setUserLoading(true);
    try {
      const res = await api.users.get(String(targetId));
      const loaded: ApiUser = res.user ?? res;
      setUser(loaded);
      setLocalFollowers(loaded.followers_count ?? 0);
    } catch {
      // ignore
    } finally {
      setUserLoading(false);
    }
  }, [targetId, isOwnProfile, currentUser]);

  // ── Load posts ─────────────────────────────────────────────────────────────
  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await api.posts.list({ author_id: targetId, limit: 30 });
      const list: ApiPost[] = Array.isArray(res.posts) ? res.posts : [];
      setPosts(list);
    } catch {
      // ignore
    } finally {
      setPostsLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    loadUser();
    loadPosts();
  }, [loadUser, loadPosts]);

  // ── Follow / Unfollow ──────────────────────────────────────────────────────
  const handleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    const wasFollowed = followed;
    setFollowed(!wasFollowed);
    setLocalFollowers(n => (wasFollowed ? n - 1 : n + 1));
    try {
      await api.users.follow(targetId);
    } catch {
      setFollowed(wasFollowed);
      setLocalFollowers(n => (wasFollowed ? n + 1 : n - 1));
    } finally {
      setFollowLoading(false);
    }
  };

  // ── Like post ──────────────────────────────────────────────────────────────
  const handleLike = async (postId: number) => {
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
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, liked: !p.liked, likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1 }
            : p,
        ),
      );
    }
  };

  if (userLoading) return <ProfileSkeleton />;
  if (!user) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-24 text-center px-8">
        <Icon name="UserX" size={40} className="mb-3 opacity-30" style={{ color: 'var(--mt-text-2)' }} />
        <p className="text-sm" style={{ color: 'var(--mt-text-2)' }}>
          Пользователь не найден
        </p>
      </div>
    );
  }

  const activeBadge: Badge | undefined = user.active_badge_id
    ? ALL_BADGES.find(b => b.id === user.active_badge_id)
    : undefined;

  const userBadges: Badge[] = (user.badges ?? [])
    .map(ub => ALL_BADGES.find(b => b.id === ub.id))
    .filter((b): b is Badge => b !== undefined);

  const mtId = `mt${user.id}`;

  return (
    <div className="max-w-xl mx-auto animate-fade-in-up">
      {/* Cover */}
      <div
        className="relative h-40 rounded-b-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a2a4a, #1a6ed8, #0891b2)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.3), transparent 60%)' }}
        />
        {isOwnProfile && (
          <button
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-white text-xs font-medium flex items-center gap-1.5"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={onEdit}
          >
            <Icon name="Camera" size={13} /> Сменить обложку
          </button>
        )}
      </div>

      {/* Avatar + Actions */}
      <div className="px-4 pb-0" style={{ background: 'var(--mt-surface)' }}>
        <div className="flex items-end justify-between -mt-12 mb-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt=""
              className="w-24 h-24 rounded-2xl border-4 object-cover"
              style={{ borderColor: 'var(--mt-surface)' }}
            />
            {user.is_online && (
              <div
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 bg-green-500"
                style={{ borderColor: 'var(--mt-surface)' }}
              />
            )}
          </div>

          <div className="flex gap-2 mb-1">
            {isOwnProfile ? (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
                style={{
                  borderColor: 'var(--mt-border)',
                  color: 'var(--mt-text)',
                  background: 'var(--mt-surface)',
                }}
              >
                <Icon name="Edit3" size={14} /> Редактировать
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60 ${followed ? '' : 'text-white'}`}
                  style={
                    followed
                      ? { border: '1.5px solid var(--mt-border)', color: 'var(--mt-text)' }
                      : { background: 'var(--mt-blue)', color: 'white' }
                  }
                >
                  <Icon name={followed ? 'UserCheck' : 'UserPlus'} size={14} />
                  {followed ? 'Подписан' : 'Подписаться'}
                </button>
                {onOpenChat && (
                  <button
                    onClick={() => onOpenChat(user.id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:opacity-80"
                    style={{ borderColor: 'var(--mt-border)', color: 'var(--mt-text)' }}
                  >
                    <Icon name="MessageCircle" size={16} />
                  </button>
                )}
                <button
                  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--mt-border)', color: 'var(--mt-text)' }}
                >
                  <Icon name="MoreHorizontal" size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Name + Info */}
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-heading font-bold" style={{ color: 'var(--mt-text)' }}>
              {user.first_name} {user.last_name}
            </h2>
            {activeBadge && <BadgeIcon badge={activeBadge} size="md" showTooltip />}
          </div>

          {/* MT ID prominently */}
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-sm font-semibold px-2 py-0.5 rounded-lg"
              style={{ color: 'var(--mt-blue)', background: 'rgba(26,110,216,0.12)' }}
            >
              {mtId}
            </span>
            {user.username && (
              <span className="text-sm" style={{ color: 'var(--mt-text-2)' }}>
                @{user.username}
              </span>
            )}
          </div>

          {user.bio && (
            <p className="text-sm mt-2" style={{ color: 'var(--mt-text)' }}>
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {user.location && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--mt-text-2)' }}>
                <Icon name="MapPin" size={12} /> {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs hover:underline"
                style={{ color: 'var(--mt-blue)' }}
              >
                <Icon name="Link" size={12} /> {user.website}
              </a>
            )}
            {user.join_date && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--mt-text-2)' }}>
                <Icon name="Calendar" size={12} /> С {user.join_date}
              </span>
            )}
            {(user.streak ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: '#f59e0b' }}>
                <Icon name="Flame" size={12} /> {user.streak} дней подряд
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-2 py-3 border-t border-b"
          style={{ borderColor: 'var(--mt-border)' }}
        >
          <div className="text-center">
            <p className="font-bold font-heading text-lg" style={{ color: 'var(--mt-text)' }}>
              {formatNumber(user.posts_count ?? posts.length)}
            </p>
            <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>
              Публикации
            </p>
          </div>
          <div className="text-center">
            <p className="font-bold font-heading text-lg" style={{ color: 'var(--mt-text)' }}>
              {formatNumber(localFollowers)}
            </p>
            <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>
              Подписчики
            </p>
          </div>
          <div className="text-center">
            <p className="font-bold font-heading text-lg" style={{ color: 'var(--mt-text)' }}>
              {formatNumber(user.following_count ?? 0)}
            </p>
            <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>
              Подписки
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--mt-border)' }}>
          {(['posts', 'badges', 'photos'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 text-sm font-medium transition-colors"
              style={{
                color: tab === t ? 'var(--mt-blue)' : 'var(--mt-text-2)',
                borderBottom: tab === t ? '2px solid var(--mt-blue)' : '2px solid transparent',
              }}
            >
              {t === 'posts' ? 'Записи' : t === 'badges' ? 'Значки' : 'Фото'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 py-4">
        {/* Posts tab */}
        {tab === 'posts' && (
          <div className="space-y-3">
            {postsLoading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <Icon
                  name="FileText"
                  size={32}
                  className="mx-auto mb-2 opacity-30"
                  style={{ color: 'var(--mt-text-2)' }}
                />
                <p className="text-sm" style={{ color: 'var(--mt-text-2)' }}>
                  Нет публикаций
                </p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="mt-card p-4 animate-fade-in-up">
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line mb-3"
                    style={{ color: 'var(--mt-text)' }}
                  >
                    {post.content}
                  </p>
                  <div
                    className="flex items-center gap-4 text-xs"
                    style={{ color: 'var(--mt-text-2)' }}
                  >
                    <span>{formatTime(new Date(post.created_at))}</span>
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 transition-colors ${post.liked ? 'text-red-500' : ''}`}
                      style={{ color: post.liked ? '#ef4444' : 'var(--mt-text-2)' }}
                    >
                      <Icon
                        name="Heart"
                        size={13}
                        className={post.liked ? 'fill-red-500' : ''}
                        style={{ color: post.liked ? '#ef4444' : undefined }}
                      />
                      {formatNumber(post.likes_count)}
                    </button>
                    <span className="flex items-center gap-1">
                      <Icon name="MessageCircle" size={13} />
                      {formatNumber(post.comments_count)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Badges tab */}
        {tab === 'badges' && (
          <div>
            {userBadges.length === 0 ? (
              <div className="text-center py-12">
                <Icon
                  name="Award"
                  size={32}
                  className="mx-auto mb-2 opacity-30"
                  style={{ color: 'var(--mt-text-2)' }}
                />
                <p className="text-sm" style={{ color: 'var(--mt-text-2)' }}>
                  Нет значков. Загляните в магазин!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {userBadges.map(badge => {
                  const cfg = RARITY_CONFIG[badge.rarity];
                  const isActive = badge.id === user.active_badge_id;
                  return (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${isActive ? 'ring-2' : ''}`}
                      style={{
                        background: 'var(--mt-surface-2)',
                        ringColor: isActive ? 'var(--mt-blue)' : undefined,
                        border: isActive ? '2px solid var(--mt-blue)' : '2px solid transparent',
                      }}
                    >
                      <BadgeIcon badge={badge} size="lg" showTooltip />
                      <div className="text-center">
                        <p
                          className="text-xs font-medium leading-tight"
                          style={{ color: 'var(--mt-text)' }}
                        >
                          {badge.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: cfg.color, fontSize: '10px' }}
                        >
                          {cfg.labelRu}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Photos tab */}
        {tab === 'photos' && (
          <div className="text-center py-12">
            <Icon
              name="Image"
              size={32}
              className="mx-auto mb-2 opacity-30"
              style={{ color: 'var(--mt-text-2)' }}
            />
            <p className="text-sm" style={{ color: 'var(--mt-text-2)' }}>
              Фотографии появятся здесь
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
