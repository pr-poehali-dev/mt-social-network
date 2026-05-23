import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import BadgeIcon from './BadgeIcon';
import { formatTime } from '@/data/mockData';
import { ALL_BADGES, Badge } from '@/data/badges';
import { api } from '@/lib/api';

interface ApiUser {
  id: number;
  mt_id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
  active_badge_id?: string;
  badges?: Array<{ id: string }>;
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
  mt_coins?: number;
  streak?: number;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  is_online?: boolean;
  join_date?: string;
  daily_claimed_at?: string;
}

interface ApiMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  text: string;
  created_at: string;
  read?: boolean;
}

interface ApiChat {
  id: number;
  other_user: ApiUser;
  last_message?: ApiMessage;
  unread_count?: number;
  created_at: string;
}

interface MessengerPageProps {
  currentUser: ApiUser;
  onStartChat?: (userId: number) => void;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const ChatSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="shimmer-skeleton w-12 h-12 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="shimmer-skeleton h-3 w-28 rounded-full" />
      <div className="shimmer-skeleton h-3 w-44 rounded-full" />
    </div>
    <div className="shimmer-skeleton h-3 w-10 rounded-full" />
  </div>
);

// ── New Chat Modal ─────────────────────────────────────────────────────────────
interface NewChatModalProps {
  currentUser: ApiUser;
  onClose: () => void;
  onChatCreated: (chat: ApiChat) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ currentUser, onClose, onChatCreated }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ApiUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.users.search(query.trim());
        const users: ApiUser[] = Array.isArray(res.users) ? res.users : [];
        setResults(users.filter(u => u.id !== currentUser.id));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, currentUser.id]);

  const startChat = async (userId: number) => {
    setCreating(userId);
    try {
      const res = await api.chats.create(userId);
      const chat: ApiChat = res.chat ?? {
        id: res.id ?? Date.now(),
        other_user: results.find(u => u.id === userId) as ApiUser,
        unread_count: 0,
        created_at: new Date().toISOString(),
      };
      onChatCreated(chat);
    } catch {
      // ignore
    } finally {
      setCreating(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 z-10 animate-fade-in-up"
        style={{ background: 'var(--mt-surface)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base" style={{ color: 'var(--mt-text)' }}>
            Новый чат
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80"
            style={{ background: 'var(--mt-surface-2)', color: 'var(--mt-text-2)' }}
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="relative mb-3">
          <Icon
            name="Search"
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--mt-text-2)' }}
          />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            placeholder="Найти пользователя..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl"
            style={{
              background: 'var(--mt-surface-2)',
              border: '1.5px solid var(--mt-border)',
              color: 'var(--mt-text)',
            }}
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {searching && (
            <p className="text-xs text-center py-4" style={{ color: 'var(--mt-text-2)' }}>
              Поиск...
            </p>
          )}
          {!searching && query.trim() && results.length === 0 && (
            <p className="text-xs text-center py-4" style={{ color: 'var(--mt-text-2)' }}>
              Пользователи не найдены
            </p>
          )}
          {results.map(user => {
            const badge: Badge | undefined = user.active_badge_id
              ? ALL_BADGES.find(b => b.id === user.active_badge_id)
              : undefined;
            return (
              <button
                key={user.id}
                onClick={() => startChat(user.id)}
                disabled={creating === user.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: 'var(--mt-surface-2)' }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {user.is_online && (
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                      style={{ background: '#22c55e', borderColor: 'var(--mt-surface-2)' }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--mt-text)' }}>
                      {user.first_name} {user.last_name}
                    </span>
                    {badge && <BadgeIcon badge={badge} size="sm" showTooltip />}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--mt-text-2)' }}>
                    mt{user.id}
                  </p>
                </div>
                {creating === user.id ? (
                  <Icon name="Loader2" size={16} className="animate-spin flex-shrink-0" style={{ color: 'var(--mt-text-2)' }} />
                ) : (
                  <Icon name="MessageCirclePlus" size={16} className="flex-shrink-0" style={{ color: 'var(--mt-blue)' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── MessengerPage ─────────────────────────────────────────────────────────────
const MessengerPage: React.FC<MessengerPageProps> = ({ currentUser }) => {
  const [chats, setChats] = useState<ApiChat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<ApiChat | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [search, setSearch] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load chats ─────────────────────────────────────────────────────────────
  const loadChats = useCallback(async () => {
    try {
      const res = await api.chats.list();
      const list: ApiChat[] = Array.isArray(res.chats) ? res.chats : [];
      setChats(list);
    } catch {
      // ignore
    } finally {
      setChatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // ── Load messages ──────────────────────────────────────────────────────────
  const loadMessages = useCallback(async (chatId: number, silent = false) => {
    if (!silent) setMessagesLoading(true);
    try {
      const res = await api.chats.messages(chatId);
      const list: ApiMessage[] = Array.isArray(res.messages) ? res.messages : [];
      setMessages(list);
    } catch {
      // ignore
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // ── Open chat ──────────────────────────────────────────────────────────────
  const openChat = useCallback(
    async (chat: ApiChat) => {
      setActiveChat(chat);
      setMessages([]);
      setInput('');
      setTyping(false);
      await loadMessages(chat.id);
      // Mark as read by zeroing unread count locally
      setChats(prev => prev.map(c => (c.id === chat.id ? { ...c, unread_count: 0 } : c)));
    },
    [loadMessages],
  );

  // ── Polling while chat is open ─────────────────────────────────────────────
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!activeChat) return;
    pollRef.current = setInterval(() => {
      loadMessages(activeChat.id, true);
    }, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeChat, loadMessages]);

  // ── Auto scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, typing]);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || !activeChat || sending) return;
    const text = input.trim();
    setSending(true);
    setInput('');

    // Optimistic
    const optimistic: ApiMessage = {
      id: Date.now(),
      chat_id: activeChat.id,
      sender_id: currentUser.id,
      text,
      created_at: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, optimistic]);

    // Typing indicator (fake, 1.5s)
    setTyping(true);
    setTimeout(() => setTyping(false), 1500);

    try {
      await api.chats.send(activeChat.id, text);
      // Update chat list last message
      setChats(prev =>
        prev.map(c =>
          c.id === activeChat.id
            ? { ...c, last_message: optimistic }
            : c,
        ),
      );
      // Refresh messages after a short delay to sync
      setTimeout(() => loadMessages(activeChat.id, true), 800);
    } catch {
      // Remove optimistic on error
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  // ── Filter chats by search ─────────────────────────────────────────────────
  const filteredChats = chats.filter(c => {
    const name = `${c.other_user.first_name} ${c.other_user.last_name}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  // ── Chat view ──────────────────────────────────────────────────────────────
  if (activeChat) {
    const other = activeChat.other_user;
    const badge: Badge | undefined = other.active_badge_id
      ? ALL_BADGES.find(b => b.id === other.active_badge_id)
      : undefined;

    return (
      <div className="flex flex-col h-[calc(100vh-128px)]">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--mt-border)', background: 'var(--mt-surface)' }}
        >
          <button
            onClick={() => {
              setActiveChat(null);
              setMessages([]);
            }}
            style={{ color: 'var(--mt-text-2)' }}
          >
            <Icon name="ArrowLeft" size={20} />
          </button>

          <div className="relative flex-shrink-0">
            <img src={other.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            {other.is_online && (
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                style={{ background: '#22c55e', borderColor: 'var(--mt-surface)' }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm truncate" style={{ color: 'var(--mt-text)' }}>
                {other.first_name} {other.last_name}
              </span>
              {badge && <BadgeIcon badge={badge} size="sm" showTooltip />}
            </div>
            <p className="text-xs" style={{ color: other.is_online ? '#22c55e' : 'var(--mt-text-2)' }}>
              {other.is_online ? 'онлайн' : 'не в сети'} · mt{other.id}
            </p>
          </div>

          <button style={{ color: 'var(--mt-text-2)' }}>
            <Icon name="Phone" size={18} />
          </button>
          <button style={{ color: 'var(--mt-text-2)' }}>
            <Icon name="Video" size={18} />
          </button>
          <button style={{ color: 'var(--mt-text-2)' }}>
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
          style={{ background: 'var(--mt-surface-2)' }}
        >
          {messagesLoading && messages.length === 0 ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="shimmer-skeleton rounded-2xl"
                    style={{ width: `${120 + i * 30}px`, height: '36px' }}
                  />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'var(--mt-surface)' }}
              >
                <Icon name="MessageCircle" size={28} style={{ color: 'var(--mt-text-2)' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--mt-text)' }}>
                Начните диалог
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--mt-text-2)' }}>
                Напишите первое сообщение!
              </p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMine = msg.sender_id === currentUser.id;
              const prev = messages[i - 1];
              const showDate =
                i === 0 ||
                new Date(prev.created_at).toDateString() !==
                  new Date(msg.created_at).toDateString();

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="text-center my-2">
                      <span
                        className="text-xs px-3 py-1 rounded-full"
                        style={{ background: 'var(--mt-border)', color: 'var(--mt-text-2)' }}
                      >
                        {new Date(msg.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  >
                    {!isMine && (
                      <img
                        src={other.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full mr-2 flex-shrink-0 self-end object-cover"
                      />
                    )}
                    <div
                      className={`max-w-[75%] px-4 py-2.5 ${isMine ? 'msg-bubble-mine' : 'msg-bubble-theirs'}`}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: isMine ? 'white' : 'var(--mt-text)' }}
                      >
                        {msg.text}
                      </p>
                      <div
                        className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <span className="text-xs opacity-60">
                          {formatTime(new Date(msg.created_at))}
                        </span>
                        {isMine && (
                          <Icon
                            name={msg.read ? 'CheckCheck' : 'Check'}
                            size={11}
                            style={{ color: msg.read ? '#60a5fa' : undefined, opacity: msg.read ? 1 : 0.5 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}

          {/* Typing indicator */}
          {typing && (
            <div className="flex items-center gap-2 animate-fade-in-up">
              <img src={other.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
              <div className="msg-bubble-theirs px-4 py-3 flex gap-1">
                <span
                  className="w-2 h-2 rounded-full typing-dot-1"
                  style={{ background: 'var(--mt-text-2)', display: 'inline-block' }}
                />
                <span
                  className="w-2 h-2 rounded-full typing-dot-2"
                  style={{ background: 'var(--mt-text-2)', display: 'inline-block' }}
                />
                <span
                  className="w-2 h-2 rounded-full typing-dot-3"
                  style={{ background: 'var(--mt-text-2)', display: 'inline-block' }}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div
          className="px-3 py-3 border-t flex items-end gap-2 flex-shrink-0"
          style={{ borderColor: 'var(--mt-border)', background: 'var(--mt-surface)' }}
        >
          <button style={{ color: 'var(--mt-text-2)' }} className="pb-2.5">
            <Icon name="Paperclip" size={18} />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Сообщение..."
              rows={1}
              className="w-full px-4 py-2.5 text-sm rounded-2xl resize-none"
              style={{
                maxHeight: '120px',
                minHeight: '42px',
                background: 'var(--mt-surface-2)',
                border: '1.5px solid var(--mt-border)',
                color: 'var(--mt-text)',
              }}
            />
          </div>
          <button style={{ color: 'var(--mt-text-2)' }} className="pb-2.5">
            <Icon name="Smile" size={18} />
          </button>
          {input.trim() ? (
            <button
              onClick={sendMessage}
              disabled={sending}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'var(--mt-blue)' }}
            >
              <Icon name="Send" size={16} className="text-white" />
            </button>
          ) : (
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--mt-surface-2)', color: 'var(--mt-text-2)' }}
            >
              <Icon name="Mic" size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Chat list ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto">
      {/* Search + New Chat */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--mt-border)' }}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--mt-text-2)' }}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по чатам..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl"
              style={{
                background: 'var(--mt-surface-2)',
                border: '1.5px solid var(--mt-border)',
                color: 'var(--mt-text)',
              }}
            />
          </div>
          <button
            onClick={() => setShowNewChat(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90"
            style={{ background: 'var(--mt-blue)' }}
          >
            <Icon name="Plus" size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Chat list */}
      {chatsLoading ? (
        <>
          <ChatSkeleton />
          <ChatSkeleton />
          <ChatSkeleton />
        </>
      ) : filteredChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'var(--mt-surface-2)' }}
          >
            <Icon name="MessageSquare" size={32} style={{ color: 'var(--mt-text-2)' }} />
          </div>
          <p className="font-semibold text-base mb-1" style={{ color: 'var(--mt-text)' }}>
            {search ? 'Ничего не найдено' : 'Нет чатов'}
          </p>
          <p className="text-sm" style={{ color: 'var(--mt-text-2)' }}>
            {search
              ? 'Попробуйте другой запрос'
              : 'Нажмите + чтобы начать новый диалог'}
          </p>
          {!search && (
            <button
              onClick={() => setShowNewChat(true)}
              className="mt-4 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
              style={{ background: 'var(--mt-blue)' }}
            >
              Написать кому-нибудь
            </button>
          )}
        </div>
      ) : (
        <div>
          {filteredChats.map(chat => {
            const other = chat.other_user;
            const badge: Badge | undefined = other.active_badge_id
              ? ALL_BADGES.find(b => b.id === other.active_badge_id)
              : undefined;
            const unread = chat.unread_count ?? 0;
            const lastMsg = chat.last_message;

            return (
              <button
                key={chat.id}
                onClick={() => openChat(chat)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-opacity hover:opacity-80 border-b"
                style={{ borderColor: 'var(--mt-border)' }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={other.avatar}
                    alt=""
                    className={`w-12 h-12 rounded-full object-cover ${other.is_online ? 'story-ring-active' : ''}`}
                  />
                  {other.is_online && (
                    <div
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
                      style={{ background: '#22c55e', borderColor: 'var(--mt-surface)' }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="font-semibold text-sm truncate"
                        style={{ color: 'var(--mt-text)' }}
                      >
                        {other.first_name} {other.last_name}
                      </span>
                      {badge && <BadgeIcon badge={badge} size="sm" showTooltip />}
                    </div>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--mt-text-2)' }}>
                      {lastMsg ? formatTime(new Date(lastMsg.created_at)) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs truncate flex-1" style={{ color: 'var(--mt-text-2)' }}>
                      {lastMsg
                        ? lastMsg.sender_id === currentUser.id
                          ? `Вы: ${lastMsg.text}`
                          : lastMsg.text
                        : `mt${other.id}`}
                    </p>
                    {unread > 0 && (
                      <span
                        className="ml-2 flex-shrink-0 text-xs text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-medium"
                        style={{ background: 'var(--mt-blue)', fontSize: '10px' }}
                      >
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* New chat modal */}
      {showNewChat && (
        <NewChatModal
          currentUser={currentUser}
          onClose={() => setShowNewChat(false)}
          onChatCreated={chat => {
            setChats(prev => {
              const exists = prev.find(c => c.id === chat.id);
              return exists ? prev : [chat, ...prev];
            });
            setShowNewChat(false);
            openChat(chat);
          }}
        />
      )}
    </div>
  );
};

export default MessengerPage;
