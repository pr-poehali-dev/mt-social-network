import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ApiUser {
  id: number; mt_id: string; first_name: string; last_name: string;
  username: string; avatar: string; active_badge_id?: string;
  badges?: Array<{ id: string }>; bio?: string; location?: string;
  website?: string; email?: string; mt_coins?: number; streak?: number;
  followers_count?: number; following_count?: number; posts_count?: number;
  is_online?: boolean; join_date?: string; daily_claimed_at?: string;
}

interface SettingsPageProps { user: ApiUser; onUpdate: (u: Partial<ApiUser>) => void; isDark: boolean; onToggleDark: () => void; }

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-card mb-3 overflow-hidden">
    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--mt-border)' }}>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--mt-text-2)' }}>{title}</p>
    </div>
    <div>{children}</div>
  </div>
);

const SettingsRow: React.FC<{ icon: string; label: string; value?: string; onClick?: () => void; danger?: boolean; right?: React.ReactNode }> = ({ icon, label, value, onClick, danger, right }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 transition-all hover:opacity-80 border-b last:border-0"
    style={{ borderColor: 'var(--mt-border)', background: 'var(--mt-surface)' }}>
    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: danger ? '#ef444415' : 'var(--mt-surface-2)' }}>
      <Icon name={icon as "User"} size={15} style={{ color: danger ? '#ef4444' : 'var(--mt-blue)' } as React.CSSProperties} />
    </div>
    <div className="flex-1 text-left">
      <span className="text-sm font-medium" style={{ color: danger ? '#ef4444' : 'var(--mt-text)' }}>{label}</span>
      {value && <p className="text-xs mt-0.5" style={{ color: 'var(--mt-text-2)' }}>{value}</p>}
    </div>
    {right || <Icon name="ChevronRight" size={14} style={{ color: 'var(--mt-text-2)' } as React.CSSProperties} />}
  </button>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdate, isDark, onToggleDark }) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ first_name: user.first_name, last_name: user.last_name, bio: user.bio ?? '', location: user.location ?? '', website: user.website ?? '', email: user.email ?? '' });

  const save = () => { onUpdate({ first_name: form.first_name, last_name: form.last_name, bio: form.bio, location: form.location, website: form.website, email: form.email }); setEditing(null); };

  const toggle = (label: string) => (
    <button onClick={onToggleDark}
      className="relative w-10 h-6 rounded-full transition-all flex items-center"
      style={{ background: isDark ? 'var(--mt-blue)' : 'var(--mt-border)', padding: '2px' }}>
      <div className="w-5 h-5 rounded-full bg-white transition-all shadow" style={{ transform: isDark ? 'translateX(16px)' : 'translateX(0)' }} />
    </button>
  );

  if (editing === 'profile') {
    return (
      <div className="max-w-xl mx-auto px-3 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setEditing(null)} style={{ color: 'var(--mt-text-2)' }}><Icon name="ArrowLeft" size={20} /></button>
          <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--mt-text)' }}>Редактировать профиль</h2>
        </div>
        <div className="mt-card p-4 space-y-3">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--mt-text-2)' }}>Имя</label>
            <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--mt-text-2)' }}>Фамилия</label>
            <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--mt-text-2)' }}>О себе</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl resize-none min-h-20" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--mt-text-2)' }}>Город</label>
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--mt-text-2)' }}>Сайт</label>
            <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full px-3 py-2.5 text-sm rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--mt-text-2)' }}>Email (для восстановления пароля)</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="w-full px-3 py-2.5 text-sm rounded-xl" />
          </div>
          <button onClick={save} className="w-full py-3 rounded-xl text-white font-medium mt-2" style={{ background: 'var(--mt-blue)' }}>Сохранить</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-3 py-4">
      <h2 className="text-lg font-heading font-bold mb-4" style={{ color: 'var(--mt-text)' }}>Настройки</h2>

      <Section title="Аккаунт">
        <SettingsRow icon="User" label="Редактировать профиль" value={`${user.first_name} ${user.last_name}`} onClick={() => setEditing('profile')} />
        <SettingsRow icon="Mail" label="Email" value={user.email || 'Не привязан — добавьте для восстановления пароля'} onClick={() => setEditing('profile')} />
        <SettingsRow icon="Lock" label="Изменить пароль" />
        <SettingsRow icon="Phone" label="Номер телефона" value="Не привязан" />
      </Section>

      <Section title="Приватность">
        <SettingsRow icon="Eye" label="Видимость профиля" value="Публичный" />
        <SettingsRow icon="UserCheck" label="Кто может подписываться" value="Все" />
        <SettingsRow icon="MessageSquare" label="Кто может писать сообщения" value="Все" />
        <SettingsRow icon="Users" label="Чёрный список" value="0 пользователей" />
      </Section>

      <Section title="Уведомления">
        <SettingsRow icon="Bell" label="Уведомления о лайках" right={<span className="text-xs font-medium" style={{ color: '#22c55e' }}>Вкл</span>} />
        <SettingsRow icon="MessageCircle" label="Новые сообщения" right={<span className="text-xs font-medium" style={{ color: '#22c55e' }}>Вкл</span>} />
        <SettingsRow icon="UserPlus" label="Новые подписчики" right={<span className="text-xs font-medium" style={{ color: '#22c55e' }}>Вкл</span>} />
      </Section>

      <Section title="Внешний вид">
        <SettingsRow icon={isDark ? 'Moon' : 'Sun'} label="Тёмная тема" right={toggle('dark')} />
        <SettingsRow icon="Type" label="Размер текста" value="Стандартный" />
      </Section>

      <Section title="Другое">
        <SettingsRow icon="HelpCircle" label="Справка и поддержка" />
        <SettingsRow icon="Info" label="О приложении" value="МТ v1.0.0" />
        <SettingsRow icon="Shield" label="Политика конфиденциальности" />
        <SettingsRow icon="LogOut" label="Выйти из аккаунта" danger />
      </Section>
    </div>
  );
};

export default SettingsPage;