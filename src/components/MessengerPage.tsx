import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import BadgeIcon from './BadgeIcon';
import { User, Chat, Message, MOCK_CHATS, MOCK_USERS, formatTime } from '@/data/mockData';
import { ALL_BADGES } from '@/data/badges';

interface MessengerPageProps { currentUser: User; }

const MessengerPage: React.FC<MessengerPageProps> = ({ currentUser }) => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages.length]);

  const getOtherUser = (chat: Chat) => chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0];

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    const msg: Message = { id: Date.now().toString(), senderId: currentUser.id, text: input, createdAt: new Date(), read: false };
    const updated = { ...activeChat, messages: [...activeChat.messages, msg], lastMessage: msg };
    setChats(cs => cs.map(c => c.id === activeChat.id ? updated : c));
    setActiveChat(updated);
    setInput('');

    // simulate typing + reply
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = ['Понятно, спасибо!', 'Отличная мысль!', 'Согласен полностью.', 'Интересно, расскажи подробнее.', 'Договорились!'];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: getOtherUser(activeChat).id,
        text: replies[Math.floor(Math.random() * replies.length)],
        createdAt: new Date(), read: false,
      };
      const withReply = { ...updated, messages: [...updated.messages, reply], lastMessage: reply };
      setChats(cs => cs.map(c => c.id === activeChat.id ? withReply : c));
      setActiveChat(withReply);
    }, 1500 + Math.random() * 1000);
  };

  const filteredChats = chats.filter(c => {
    const other = getOtherUser(c);
    return `${other.firstName} ${other.lastName}`.toLowerCase().includes(search.toLowerCase());
  });

  const activeBadge = ALL_BADGES.find(b => b.id === 'u1');

  if (activeChat) {
    const other = getOtherUser(activeChat);
    return (
      <div className="flex flex-col h-[calc(100vh-128px)]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--mt-border)', background: 'var(--mt-surface)' }}>
          <button onClick={() => setActiveChat(null)} style={{ color: 'var(--mt-text-2)' }}>
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="relative">
            <img src={other.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            {other.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: '#22c55e', borderColor: 'var(--mt-surface)' }} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm" style={{ color: 'var(--mt-text)' }}>{other.firstName} {other.lastName}</span>
              {activeBadge && <BadgeIcon badge={activeBadge} size="sm" showTooltip />}
            </div>
            <p className="text-xs" style={{ color: other.isOnline ? '#22c55e' : 'var(--mt-text-2)' }}>
              {other.isOnline ? 'онлайн' : 'не в сети'}
            </p>
          </div>
          <button style={{ color: 'var(--mt-text-2)' }}><Icon name="Phone" size={18} /></button>
          <button style={{ color: 'var(--mt-text-2)' }}><Icon name="Video" size={18} /></button>
          <button style={{ color: 'var(--mt-text-2)' }}><Icon name="MoreVertical" size={18} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ background: 'var(--mt-surface-2)' }}>
          {activeChat.messages.map((msg, i) => {
            const isMine = msg.senderId === currentUser.id;
            const showDate = i === 0 || new Date(activeChat.messages[i-1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="text-center my-2">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--mt-border)', color: 'var(--mt-text-2)' }}>
                      {new Date(msg.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  {!isMine && <img src={other.avatar} alt="" className="w-7 h-7 rounded-full mr-2 flex-shrink-0 self-end object-cover" />}
                  <div className={`max-w-[75%] px-4 py-2.5 ${isMine ? 'msg-bubble-mine' : 'msg-bubble-theirs'}`}>
                    <p className="text-sm leading-relaxed" style={{ color: isMine ? 'white' : 'var(--mt-text)' }}>{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs opacity-60">{formatTime(new Date(msg.createdAt))}</span>
                      {isMine && <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={11} className={msg.read ? 'opacity-100' : 'opacity-50'} style={{ color: msg.read ? '#60a5fa' : undefined }} />}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          {typing && (
            <div className="flex items-center gap-2 animate-fade-in-up">
              <img src={other.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
              <div className="msg-bubble-theirs px-4 py-3 flex gap-1">
                <span className="w-2 h-2 rounded-full typing-dot-1" style={{ background: 'var(--mt-text-2)', display: 'inline-block' }} />
                <span className="w-2 h-2 rounded-full typing-dot-2" style={{ background: 'var(--mt-text-2)', display: 'inline-block' }} />
                <span className="w-2 h-2 rounded-full typing-dot-3" style={{ background: 'var(--mt-text-2)', display: 'inline-block' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t flex items-end gap-2" style={{ borderColor: 'var(--mt-border)', background: 'var(--mt-surface)' }}>
          <button style={{ color: 'var(--mt-text-2)' }} className="pb-2.5"><Icon name="Paperclip" size={18} /></button>
          <div className="flex-1 relative">
            <textarea
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
              placeholder="Сообщение..." rows={1}
              className="w-full px-4 py-2.5 text-sm rounded-2xl resize-none"
              style={{ maxHeight: '120px', minHeight: '42px' }}
            />
          </div>
          <button style={{ color: 'var(--mt-text-2)' }} className="pb-2.5"><Icon name="Smile" size={18} /></button>
          {input.trim() ? (
            <button onClick={sendMessage}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              style={{ background: 'var(--mt-blue)' }}>
              <Icon name="Send" size={16} className="text-white" />
            </button>
          ) : (
            <button className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--mt-surface-2)', color: 'var(--mt-text-2)' }}>
              <Icon name="Mic" size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--mt-border)' }}>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по сообщениям..." className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl" />
        </div>
      </div>
      {filteredChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--mt-surface-2)' }}>
            <Icon name="MessageCircle" size={28} style={{ color: 'var(--mt-text-2)' } as React.CSSProperties} />
          </div>
          <p className="font-medium mb-1" style={{ color: 'var(--mt-text)' }}>Нет сообщений</p>
          <p className="text-sm" style={{ color: 'var(--mt-text-2)' }}>Найдите друзей и начните общение</p>
        </div>
      ) : (
        filteredChats.map(chat => {
          const other = getOtherUser(chat);
          const last = chat.messages[chat.messages.length - 1];
          return (
            <button key={chat.id} onClick={() => setActiveChat(chat)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-80 transition-all border-b"
              style={{ borderColor: 'var(--mt-border)', background: 'var(--mt-surface)' }}>
              <div className="relative flex-shrink-0">
                <img src={other.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                {other.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2" style={{ background: '#22c55e', borderColor: 'var(--mt-surface)' }} />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: 'var(--mt-text)' }}>{other.firstName} {other.lastName}</span>
                  <span className="text-xs" style={{ color: 'var(--mt-text-2)' }}>{last ? formatTime(new Date(last.createdAt)) : ''}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs truncate pr-2" style={{ color: 'var(--mt-text-2)' }}>
                    {last?.senderId === currentUser.id ? 'Вы: ' : ''}{last?.text || ''}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--mt-blue)' }}>{chat.unreadCount}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })
      )}
      <button
        onClick={() => {
          const newChat: Chat = {
            id: 'chat_new', participants: [currentUser, MOCK_USERS[3]],
            messages: [], unreadCount: 0,
          };
          setChats(cs => [newChat, ...cs]);
          setActiveChat(newChat);
        }}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105"
        style={{ background: 'var(--mt-blue)' }}>
        <Icon name="PenSquare" size={20} />
      </button>
    </div>
  );
};

export default MessengerPage;
