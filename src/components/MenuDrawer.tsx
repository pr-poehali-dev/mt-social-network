import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import BadgeIcon from './BadgeIcon';
import { User, formatNumber } from '@/data/mockData';
import { ALL_BADGES } from '@/data/badges';

interface MenuDrawerProps {
  user: User;
  onNavigate: (section: string) => void;
  onClose: () => void;
  onLogout: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onDailyLogin: () => void;
  dailyClaimed: boolean;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ user, onNavigate, onClose, onLogout, isDark, onToggleDark, onDailyLogin, dailyClaimed }) => {
  const activeBadge = ALL_BADGES[60];

  const menuItems = [
    { icon: 'User', label: 'Мой профиль', section: 'profile' },
    { icon: 'Medal', label: 'Магазин значков', section: 'badges' },
    { icon: 'Users', label: 'Друзья', section: 'friends' },
    { icon: 'BookOpen', label: 'Сохранённые', section: 'saved' },
    { icon: 'Bell', label: 'Уведомления', section: 'notifications' },
    { icon: 'Settings', label: 'Настройки', section: 'settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
      <div
        className="relative ml-auto w-80 h-full flex flex-col animate-slide-in-right"
        style={{ background: 'var(--mt-surface)' }}
        onClick={e => e.stopPropagation()}>

        {/* User block */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--mt-border)', background: 'linear-gradient(135deg, #1a2a4a, #1a6ed8)' }}>
          <div className="flex items-center gap-3 mb-4">
            <img src={user.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold truncate">{user.firstName} {user.lastName}</span>
                <BadgeIcon badge={activeBadge} size="sm" showTooltip />
              </div>
              <p className="text-blue-200 text-sm">@{user.username}</p>
            </div>
          </div>
          {/* MTCoins */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div className="text-center flex-1">
              <p className="text-yellow-300 text-lg font-bold font-heading">🪙 {formatNumber(user.mtCoins)}</p>
              <p className="text-blue-200 text-xs">MTCoins</p>
            </div>
            <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="text-center flex-1">
              <p className="text-white text-lg font-bold font-heading">🔥 {user.streak}</p>
              <p className="text-blue-200 text-xs">Дней подряд</p>
            </div>
          </div>
        </div>

        {/* Daily reward */}
        <button
          onClick={!dailyClaimed ? onDailyLogin : undefined}
          disabled={dailyClaimed}
          className={`mx-4 mt-4 p-3 rounded-xl flex items-center gap-3 transition-all ${!dailyClaimed ? 'hover:scale-[1.02]' : 'opacity-70'}`}
          style={{ background: dailyClaimed ? 'var(--mt-surface-2)' : 'linear-gradient(135deg, #f59e0b20, #fbbf2420)', border: `1.5px solid ${dailyClaimed ? 'var(--mt-border)' : '#f59e0b50'}` }}>
          <span className="text-2xl">{dailyClaimed ? '✅' : '🎁'}</span>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm" style={{ color: 'var(--mt-text)' }}>
              {dailyClaimed ? 'Награда получена!' : 'Ежедневная награда'}
            </p>
            <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>
              {dailyClaimed ? 'Приходите завтра за новой наградой' : '+ 50 MTCoins за вход сегодня'}
            </p>
          </div>
          {!dailyClaimed && <Icon name="ChevronRight" size={16} style={{ color: '#f59e0b' } as React.CSSProperties} />}
        </button>

        {/* Menu items */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {menuItems.map(item => (
            <button key={item.section} onClick={() => { onNavigate(item.section); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:opacity-80 text-left"
              style={{ color: 'var(--mt-text)', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--mt-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--mt-surface-2)' }}>
                <Icon name={item.icon as "User"} size={17} style={{ color: 'var(--mt-blue)' } as React.CSSProperties} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t space-y-1" style={{ borderColor: 'var(--mt-border)' }}>
          <button onClick={onToggleDark}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:opacity-80"
            style={{ color: 'var(--mt-text)', background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--mt-surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--mt-surface-2)' }}>
              <Icon name={isDark ? 'Sun' : 'Moon'} size={17} style={{ color: 'var(--mt-blue)' } as React.CSSProperties} />
            </div>
            <span className="text-sm font-medium">{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
          </button>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:opacity-80"
            style={{ color: '#ef4444', background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#ef444410')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#ef444415' }}>
              <Icon name="LogOut" size={17} className="text-red-500" />
            </div>
            <span className="text-sm font-medium">Выйти</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDrawer;
