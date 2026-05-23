const BASE = 'https://functions.poehali.dev/385918ea-1bbd-4598-ae9e-f841e82cd3b3';

function getToken(): string {
  return localStorage.getItem('mt_token') || '';
}

async function req(action: string, method = 'GET', body?: object, extraQs?: Record<string, string>) {
  const qs = new URLSearchParams({ action, ...extraQs });
  const opts: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Token': getToken(),
    },
  };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}/?${qs}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
  return data;
}

// AUTH
export const api = {
  auth: {
    register: (first_name: string, last_name: string, password: string) =>
      req('auth.register', 'POST', { first_name, last_name, password }),
    login: (identifier: string, password: string) =>
      req('auth.login', 'POST', { identifier, password }),
    logout: () => req('auth.logout', 'POST'),
    me: () => req('auth.me', 'GET'),
  },
  daily: {
    claim: () => req('daily', 'POST'),
  },
  users: {
    search: (q: string) => req('users.search', 'GET', undefined, { q }),
    get: (uid: string) => req('users.get', 'GET', undefined, { uid }),
    follow: (user_id: number) => req('users.follow', 'POST', { user_id }),
    update: (data: object) => req('users.update', 'POST', data),
    badge: (badge: object, price: number) => req('users.badge', 'POST', { badge, price }),
  },
  posts: {
    list: (params?: { limit?: number; offset?: number; author_id?: number }) =>
      req('posts.list', 'GET', undefined, Object.fromEntries(
        Object.entries(params || {}).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)])
      )),
    create: (content: string) => req('posts.create', 'POST', { content }),
    like: (post_id: number) => req('posts.like', 'POST', { post_id }),
    comments: (post_id: number) => req('posts.comments', 'GET', undefined, { post_id: String(post_id) }),
    comment: (post_id: number, content: string) => req('posts.comment', 'POST', { post_id, content }),
  },
  chats: {
    list: () => req('chats.list', 'GET'),
    create: (user_id: number) => req('chats.create', 'POST', { user_id }),
    messages: (chat_id: number) => req('chats.messages', 'GET', undefined, { chat_id: String(chat_id) }),
    send: (chat_id: number, text: string) => req('chats.send', 'POST', { chat_id, text }),
  },
};

export function saveToken(t: string) { localStorage.setItem('mt_token', t); }
export function clearToken() { localStorage.removeItem('mt_token'); }
export function hasToken() { return !!localStorage.getItem('mt_token'); }
