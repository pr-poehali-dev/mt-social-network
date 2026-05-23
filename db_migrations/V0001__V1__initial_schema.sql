
CREATE SEQUENCE mt_user_seq START 1001;

CREATE TABLE users (
  id BIGINT PRIMARY KEY DEFAULT nextval('mt_user_seq'),
  mt_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL DEFAULT '',
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT DEFAULT '',
  location TEXT DEFAULT '',
  website TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  email TEXT DEFAULT '',
  mt_coins INTEGER DEFAULT 100,
  streak INTEGER DEFAULT 1,
  active_badge_id TEXT DEFAULT NULL,
  badges JSONB DEFAULT '[]',
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  is_online BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  join_date DATE DEFAULT CURRENT_DATE,
  daily_claimed_at DATE DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE follows (
  follower_id BIGINT REFERENCES users(id),
  following_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT REFERENCES users(id),
  content TEXT NOT NULL,
  image_url TEXT DEFAULT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  reposts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  user_id BIGINT REFERENCES users(id),
  post_id BIGINT REFERENCES posts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id),
  author_id BIGINT REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chats (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_participants (
  chat_id BIGINT REFERENCES chats(id),
  user_id BIGINT REFERENCES users(id),
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  chat_id BIGINT REFERENCES chats(id),
  sender_id BIGINT REFERENCES users(id),
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_messages_chat ON messages(chat_id, created_at ASC);
CREATE INDEX idx_chat_participants ON chat_participants(user_id);
CREATE INDEX idx_users_username ON users(username);
