import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onLogin: (user: { firstName: string; lastName: string; password: string; isNew?: boolean }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', password: '', confirm: '', email: '' });
  const [error, setError] = useState('');
  const [recoverSent, setRecoverSent] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'login') {
      if (!form.firstName || !form.password) { setError('Заполните имя и пароль'); return; }
      onLogin({ firstName: form.firstName, lastName: form.lastName, password: form.password });
    } else if (mode === 'register') {
      if (!form.firstName || !form.lastName || !form.password) { setError('Заполните имя, фамилию и пароль'); return; }
      if (form.password !== form.confirm) { setError('Пароли не совпадают'); return; }
      if (form.password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }
      onLogin({ firstName: form.firstName, lastName: form.lastName, password: form.password, isNew: true });
    } else {
      if (!form.email) { setError('Введите email'); return; }
      setRecoverSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f1923 0%, #162032 50%, #0f1923 100%)' }}>
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #1a6ed8, #3b82f6)' }}>
            <span className="text-white text-2xl font-heading font-black">МТ</span>
          </div>
          <h1 className="text-white text-2xl font-heading font-bold">МТ Социальная сеть</h1>
          <p className="text-gray-400 text-sm mt-1">Деловое сообщество нового поколения</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#161e2d', border: '1px solid #2a3447' }}>
          {/* Tabs */}
          {mode !== 'recover' && (
            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: '#1e2736' }}>
              <button onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                style={mode === 'login' ? { background: '#1a6ed8' } : {}}>Войти</button>
              <button onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                style={mode === 'register' ? { background: '#1a6ed8' } : {}}>Регистрация</button>
            </div>
          )}

          {mode === 'recover' && recoverSent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#1a3a1a' }}>
                <Icon name="CheckCircle" size={24} className="text-green-400" />
              </div>
              <p className="text-white font-medium">Письмо отправлено!</p>
              <p className="text-gray-400 text-sm mt-1">Проверьте {form.email}</p>
              <button onClick={() => { setMode('login'); setRecoverSent(false); }} className="mt-4 text-blue-400 text-sm hover:text-blue-300">← Вернуться ко входу</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'recover' && (
                <>
                  <p className="text-gray-300 text-sm mb-4">Введите email, привязанный к аккаунту, и мы отправим ссылку для восстановления пароля.</p>
                  <input value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="Email" type="email" className="w-full px-4 py-3 text-sm rounded-xl" />
                </>
              )}
              {(mode === 'login' || mode === 'register') && (
                <input value={form.firstName} onChange={e => set('firstName', e.target.value)}
                  placeholder="Имя" className="w-full px-4 py-3 text-sm rounded-xl" />
              )}
              {mode === 'register' && (
                <input value={form.lastName} onChange={e => set('lastName', e.target.value)}
                  placeholder="Фамилия" className="w-full px-4 py-3 text-sm rounded-xl" />
              )}
              {(mode === 'login' || mode === 'register') && (
                <input value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Пароль" type="password" className="w-full px-4 py-3 text-sm rounded-xl" />
              )}
              {mode === 'register' && (
                <input value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Повторите пароль" type="password" className="w-full px-4 py-3 text-sm rounded-xl" />
              )}
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit"
                className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #1a6ed8, #3b82f6)' }}>
                {mode === 'login' ? 'Войти' : mode === 'register' ? 'Создать аккаунт' : 'Отправить ссылку'}
              </button>
            </form>
          )}

          {mode === 'login' && (
            <div className="text-center mt-3">
              <button onClick={() => setMode('recover')} className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
                Забыли пароль?
              </button>
            </div>
          )}
          {mode === 'recover' && !recoverSent && (
            <div className="text-center mt-3">
              <button onClick={() => setMode('login')} className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
                ← Вернуться ко входу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
