import { Badge } from './badges';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  mtCoins: number;
  badges: Badge[];
  activeBadge?: Badge;
  lastLogin: Date;
  streak: number;
  email?: string;
  isOnline: boolean;
  joinDate: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  createdAt: Date;
  liked: boolean;
  reposted: boolean;
}

export interface Story {
  id: string;
  author: User;
  image: string;
  viewed: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

export const MOCK_USERS: User[] = [
  {
    id: '1', firstName: 'Алексей', lastName: 'Морозов', username: 'alexmorozov',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=alex&backgroundColor=b6e3f4',
    bio: 'Предприниматель · Инвестор · Технолог', location: 'Москва', website: 'alexmorozov.ru',
    followersCount: 12400, followingCount: 890, postsCount: 234, mtCoins: 4750,
    badges: [], activeBadge: undefined, lastLogin: new Date(), streak: 15,
    email: 'alex@example.com', isOnline: true, joinDate: '2024-01-15',
  },
  {
    id: '2', firstName: 'Мария', lastName: 'Ковалёва', username: 'mariakov',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=maria&backgroundColor=ffdfbf',
    bio: 'UX Дизайнер · Путешественница', location: 'Санкт-Петербург', website: '',
    followersCount: 8900, followingCount: 450, postsCount: 187, mtCoins: 2300,
    badges: [], activeBadge: undefined, lastLogin: new Date(), streak: 7,
    email: '', isOnline: true, joinDate: '2024-02-20',
  },
  {
    id: '3', firstName: 'Дмитрий', lastName: 'Петров', username: 'dmpetrov',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=dmitry&backgroundColor=c0aede',
    bio: 'Backend разработчик · Open Source', location: 'Новосибирск', website: 'github.com/dmpetrov',
    followersCount: 3200, followingCount: 210, postsCount: 89, mtCoins: 1800,
    badges: [], activeBadge: undefined, lastLogin: new Date(Date.now() - 3600000), streak: 3,
    email: '', isOnline: false, joinDate: '2024-03-10',
  },
  {
    id: '4', firstName: 'Анна', lastName: 'Соколова', username: 'annasokolova',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=anna&backgroundColor=d1f4ff',
    bio: 'Финансовый аналитик · Мама', location: 'Казань', website: '',
    followersCount: 1500, followingCount: 680, postsCount: 43, mtCoins: 950,
    badges: [], activeBadge: undefined, lastLogin: new Date(Date.now() - 7200000), streak: 1,
    email: '', isOnline: false, joinDate: '2024-04-05',
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1', author: MOCK_USERS[1], content: 'Только что закончила новый дизайн для мобильного приложения. Работала над ним 3 недели — и это стоило каждой минуты. Покажу детали в следующем посте! 🎨', image: undefined,
    likesCount: 234, commentsCount: 18, repostsCount: 12, createdAt: new Date(Date.now() - 1800000), liked: false, reposted: false,
  },
  {
    id: 'p2', author: MOCK_USERS[0], content: 'Новый взгляд на продуктивность: перестал планировать каждую минуту и начал работать с потоком. За последний месяц сделал в 2 раза больше. Парадокс? Нет — это наука.\n\nПодробный разбор методологии — в блоге.', image: undefined,
    likesCount: 891, commentsCount: 67, repostsCount: 143, createdAt: new Date(Date.now() - 7200000), liked: true, reposted: false,
  },
  {
    id: 'p3', author: MOCK_USERS[2], content: 'Опенсорс-проект набрал 1000 звёзд на GitHub! Это маленький, но приятный milestone. Спасибо всем, кто поддерживает и контрибьютит ⭐', image: undefined,
    likesCount: 445, commentsCount: 34, repostsCount: 89, createdAt: new Date(Date.now() - 14400000), liked: false, reposted: false,
  },
  {
    id: 'p4', author: MOCK_USERS[3], content: 'Финансовый совет дня: не пытайтесь угадать рынок. Лучше инвестируйте регулярно небольшими суммами. За 10 лет результат удивит вас больше, чем вы ожидаете.', image: undefined,
    likesCount: 312, commentsCount: 28, repostsCount: 56, createdAt: new Date(Date.now() - 86400000), liked: false, reposted: false,
  },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    participants: [MOCK_USERS[0], MOCK_USERS[1]],
    messages: [
      { id: 'm1', senderId: '2', text: 'Привет! Видел твой последний пост — отличная мысль про продуктивность', createdAt: new Date(Date.now() - 3600000), read: true },
      { id: 'm2', senderId: '1', text: 'Спасибо! Проверял несколько месяцев на себе прежде чем написать', createdAt: new Date(Date.now() - 3500000), read: true },
      { id: 'm3', senderId: '2', text: 'Было бы интересно поговорить подробнее. Когда есть время?', createdAt: new Date(Date.now() - 1800000), read: false },
    ],
    unreadCount: 1,
  },
  {
    id: 'chat2',
    participants: [MOCK_USERS[0], MOCK_USERS[2]],
    messages: [
      { id: 'm4', senderId: '3', text: 'Поздравляю с 1000 подписчиков!', createdAt: new Date(Date.now() - 86400000), read: true },
      { id: 'm5', senderId: '1', text: 'Взаимно! Твой проект на GitHub — огонь 🔥', createdAt: new Date(Date.now() - 82000000), read: true },
    ],
    unreadCount: 0,
  },
];

export const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return 'только что';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} мин.`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч.`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} д.`;
  return date.toLocaleDateString('ru-RU');
};

export const formatNumber = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'М';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'К';
  return n.toString();
};
