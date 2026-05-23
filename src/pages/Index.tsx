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
import { User, MOCK_USERS } from '@/data/mockData';
import { Badge } from '@/data/badges';

type Tab = 'feed' | 'messenger' | 'stories' | 'menu';
type Section = 'feed' | 'messenger' | 'stories' | 'profile' | 'badges' | 'friends' | 'saved' | 'notifications' | 'settings';

const defaultUser: User = {
  ...MOCK_USERS[0],
  id: 'me',
  firstName: 'Пользователь',
  lastName: '',
  username: 'user',
};

const Index: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [tab, setTab] = useState<Tab>('feed');
  const [section, setSection] = useState<Section>('feed');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [unreadMessages] = useState(1);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleLogin = (data: { firstName: string; lastName: string; password: string; isNew?: boolean }) => {
    const u: User = {
      ...defaultUser,
      firstName: data.firstName,
      lastName: data.lastName || '',
      username: data.firstName.toLowerCase().replace(/\s+/g, ''),
      mtCoins: data.isNew ? 100 : 450,
      streak: data.isNew ? 1 : 3,
    };
    setCurrentUser(u);
    setAuthed(true);
    if (data.isNew) { setTimeout(() => { setShowReward(true); setTimeout(() => setShowReward(false), 3000); }, 500); }
  };

  const handleDailyLogin = () => {
    setDailyClaimed(true);
    setCurrentUser(u => ({ ...u, mtCoins: u.mtCoins + 50, streak: u.streak + 1 }));
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  const handleBadgeBuy = (badge: Badge, price: number) => {
    setCurrentUser(u => ({ ...u, badges: [...u.badges, badge], mtCoins: u.mtCoins - price }));
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

  if (!authed) return <AuthPage onLogin={handleLogin} />;

  const renderContent = () => {
    switch (section) {
      case 'feed': return <FeedPage currentUser={currentUser} />;
      case 'messenger': return <MessengerPage currentUser={currentUser} />;
      case 'stories': return <StoriesPage currentUser={currentUser} />;
      case 'profile': return <ProfilePage user={currentUser} currentUser={currentUser} isOwn onEdit={() => setSection('settings')} />;
      case 'badges': return <BadgeShopPage currentUser={currentUser} onBuy={handleBadgeBuy} />;
      case 'settings': return <SettingsPage user={currentUser} onUpdate={u => setCurrentUser(prev => ({ ...prev, ...u }))} isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />;
      default: return <FeedPage currentUser={currentUser} />;
    }
  };

  const sectionTitle: Record<string, string> = {
    feed: 'МТ', messenger: 'Сообщения', stories: 'Истории',
    profile: 'Профиль', badges: 'Магазин значков', settings: 'Настройки',
    friends: 'Друзья', saved: 'Сохранённые', notifications: 'Уведомления',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--mt-surface-2)' }}>
      {/* TOP NAV */}
      <header className="sticky top-0 z-40 border-b" style={{ background: 'var(--mt-surface)', borderColor: 'var(--mt-border)', height: 56 }}>
        <div className="max-w-xl mx-auto h-full flex items-center px-4 gap-3">
          {!['feed','messenger','stories'].includes(section) ? (
            <button onClick={() => { setSection('feed'); setTab('feed'); }} style={{ color: 'var(--mt-text-2)' }}>
              <Icon name="ArrowLeft" size={20} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a6ed8, #3b82f6)' }}>
                <span className="text-white text-xs font-heading font-black">МТ</span>
              </div>
            </div>
          )}
          <h1 className="font-heading font-bold text-base flex-1" style={{ color: 'var(--mt-text)' }}>
            {sectionTitle[section] || 'МТ'}
          </h1>
          {section === 'feed' && (
            <button className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ color: 'var(--mt-text-2)', background: 'var(--mt-surface-2)' }}>
              <Icon name="Search" size={16} />
            </button>
          )}
          <button
            className="relative w-8 h-8 rounded-xl flex items-center justify-center" style={{ color: 'var(--mt-text-2)', background: 'var(--mt-surface-2)' }}>
            <Icon name="Bell" size={16} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-white flex items-center justify-center" style={{ background: '#ef4444', fontSize: '8px' }}>3</span>
          </button>
          <button onClick={() => handleSection('profile')}
            className="transition-transform hover:scale-105">
            <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          </button>
        </div>
      </header>

      {/* DAILY REWARD TOAST */}
      {showReward && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3" style={{ background: 'var(--mt-surface)', border: '1.5px solid #f59e0b50' }}>
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
          onLogout={() => { setAuthed(false); setMenuOpen(false); }}
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t" style={{ background: 'var(--mt-surface)', borderColor: 'var(--mt-border)', height: 64 }}>
        <div className="max-w-xl mx-auto h-full grid grid-cols-4">
          {([
            { key: 'feed' as Tab, icon: 'Home', label: 'Главная' },
            { key: 'messenger' as Tab, icon: 'MessageCircle', label: 'Мессенджер', badge: unreadMessages },
            { key: 'stories' as Tab, icon: 'PlayCircle', label: 'Истории' },
            { key: 'menu' as Tab, icon: 'Menu', label: 'Меню' },
          ]).map(item => {
            const isActive = item.key === 'menu' ? menuOpen : (tab === item.key && !menuOpen);
            return (
              <button key={item.key}
                onClick={() => handleNavTab(item.key)}
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
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full" style={{ background: 'var(--mt-blue)' }} />
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