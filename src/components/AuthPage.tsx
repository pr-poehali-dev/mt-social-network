import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { api, saveToken } from '@/lib/api';

interface AuthPageProps {
  onLogin: (user: object) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [form, setForm] = useState({ firstName: '', lastName: '', identifier: '', password: '', confirm: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoverSent, setRecoverSent] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        if (!form.identifier || !form.password) { setError('Заполните логин и пароль'); setLoading(false); return; }
        const res = await api.auth.login(form.identifier, form.password);
        saveToken(res.token);
        onLogin(res.user);
      } else if (mode === 'register') {
        if (!form.firstName || !form.password) { setError('Заполните имя и пароль'); setLoading(false); return; }
        if (form.password !== form.confirm) { setError('Пароли не совпадают'); setLoading(false); return; }
        if (form.password.length < 6) { setError('Пароль минимум 6 символов'); setLoading(false); return; }
        const res = await api.auth.register(form.firstName, form.lastName, form.password);
        saveToken(res.token);
        onLogin({ ...res.user, isNew: true });
      } else {
        if (!form.email) { setError('Введите email'); setLoading(false); return; }
        setRecoverSent(true);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f1923 0%, #162032 50%, #0f1923 100%)' }}>
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #1a6ed8, #3b82f6)' }}>
            <span className="text-white text-2xl font-heading font-black">МТ</span>
          </div>
          <h1 className="text-white text-2xl font-heading font-bold">МТ Социальная сеть</h1>
          <p className="text-gray-400 text-sm mt-1">Реальная соцсеть нового поколения</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#161e2d', border: '1px solid #2a3447' }}>
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
              <p className="text-white font-medium">Функция в разработке</p>
              <p className="text-gray-400 text-sm mt-1">Привяжите email в настройках профиля</p>
              <button onClick={() => { setMode('login'); setRecoverSent(false); }} className="mt-4 text-blue-400 text-sm hover:text-blue-300">← Назад</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'recover' && (
                <p className="text-gray-300 text-sm mb-3">Восстановление пароля через email будет доступно после привязки адреса в настройках.</p>
              )}
              {mode === 'register' && (
                <>
                  <input value={form.firstName} onChange={e => set('firstName', e.target.value)}
                    placeholder="Имя" className="w-full px-4 py-3 text-sm rounded-xl"
                    style={{ background: '#1e2736', border: '1.5px solid #2a3447', color: '#e8edf5' }} />
                  <input value={form.lastName} onChange={e => set('lastName', e.target.value)}
                    placeholder="Фамилия" className="w-full px-4 py-3 text-sm rounded-xl"
                    style={{ background: '#1e2736', border: '1.5px solid #2a3447', color: '#e8edf5' }} />
                </>
              )}
              {mode === 'login' && (
                <input value={form.identifier} onChange={e => set('identifier', e.target.value)}
                  placeholder="Имя, MT ID или @username" className="w-full px-4 py-3 text-sm rounded-xl"
                  style={{ background: '#1e2736', border: '1.5px solid #2a3447', color: '#e8edf5' }} />
              )}
              {(mode === 'login' || mode === 'register') && (
                <input value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Пароль" type="password" className="w-full px-4 py-3 text-sm rounded-xl"
                  style={{ background: '#1e2736', border: '1.5px solid #2a3447', color: '#e8edf5' }} />
              )}
              {mode === 'register' && (
                <input value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Повторите пароль" type="password" className="w-full px-4 py-3 text-sm rounded-xl"
                  style={{ background: '#1e2736', border: '1.5px solid #2a3447', color: '#e8edf5' }} />
              )}
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1a6ed8, #3b82f6)' }}>
                {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : mode === 'register' ? 'Создать аккаунт' : 'Восстановить'}
              </button>
            </form>
          )}

          {mode === 'login' && !loading && (
            <div className="text-center mt-3">
              <button onClick={() => setMode('recover')} className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
                Забыли пароль?
              </button>
            </div>
          )}
          {mode === 'recover' && !recoverSent && (
            <div className="text-center mt-3">
              <button onClick={() => setMode('login')} className="text-gray-500 text-xs hover:text-gray-300">← Войти</button>
            </div>
          )}
          {mode === 'register' && (
            <p className="text-center text-xs mt-3" style={{ color: '#3b82f6' }}>
              Ваш MT ID будет автоматически создан при регистрации
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
