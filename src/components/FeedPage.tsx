import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import BadgeIcon from './BadgeIcon';
import { User, Post, MOCK_POSTS, formatTime, formatNumber } from '@/data/mockData';
import { ALL_BADGES } from '@/data/badges';

interface FeedPageProps { currentUser: User; }

const PostCard: React.FC<{ post: Post; onLike: () => void }> = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const activeBadge = ALL_BADGES.find(b => b.id === 'l2');

  return (
    <div className="mt-card mb-3 overflow-hidden animate-fade-in-up">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm" style={{ color: 'var(--mt-text)' }}>
                {post.author.firstName} {post.author.lastName}
              </span>
              {activeBadge && <BadgeIcon badge={activeBadge} size="sm" showTooltip />}
              <span className="text-xs" style={{ color: 'var(--mt-text-2)' }}>@{post.author.username}</span>
              <span className="text-xs" style={{ color: 'var(--mt-text-2)' }}>· {formatTime(post.createdAt)}</span>
            </div>
            <p className="text-sm mt-2 leading-relaxed whitespace-pre-line" style={{ color: 'var(--mt-text)' }}>{post.content}</p>
            {post.image && <img src={post.image} alt="" className="mt-3 rounded-xl w-full object-cover max-h-80" />}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3 pt-3 border-t" style={{ borderColor: 'var(--mt-border)' }}>
          <button onClick={onLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${post.liked ? 'text-red-500' : ''}`}
            style={{ color: post.liked ? '#ef4444' : 'var(--mt-text-2)', background: post.liked ? '#ef444415' : 'transparent' }}>
            <Icon name={post.liked ? 'Heart' : 'Heart'} size={15} className={post.liked ? 'fill-red-500' : ''} />
            {formatNumber(post.likesCount)}
          </button>
          <button onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ color: 'var(--mt-text-2)' }}>
            <Icon name="MessageCircle" size={15} />
            {formatNumber(post.commentsCount)}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ color: post.reposted ? '#1a6ed8' : 'var(--mt-text-2)', background: post.reposted ? '#1a6ed815' : 'transparent' }}>
            <Icon name="Repeat2" size={15} />
            {formatNumber(post.repostsCount)}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ml-auto"
            style={{ color: 'var(--mt-text-2)' }}>
            <Icon name="Bookmark" size={15} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ color: 'var(--mt-text-2)' }}>
            <Icon name="Share2" size={15} />
          </button>
        </div>
        {showComments && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <Icon name="MessageCircle" size={14} className="mt-1 flex-shrink-0 text-gray-500" />
              <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>Комментарии будут отображаться здесь</p>
            </div>
            <div className="flex gap-2 mt-2">
              <input value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Написать комментарий..." className="flex-1 px-3 py-2 text-xs rounded-xl" />
              <button className="px-3 py-2 rounded-xl text-white text-xs font-medium" style={{ background: 'var(--mt-blue)' }}>
                <Icon name="Send" size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FeedPage: React.FC<FeedPageProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPost, setNewPost] = useState('');
  const [publishing, setPublishing] = useState(false);

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPublishing(true);
    setTimeout(() => {
      const p: Post = {
        id: Date.now().toString(), author: currentUser, content: newPost,
        likesCount: 0, commentsCount: 0, repostsCount: 0,
        createdAt: new Date(), liked: false, reposted: false,
      };
      setPosts([p, ...posts]);
      setNewPost('');
      setPublishing(false);
    }, 600);
  };

  const toggleLike = (id: string) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1 } : p));
  };

  return (
    <div className="max-w-xl mx-auto px-3 py-4">
      {/* New post box */}
      <div className="mt-card mb-4 p-4">
        <div className="flex gap-3">
          <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
          <div className="flex-1">
            <textarea
              value={newPost} onChange={e => setNewPost(e.target.value)}
              placeholder="Что у вас нового?"
              className="w-full resize-none text-sm p-3 rounded-xl min-h-[80px]"
              style={{ background: 'var(--mt-surface-2)', border: '1.5px solid var(--mt-border)', color: 'var(--mt-text)' }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--mt-text-2)' }}>
                  <Icon name="Image" size={16} />
                </button>
                <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--mt-text-2)' }}>
                  <Icon name="MapPin" size={16} />
                </button>
                <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--mt-text-2)' }}>
                  <Icon name="Smile" size={16} />
                </button>
              </div>
              <button
                onClick={handlePost}
                disabled={!newPost.trim() || publishing}
                className="px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: 'var(--mt-blue)' }}>
                {publishing ? 'Публикация...' : 'Опубликовать'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} />
      ))}
    </div>
  );
};

export default FeedPage;