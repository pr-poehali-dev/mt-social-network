import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import BadgeIcon from './BadgeIcon';
import { User, Post, MOCK_POSTS, formatNumber, formatTime } from '@/data/mockData';
import { Badge, RARITY_CONFIG, ALL_BADGES } from '@/data/badges';

interface ProfilePageProps { user: User; currentUser: User; isOwn?: boolean; onEdit?: () => void; }

const ProfilePage: React.FC<ProfilePageProps> = ({ user, currentUser, isOwn = false, onEdit }) => {
  const [tab, setTab] = useState<'posts' | 'badges' | 'photos'>('posts');
  const [followed, setFollowed] = useState(false);
  const userPosts = MOCK_POSTS.filter(p => p.author.id === user.id);
  const [posts, setPosts] = useState(userPosts);
  const displayedBadges = user.badges.slice(0, 12);
  const sampleBadges = ALL_BADGES.slice(0, 12);

  const toggleLike = (id: string) => setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1 } : p));

  const activeBadge = user.activeBadge || ALL_BADGES[60];

  return (
    <div className="max-w-xl mx-auto">
      {/* Cover */}
      <div className="relative h-40 rounded-b-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a2a4a, #1a6ed8, #0891b2)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.3), transparent 60%)' }} />
        {isOwn && (
          <button className="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-white text-xs font-medium flex items-center gap-1.5"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
            onClick={onEdit}>
            <Icon name="Camera" size={13} /> Сменить обложку
          </button>
        )}
      </div>

      {/* Avatar + info */}
      <div className="px-4 pb-4" style={{ background: 'var(--mt-surface)' }}>
        <div className="flex items-end justify-between -mt-12 mb-3">
          <div className="relative">
            <img src={user.avatar} alt="" className="w-24 h-24 rounded-2xl border-4 object-cover"
              style={{ borderColor: 'var(--mt-surface)' }} />
            {user.isOnline && <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 bg-green-500" style={{ borderColor: 'var(--mt-surface)' }} />}
          </div>
          <div className="flex gap-2 mb-1">
            {isOwn ? (
              <button onClick={onEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
                style={{ borderColor: 'var(--mt-border)', color: 'var(--mt-text)', background: 'var(--mt-surface)' }}>
                <Icon name="Edit3" size={14} /> Редактировать
              </button>
            ) : (
              <>
                <button onClick={() => setFollowed(!followed)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 ${followed ? '' : 'text-white'}`}
                  style={followed ? { border: '1.5px solid var(--mt-border)', color: 'var(--mt-text)' } : { background: 'var(--mt-blue)', color: 'white' }}>
                  <Icon name={followed ? 'UserCheck' : 'UserPlus'} size={14} />
                  {followed ? 'Подписан' : 'Подписаться'}
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--mt-border)', color: 'var(--mt-text)' }}>
                  <Icon name="MessageCircle" size={16} />
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--mt-border)', color: 'var(--mt-text)' }}>
                  <Icon name="MoreHorizontal" size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-heading font-bold" style={{ color: 'var(--mt-text)' }}>{user.firstName} {user.lastName}</h2>
            {activeBadge && <BadgeIcon badge={activeBadge} size="md" showTooltip />}
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--mt-text-2)' }}>@{user.username}</p>
          {user.bio && <p className="text-sm mt-2" style={{ color: 'var(--mt-text)' }}>{user.bio}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {user.location && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--mt-text-2)' }}>
                <Icon name="MapPin" size={12} /> {user.location}
              </span>
            )}
            {user.website && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--mt-blue)' }}>
                <Icon name="Link" size={12} /> {user.website}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--mt-text-2)' }}>
              <Icon name="Calendar" size={12} /> С {user.joinDate}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b" style={{ borderColor: 'var(--mt-border)' }}>
          <div className="text-center">
            <p className="font-bold font-heading text-lg" style={{ color: 'var(--mt-text)' }}>{formatNumber(user.postsCount)}</p>
            <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>Публикации</p>
          </div>
          <div className="text-center">
            <p className="font-bold font-heading text-lg" style={{ color: 'var(--mt-text)' }}>{formatNumber(user.followersCount)}</p>
            <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>Подписчики</p>
          </div>
          <div className="text-center">
            <p className="font-bold font-heading text-lg" style={{ color: 'var(--mt-text)' }}>{formatNumber(user.followingCount)}</p>
            <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>Подписки</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mt-0" style={{ borderColor: 'var(--mt-border)' }}>
          {(['posts', 'badges', 'photos'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${tab === t ? 'border-blue-500' : 'border-transparent'}`}
              style={{ color: tab === t ? 'var(--mt-blue)' : 'var(--mt-text-2)', borderBottom: tab === t ? '2px solid var(--mt-blue)' : '2px solid transparent' }}>
              {t === 'posts' ? 'Записи' : t === 'badges' ? 'Значки' : 'Фото'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {tab === 'posts' && (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="FileText" size={32} className="mx-auto mb-2 opacity-30" style={{ color: 'var(--mt-text-2)' } as React.CSSProperties} />
                <p className="text-sm" style={{ color: 'var(--mt-text-2)' }}>Нет публикаций</p>
              </div>
            ) : posts.map(post => (
              <div key={post.id} className="mt-card p-4">
                <p className="text-sm leading-relaxed whitespace-pre-line mb-3" style={{ color: 'var(--mt-text)' }}>{post.content}</p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--mt-text-2)' }}>
                  <span>{formatTime(post.createdAt)}</span>
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 transition-colors ${post.liked ? 'text-red-500' : ''}`}>
                    <Icon name="Heart" size={13} className={post.liked ? 'fill-red-500 text-red-500' : ''} /> {formatNumber(post.likesCount)}
                  </button>
                  <span className="flex items-center gap-1"><Icon name="MessageCircle" size={13} /> {formatNumber(post.commentsCount)}</span>
                  <span className="flex items-center gap-1"><Icon name="Repeat2" size={13} /> {formatNumber(post.repostsCount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'badges' && (
          <div>
            {sampleBadges.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm" style={{ color: 'var(--mt-text-2)' }}>Нет значков. Загляните в магазин!</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {sampleBadges.map(badge => {
                  const cfg = RARITY_CONFIG[badge.rarity];
                  return (
                    <div key={badge.id} className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:scale-105 cursor-pointer"
                      style={{ background: 'var(--mt-surface-2)' }}>
                      <BadgeIcon badge={badge} size="lg" showTooltip />
                      <span className="text-xs text-center leading-tight" style={{ color: 'var(--mt-text)' }}>{badge.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: cfg.color + '25', color: cfg.color }}>
                        {cfg.labelRu}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'photos' && (
          <div className="grid grid-cols-3 gap-1.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${i * 40},60%,50%), hsl(${i * 40 + 60},70%,40%))` }}>
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="Image" size={24} className="opacity-30 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
