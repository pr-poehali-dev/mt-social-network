import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { formatTime } from '@/data/mockData';

interface ApiUser {
  id: number; mt_id: string; first_name: string; last_name: string;
  username: string; avatar: string;
}

interface Story {
  id: string;
  author: ApiUser;
  gradient: string;
  text: string;
  viewed: boolean;
  createdAt: Date;
}

const GRADIENTS = [
  'linear-gradient(135deg,#1a6ed8,#60a5fa)',
  'linear-gradient(135deg,#7c3aed,#ec4899)',
  'linear-gradient(135deg,#059669,#34d399)',
  'linear-gradient(135deg,#d97706,#fbbf24)',
  'linear-gradient(135deg,#dc2626,#f472b6)',
  'linear-gradient(135deg,#0891b2,#06b6d4)',
];

const INITIAL_STORIES: Story[] = [];

const StoryViewer: React.FC<{ stories: Story[]; idx: number; onClose: () => void }> = ({ stories, idx: initIdx, onClose }) => {
  const [idx, setIdx] = useState(initIdx);
  const story = stories[idx];
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(interval); if (idx < stories.length - 1) setIdx(i => i + 1); else onClose(); return 100; } return p + 2; }), 100);
    return () => clearInterval(interval);
  }, [idx]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.95)' }}>
      <div className="relative w-full max-w-sm h-full max-h-screen md:max-h-[700px] md:rounded-2xl overflow-hidden"
        style={{ background: story.gradient }}>
        <div className="absolute top-0 left-0 right-0 p-3 z-10">
          <div className="flex gap-1 mb-3">
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <div className="h-full rounded-full transition-all" style={{ background: 'white', width: i < idx ? '100%' : i === idx ? `${progress}%` : '0%' }} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <img src={story.author.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
            <div>
              <p className="text-white text-sm font-medium">{story.author.first_name} {story.author.last_name}</p>
              <p className="text-white/70 text-xs">{formatTime(story.createdAt)}</p>
            </div>
            <button onClick={onClose} className="ml-auto text-white/80 hover:text-white">
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-xl font-medium text-center px-8">{story.text}</p>
        </div>
        <button onClick={() => idx > 0 && setIdx(i => i - 1)} className="absolute left-0 top-0 bottom-0 w-1/3" />
        <button onClick={() => idx < stories.length - 1 ? setIdx(i => i + 1) : onClose()} className="absolute right-0 top-0 bottom-0 w-1/3" />
        <div className="absolute bottom-6 left-0 right-0 px-4 flex gap-2">
          <input placeholder="Ответить..." className="flex-1 px-4 py-2 rounded-full text-sm text-white placeholder-white/60"
            style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.3)' }} />
          <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Icon name="Send" size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StoriesPage: React.FC<{ currentUser: ApiUser }> = ({ currentUser }) => {
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [viewing, setViewing] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [newGrad, setNewGrad] = useState(GRADIENTS[0]);
  const myStories = stories.filter(s => s.author.id === currentUser.id);

  const addStory = () => {
    if (!newText.trim() || myStories.length >= 2) return;
    const s: Story = {
      id: Date.now().toString(), author: currentUser, gradient: newGrad,
      text: newText, viewed: false, createdAt: new Date(),
    };
    setStories([s, ...stories]);
    setNewText(''); setAdding(false);
  };

  const grouped = Object.values(stories.reduce<Record<string, { user: ApiUser; stories: Story[] }>>((acc, s) => {
    const key = String(s.author.id);
    if (!acc[key]) acc[key] = { user: s.author, stories: [] };
    acc[key].stories.push(s);
    return acc;
  }, {}));

  return (
    <div className="max-w-xl mx-auto px-3 py-4">
      {viewing !== null && (
        <StoryViewer stories={stories} idx={viewing} onClose={() => setViewing(null)} />
      )}

      {adding && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl p-5 animate-slide-up" style={{ background: 'var(--mt-surface)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--mt-text)' }}>Новая история</h3>
              <button onClick={() => setAdding(false)} style={{ color: 'var(--mt-text-2)' }}><Icon name="X" size={18} /></button>
            </div>
            {myStories.length >= 2 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--mt-text-2)' }}>Максимум 2 истории. Удалите одну, чтобы добавить новую.</p>
            ) : (
              <>
                <div className="rounded-xl p-4 mb-3 flex items-center justify-center min-h-24" style={{ background: newGrad }}>
                  <p className="text-white text-center">{newText || 'Предпросмотр...'}</p>
                </div>
                <textarea value={newText} onChange={e => setNewText(e.target.value)}
                  placeholder="Текст истории..." className="w-full p-3 text-sm rounded-xl resize-none min-h-20 mb-3" />
                <div className="flex gap-2 mb-4">
                  {GRADIENTS.map(g => (
                    <button key={g} onClick={() => setNewGrad(g)}
                      className={`w-8 h-8 rounded-full flex-shrink-0 transition-transform ${newGrad === g ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}`}
                      style={{ background: g }} />
                  ))}
                </div>
                <button onClick={addStory} className="w-full py-3 rounded-xl text-white font-medium text-sm" style={{ background: 'var(--mt-blue)' }}>
                  Опубликовать историю
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold" style={{ color: 'var(--mt-text)' }}>Истории</h2>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-sm font-medium" style={{ background: 'var(--mt-blue)' }}>
          <Icon name="Plus" size={14} /> Добавить
        </button>
      </div>

      {/* My stories */}
      {myStories.length > 0 && (
        <div className="mt-card mb-4 p-4">
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--mt-text-2)' }}>МОИ ИСТОРИИ</p>
          <div className="flex gap-3">
            {myStories.map((s, i) => (
              <button key={s.id} onClick={() => setViewing(stories.indexOf(s))}
                className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
                <div className="w-16 h-24 rounded-xl overflow-hidden relative" style={{ background: s.gradient }}>
                  <p className="absolute inset-0 flex items-center justify-center text-white text-xs text-center p-1">{s.text}</p>
                </div>
                <span className="text-xs" style={{ color: 'var(--mt-text-2)' }}>{formatTime(s.createdAt)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All stories by user */}
      <div className="space-y-3">
        {grouped.filter(g => g.user.id !== currentUser.id).map(({ user, stories: uStories }) => (
          <div key={user.id} className="mt-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setViewing(stories.indexOf(uStories[0]))}
                className="relative flex-shrink-0">
                <div className="story-ring-active rounded-full p-0.5">
                  <img src={user.avatar} alt="" className="w-12 h-12 rounded-full border-2" style={{ borderColor: 'var(--mt-surface)' }} />
                </div>
                {!uStories[0].viewed && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: '#1a6ed8', borderColor: 'var(--mt-surface)' }} />
                )}
              </button>
              <div>
                <p className="font-medium text-sm" style={{ color: 'var(--mt-text)' }}>{user.first_name} {user.last_name}</p>
                <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>{uStories.length} {uStories.length === 1 ? 'история' : 'истории'} · {formatTime(uStories[0].createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {uStories.map((s, i) => (
                <button key={s.id} onClick={() => setViewing(stories.indexOf(s))}
                  className="w-20 h-28 rounded-xl overflow-hidden relative flex-shrink-0 transition-transform hover:scale-105"
                  style={{ background: s.gradient }}>
                  <p className="absolute inset-0 flex items-center justify-center text-white text-xs text-center p-1">{s.text}</p>
                  {s.viewed && <div className="absolute inset-0 bg-black/30 rounded-xl" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesPage;