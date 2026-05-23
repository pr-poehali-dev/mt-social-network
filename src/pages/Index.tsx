import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import AuthPage from '@/components/AuthPage';
import FeedPage from '@/components/FeedPage';
import MessengerPage from '@/components/MessengerPage';
import StoriesPage from '@/components/StoriesPage';
import ProfilePage from '@/components/ProfilePage';
import BadgeShopPage from '@/components/BadgeShopPage';
import SettingsPage from '@/components/SettingsPage';
import MenuDrawer from '@/components/MenuDrawer';
import { api, saveToken, clearToken, hasToken } from '@/lib/api';

interface ApiUser {
  id: number; mt_id: string; first_name: string; last_name: string;
  username: string; avatar: string; active_badge_id?: string;
  badges?: Array<{id: string}>; bio?: string; location?: string;
  website?: string; email?: string; mt_coins?: number; streak?: number;
  followers_count?: number; following_count?: number; posts_count?: number;
  is_online?: boolean; join_date?: string; daily_claimed_at?: string;
}

type Tab = 'feed' | 'messenger' | 'stories' | 'menu';
type Section = 'feed' | 'messenger' | 'stories' | 'profile' | 'profile_other' | 'badges' | 'settings' | 'search';

const Index: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [tab, setTab] = useState<Tab>('feed');
  const [section, setSection] = useState<Section>('feed');
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [unreadCount] = useState(0);

  // Check saved session on mount
  useEffect(() => {
    if (hasToken()) {
      api.auth.me().then(res => {
        setCurrentUser(res.user);
        setAuthed(true);
        const today = new Date().toDateString();
        const claimed = res.user.daily_claimed_at && new Date(res.user.daily_claimed_at).toDateString() === today;
        setDailyClaimed(!!claimed);
      }).catch(() => {
        clearToken();
      }).finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleLogin = (user: object) => {
    const u = user as ApiUser & { isNew?: boolean };
    setCurrentUser(u);
    setAuthed(true);
    if (u.isNew) {
      setTimeout(() => { setShowReward(true); setTimeout(() => setShowReward(false), 3000); }, 600);
    }
    const today = new Date().toDateString();
    const claimed = u.daily_claimed_at && new Date(u.daily_claimed_at).toDateString() === today;
    setDailyClaimed(!!claimed);
  };

  const handleDailyLogin = async () => {
    try {
      await api.daily.claim();
      setDailyClaimed(true);
      setCurrentUser(u => u ? { ...u, mt_coins: (u.mt_coins || 0) + 50, streak: (u.streak || 0) + 1 } : u);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    } catch (_e) { /* ignore */ }
  };

  const handleBadgeBuy = async (badge: object, price: number) => {
    try {
      await api.users.badge(badge, price);
      setCurrentUser(u => u ? {
        ...u,
        badges: [...(u.badges || []), badge as {id: string}],
        mt_coins: (u.mt_coins || 0) - price,
      } : u);
    } catch (_e) { /* ignore */ }
  };

  const handleLogout = async () => {
    await api.auth.logout();
    clearToken();
    setAuthed(false);
    setCurrentUser(null);
    setMenuOpen(false);
  };

  const handleNavTab = (t: Tab) => {
    if (t === 'menu') { setMenuOpen(true); return; }
    setMenuOpen(false);
    setTab(t);
    if (t === 'feed') setSection('feed');
    if (t === 'messenger') setSection('messenger');
    if (t === 'stories') setSection('stories');
  };

  const handleSection = (s: string) => {
    setMenuOpen(false);
    setSection(s as Section);
    if (s === 'feed') setTab('feed');
    if (s === 'messenger') setTab('messenger');
    if (s === 'stories') setTab('stories');
  };

  const handleOpenProfile = (userId: number) => {
    if (currentUser && userId === currentUser.id) {
      setSection('profile');
    } else {
      setViewingUserId(userId);
      setSection('profile_other');
    }
    setMenuOpen(false);
  };

  const handleOpenChat = (_userId: number) => {
    setSection('messenger');
    setTab('messenger');
    setMenuOpen(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f1923' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ background: 'linear-gradient(135deg,#1a6ed8,#3b82f6)' }}>
            <span className="text-white text-2xl font-heading font-black">МТ</span>
          </div>
          <p className="text-gray-400 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!authed || !currentUser) return <AuthPage onLogin={handleLogin} />;

  const sectionTitle: Record<string, string> = {
    feed: 'МТ', messenger: 'Сообщения', stories: 'Истории',
    profile: 'Профиль', profile_other: 'Профиль', badges: 'Магазин значков',
    settings: 'Настройки', search: 'Поиск',
  };

  const renderContent = () => {
    switch (section) {
      case 'feed':
        return <FeedPage currentUser={currentUser} onOpenProfile={handleOpenProfile} />;
      case 'messenger':
        return <MessengerPage currentUser={currentUser} />;
      case 'stories':
        return <StoriesPage currentUser={currentUser} />;
      case 'profile':
        return <ProfilePage currentUser={currentUser} isOwn onEdit={() => setSection('settings')} onOpenChat={handleOpenChat} />;
      case 'profile_other':
        return <ProfilePage userId={viewingUserId ?? undefined} currentUser={currentUser} onOpenChat={handleOpenChat} />;
      case 'badges':
        return <BadgeShopPage currentUser={currentUser} onBuy={handleBadgeBuy} />;
      case 'settings':
        return <SettingsPage
          user={currentUser}
          onUpdate={async (u) => {
            try { const res = await api.users.update(u); setCurrentUser(res.user); } catch (_e) { /* ignore */ }
          }}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
        />;
      default:
        return <FeedPage currentUser={currentUser} onOpenProfile={handleOpenProfile} />;
    }
  };

  const isMain = ['feed','messenger','stories'].includes(section);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--mt-surface-2)' }}>
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 border-b" style={{ background: 'var(--mt-surface)', borderColor: 'var(--mt-border)', height: 56 }}>
        <div className="max-w-xl mx-auto h-full flex items-center px-4 gap-3">
          {!isMain ? (
            <button onClick={() => { setSection('feed'); setTab('feed'); }} style={{ color: 'var(--mt-text-2)' }}>
              <Icon name="ArrowLeft" size={20} />
            </button>
          ) : (
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1a6ed8,#3b82f6)' }}>
              <span className="text-white text-xs font-heading font-black">МТ</span>
            </div>
          )}
          <h1 className="font-heading font-bold text-base flex-1" style={{ color: 'var(--mt-text)' }}>
            {sectionTitle[section] || 'МТ'}
          </h1>
          {section === 'feed' && (
            <button onClick={() => handleSection('search')}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ color: 'var(--mt-text-2)', background: 'var(--mt-surface-2)' }}>
              <Icon name="Search" size={16} />
            </button>
          )}
          <button className="relative w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ color: 'var(--mt-text-2)', background: 'var(--mt-surface-2)' }}>
            <Icon name="Bell" size={16} />
          </button>
          <button onClick={() => handleSection('profile')} className="transition-transform hover:scale-105">
            <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          </button>
        </div>
      </header>

      {/* REWARD TOAST */}
      {showReward && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
            style={{ background: 'var(--mt-surface)', border: '1.5px solid #f59e0b50' }}>
            <span className="text-2xl">🎁</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--mt-text)' }}>+50 MTCoins</p>
              <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>Ежедневная награда!</p>
            </div>
          </div>
        </div>
      )}

      {/* MENU DRAWER */}
      {menuOpen && (
        <MenuDrawer
          user={currentUser}
          onNavigate={handleSection}
          onClose={() => setMenuOpen(false)}
          onLogout={handleLogout}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onDailyLogin={handleDailyLogin}
          dailyClaimed={dailyClaimed}
        />
      )}

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 72 }}>
        {renderContent()}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{ background: 'var(--mt-surface)', borderColor: 'var(--mt-border)', height: 64 }}>
        <div className="max-w-xl mx-auto h-full grid grid-cols-4">
          {([
            { key: 'feed' as Tab, icon: 'Home', label: 'Главная' },
            { key: 'messenger' as Tab, icon: 'MessageCircle', label: 'Мессенджер', badge: unreadCount },
            { key: 'stories' as Tab, icon: 'PlayCircle', label: 'Истории' },
            { key: 'menu' as Tab, icon: 'Menu', label: 'Меню' },
          ]).map(item => {
            const isActive = item.key === 'menu' ? menuOpen : (tab === item.key && !menuOpen);
            return (
              <button key={item.key} onClick={() => handleNavTab(item.key)}
                className="flex flex-col items-center justify-center gap-0.5 transition-all relative"
                style={{ color: isActive ? 'var(--mt-blue)' : 'var(--mt-text-2)' }}>
                <div className="relative">
                  <Icon name={item.icon as "Home"} size={22} />
                  {'badge' in item && item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                      style={{ background: '#ef4444', fontSize: '9px' }}>{item.badge}</span>
                  )}
                </div>
                <span style={{ fontSize: '10px', fontWeight: 500 }}>{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background: 'var(--mt-blue)' }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;