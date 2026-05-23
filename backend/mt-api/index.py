"""
МТ Социальная сеть — главный API (auth, users, posts, chats, search)
Маршрутизация через ?action=... в querystring
"""
import json, os, hashlib, secrets, re, psycopg2
from datetime import date

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
    'Content-Type': 'application/json',
}

def db(): return psycopg2.connect(os.environ['DATABASE_URL'])
def ok(data, s=200): return {'statusCode': s, 'headers': CORS, 'body': json.dumps(data, default=str)}
def er(msg, s=400): return {'statusCode': s, 'headers': CORS, 'body': json.dumps({'error': msg})}
def h256(pw): return hashlib.sha256(pw.encode()).hexdigest()

def me(conn, token):
    if not token: return None
    cur = conn.cursor()
    cur.execute("SELECT u.* FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.token=%s AND s.expires_at>NOW()", (token,))
    r = cur.fetchone()
    if not r: return None
    return dict(zip([d[0] for d in cur.description], r))

def uf(u):
    if not u: return None
    return {
        'id': u['id'], 'mt_id': u['mt_id'],
        'first_name': u['first_name'], 'last_name': u['last_name'],
        'username': u['username'], 'bio': u['bio'],
        'location': u['location'], 'website': u['website'],
        'avatar': u['avatar'], 'email': u['email'],
        'mt_coins': u['mt_coins'], 'streak': u['streak'],
        'active_badge_id': u['active_badge_id'],
        'badges': u['badges'] if isinstance(u['badges'], list) else json.loads(u['badges'] or '[]'),
        'followers_count': u['followers_count'], 'following_count': u['following_count'],
        'posts_count': u['posts_count'], 'is_online': u['is_online'],
        'join_date': str(u['join_date']),
        'daily_claimed_at': str(u['daily_claimed_at']) if u['daily_claimed_at'] else None,
    }

def handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    body = {}
    if event.get('body'):
        try: body = json.loads(event['body'])
        except Exception: pass

    hdrs = event.get('headers') or {}
    token = hdrs.get('X-Session-Token') or hdrs.get('x-session-token') or ''
    qs = event.get('queryStringParameters') or {}
    action = qs.get('action', '')

    conn = db()
    try:
        # AUTH REGISTER
        if action == 'auth.register':
            fn = body.get('first_name', '').strip()
            ln = body.get('last_name', '').strip()
            pw = body.get('password', '')
            if not fn or not pw: return er('Имя и пароль обязательны')
            if len(pw) < 6: return er('Пароль минимум 6 символов')
            cur = conn.cursor()
            base = re.sub(r'[^a-zA-Z0-9]', '', (fn + ln).lower()) or 'user'
            uname, suf = base, 1
            while True:
                cur.execute("SELECT id FROM users WHERE username=%s", (uname,))
                if not cur.fetchone(): break
                uname = f"{base}{suf}"; suf += 1
            cur.execute("SELECT nextval('mt_user_seq')")
            nid = cur.fetchone()[0]
            mid = f"mt{nid}"
            av = f"https://api.dicebear.com/7.x/notionists/svg?seed={uname}&backgroundColor=b6e3f4"
            cur.execute(
                "INSERT INTO users (id,mt_id,first_name,last_name,username,password_hash,avatar) VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                (nid, mid, fn, ln, uname, h256(pw), av))
            uid = cur.fetchone()[0]
            tok = secrets.token_hex(32)
            cur.execute("INSERT INTO sessions(token,user_id) VALUES(%s,%s)", (tok, uid))
            conn.commit()
            cur.execute("SELECT * FROM users WHERE id=%s", (uid,))
            r = cur.fetchone(); u = dict(zip([d[0] for d in cur.description], r))
            return ok({'token': tok, 'user': uf(u)})

        # AUTH LOGIN
        if action == 'auth.login':
            ident = body.get('identifier', '').strip()
            pw = body.get('password', '')
            if not ident or not pw: return er('Заполните все поля')
            cur = conn.cursor()
            cur.execute(
                "SELECT * FROM users WHERE (username=%s OR mt_id=%s OR first_name=%s) AND password_hash=%s",
                (ident, ident, ident, h256(pw)))
            r = cur.fetchone()
            if not r: return er('Неверный логин или пароль', 401)
            u = dict(zip([d[0] for d in cur.description], r))
            tok = secrets.token_hex(32)
            cur.execute("INSERT INTO sessions(token,user_id) VALUES(%s,%s)", (tok, u['id']))
            cur.execute("UPDATE users SET is_online=true,last_login=NOW() WHERE id=%s", (u['id'],))
            conn.commit()
            return ok({'token': tok, 'user': uf(u)})

        # AUTH LOGOUT
        if action == 'auth.logout':
            if token:
                cur = conn.cursor()
                cur.execute("UPDATE sessions SET expires_at=NOW() WHERE token=%s", (token,))
                conn.commit()
            return ok({'ok': True})

        # AUTH ME
        if action == 'auth.me':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            return ok({'user': uf(u)})

        # DAILY REWARD
        if action == 'daily':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            today = date.today()
            if u['daily_claimed_at'] and str(u['daily_claimed_at']) == str(today):
                return er('Уже получено сегодня')
            cur = conn.cursor()
            cur.execute("UPDATE users SET mt_coins=mt_coins+50,daily_claimed_at=%s,streak=streak+1 WHERE id=%s", (today, u['id']))
            conn.commit()
            return ok({'coins': 50, 'ok': True})

        # SEARCH USERS
        if action == 'users.search':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            q = qs.get('q', '').strip()
            if not q: return ok({'users': []})
            cur = conn.cursor()
            p = f"%{q}%"
            cur.execute(
                "SELECT * FROM users WHERE (first_name ILIKE %s OR last_name ILIKE %s OR username ILIKE %s OR mt_id ILIKE %s) AND id!=%s LIMIT 20",
                (p, p, p, p, u['id']))
            rows = cur.fetchall(); cols = [d[0] for d in cur.description]
            return ok({'users': [uf(dict(zip(cols, r))) for r in rows]})

        # GET USER BY ID
        if action == 'users.get':
            uid = qs.get('uid', '')
            cur = conn.cursor()
            if uid.isdigit():
                cur.execute("SELECT * FROM users WHERE id=%s OR mt_id=%s", (int(uid), uid))
            else:
                cur.execute("SELECT * FROM users WHERE mt_id=%s OR username=%s", (uid, uid))
            r = cur.fetchone()
            if not r: return er('Не найден', 404)
            target = dict(zip([d[0] for d in cur.description], r))
            u = me(conn, token)
            is_f = False
            if u:
                cur.execute("SELECT 1 FROM follows WHERE follower_id=%s AND following_id=%s", (u['id'], target['id']))
                is_f = cur.fetchone() is not None
            res = uf(target); res['is_following'] = is_f
            return ok({'user': res})

        # FOLLOW / UNFOLLOW
        if action == 'users.follow':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            tid = body.get('user_id')
            if not tid: return er('Нет user_id')
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM follows WHERE follower_id=%s AND following_id=%s", (u['id'], tid))
            if cur.fetchone():
                cur.execute("DELETE FROM follows WHERE follower_id=%s AND following_id=%s", (u['id'], tid))
                cur.execute("UPDATE users SET followers_count=followers_count-1 WHERE id=%s", (tid,))
                cur.execute("UPDATE users SET following_count=following_count-1 WHERE id=%s", (u['id'],))
                conn.commit(); return ok({'following': False})
            else:
                cur.execute("INSERT INTO follows(follower_id,following_id) VALUES(%s,%s)", (u['id'], tid))
                cur.execute("UPDATE users SET followers_count=followers_count+1 WHERE id=%s", (tid,))
                cur.execute("UPDATE users SET following_count=following_count+1 WHERE id=%s", (u['id'],))
                conn.commit(); return ok({'following': True})

        # UPDATE PROFILE
        if action == 'users.update':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            cur = conn.cursor()
            allowed = ['bio','location','website','email','first_name','last_name','active_badge_id']
            upd = {f: body[f] for f in allowed if f in body}
            if not upd: return er('Нет данных')
            set_cl = ', '.join(f"{k}=%s" for k in upd)
            cur.execute(f"UPDATE users SET {set_cl} WHERE id=%s", (*upd.values(), u['id']))
            conn.commit()
            cur.execute("SELECT * FROM users WHERE id=%s", (u['id'],))
            r = cur.fetchone(); uu = dict(zip([d[0] for d in cur.description], r))
            return ok({'user': uf(uu)})

        # BUY BADGE
        if action == 'users.badge':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            badge = body.get('badge'); price = int(body.get('price', 0))
            if not badge: return er('Нет значка')
            if u['mt_coins'] < price: return er('Недостаточно MTCoins')
            cur = conn.cursor()
            existing = u['badges'] if isinstance(u['badges'], list) else json.loads(u['badges'] or '[]')
            if badge['id'] not in [b['id'] for b in existing]:
                existing.append(badge)
            cur.execute("UPDATE users SET badges=%s,mt_coins=mt_coins-%s WHERE id=%s",
                        (json.dumps(existing), price, u['id']))
            conn.commit()
            return ok({'ok': True, 'coins': u['mt_coins'] - price})

        # GET POSTS
        if action == 'posts.list':
            cur = conn.cursor()
            u = me(conn, token)
            limit = int(qs.get('limit', 20))
            offset = int(qs.get('offset', 0))
            author_id = qs.get('author_id')
            if author_id:
                cur.execute(
                    "SELECT p.*,u.first_name,u.last_name,u.username,u.mt_id,u.avatar,u.active_badge_id,u.badges FROM posts p JOIN users u ON p.author_id=u.id WHERE p.author_id=%s ORDER BY p.created_at DESC LIMIT %s OFFSET %s",
                    (author_id, limit, offset))
            else:
                cur.execute(
                    "SELECT p.*,u.first_name,u.last_name,u.username,u.mt_id,u.avatar,u.active_badge_id,u.badges FROM posts p JOIN users u ON p.author_id=u.id ORDER BY p.created_at DESC LIMIT %s OFFSET %s",
                    (limit, offset))
            rows = cur.fetchall(); cols = [d[0] for d in cur.description]
            liked = set()
            if u and rows:
                pids = [r[0] for r in rows]
                ph = ','.join(['%s']*len(pids))
                cur.execute(f"SELECT post_id FROM post_likes WHERE user_id=%s AND post_id IN ({ph})", (u['id'], *pids))
                liked = {r[0] for r in cur.fetchall()}
            posts = []
            for r in rows:
                d = dict(zip(cols, r))
                posts.append({'id': d['id'], 'content': d['content'], 'image_url': d['image_url'],
                    'likes_count': d['likes_count'], 'comments_count': d['comments_count'],
                    'reposts_count': d['reposts_count'], 'created_at': str(d['created_at']),
                    'liked': d['id'] in liked,
                    'author': {'id': d['author_id'], 'mt_id': d['mt_id'], 'first_name': d['first_name'],
                        'last_name': d['last_name'], 'username': d['username'], 'avatar': d['avatar'],
                        'active_badge_id': d['active_badge_id'],
                        'badges': d['badges'] if isinstance(d['badges'], list) else json.loads(d['badges'] or '[]')}})
            return ok({'posts': posts})

        # CREATE POST
        if action == 'posts.create':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            content = body.get('content', '').strip()
            if not content: return er('Пост пустой')
            if len(content) > 5000: return er('Слишком длинный')
            cur = conn.cursor()
            cur.execute("INSERT INTO posts(author_id,content) VALUES(%s,%s) RETURNING id,created_at", (u['id'], content))
            r = cur.fetchone()
            cur.execute("UPDATE users SET posts_count=posts_count+1 WHERE id=%s", (u['id'],))
            conn.commit()
            return ok({'post': {'id': r[0], 'created_at': str(r[1]), 'content': content,
                'likes_count': 0, 'comments_count': 0, 'reposts_count': 0, 'liked': False,
                'author': uf(u)}})

        # LIKE POST
        if action == 'posts.like':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            pid = body.get('post_id')
            if not pid: return er('Нет post_id')
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM post_likes WHERE user_id=%s AND post_id=%s", (u['id'], pid))
            if cur.fetchone():
                cur.execute("DELETE FROM post_likes WHERE user_id=%s AND post_id=%s", (u['id'], pid))
                cur.execute("UPDATE posts SET likes_count=likes_count-1 WHERE id=%s RETURNING likes_count", (pid,))
                c = cur.fetchone()[0]; conn.commit(); return ok({'liked': False, 'likes_count': c})
            else:
                cur.execute("INSERT INTO post_likes(user_id,post_id) VALUES(%s,%s)", (u['id'], pid))
                cur.execute("UPDATE posts SET likes_count=likes_count+1 WHERE id=%s RETURNING likes_count", (pid,))
                c = cur.fetchone()[0]; conn.commit(); return ok({'liked': True, 'likes_count': c})

        # GET COMMENTS
        if action == 'posts.comments':
            pid = qs.get('post_id')
            if not pid: return er('Нет post_id')
            cur = conn.cursor()
            cur.execute(
                "SELECT c.id,c.content,c.created_at,u.first_name,u.last_name,u.avatar,u.mt_id FROM comments c JOIN users u ON c.author_id=u.id WHERE c.post_id=%s ORDER BY c.created_at ASC",
                (pid,))
            rows = cur.fetchall()
            comments = [{'id': r[0], 'content': r[1], 'created_at': str(r[2]),
                'author': {'first_name': r[3], 'last_name': r[4], 'avatar': r[5], 'mt_id': r[6]}} for r in rows]
            return ok({'comments': comments})

        # ADD COMMENT
        if action == 'posts.comment':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            pid = body.get('post_id'); content = body.get('content', '').strip()
            if not pid or not content: return er('Нет данных')
            cur = conn.cursor()
            cur.execute("INSERT INTO comments(post_id,author_id,content) VALUES(%s,%s,%s) RETURNING id,created_at", (pid, u['id'], content))
            r = cur.fetchone()
            cur.execute("UPDATE posts SET comments_count=comments_count+1 WHERE id=%s", (pid,))
            conn.commit()
            return ok({'comment': {'id': r[0], 'created_at': str(r[1]), 'content': content, 'author': uf(u)}})

        # LIST CHATS
        if action == 'chats.list':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            cur = conn.cursor()
            cur.execute("""
                SELECT c.id,
                  ou.id,ou.first_name,ou.last_name,ou.avatar,ou.mt_id,ou.is_online,ou.active_badge_id,ou.badges,
                  (SELECT text FROM messages WHERE chat_id=c.id ORDER BY created_at DESC LIMIT 1),
                  (SELECT sender_id FROM messages WHERE chat_id=c.id ORDER BY created_at DESC LIMIT 1),
                  (SELECT created_at FROM messages WHERE chat_id=c.id ORDER BY created_at DESC LIMIT 1),
                  (SELECT COUNT(*) FROM messages WHERE chat_id=c.id AND is_read=false AND sender_id!=%s)
                FROM chats c
                JOIN chat_participants cp1 ON c.id=cp1.chat_id AND cp1.user_id=%s
                JOIN chat_participants cp2 ON c.id=cp2.chat_id AND cp2.user_id!=%s
                JOIN users ou ON ou.id=cp2.user_id
                ORDER BY (SELECT created_at FROM messages WHERE chat_id=c.id ORDER BY created_at DESC LIMIT 1) DESC NULLS LAST
            """, (u['id'], u['id'], u['id']))
            rows = cur.fetchall()
            chats = []
            for r in rows:
                chats.append({'id': r[0],
                    'other_user': {'id': r[1], 'first_name': r[2], 'last_name': r[3], 'avatar': r[4],
                        'mt_id': r[5], 'is_online': r[6], 'active_badge_id': r[7],
                        'badges': r[8] if isinstance(r[8], list) else json.loads(r[8] or '[]')},
                    'last_message': {'text': r[9], 'sender_id': r[10], 'created_at': str(r[11])} if r[9] else None,
                    'unread_count': int(r[12])})
            return ok({'chats': chats})

        # CREATE OR GET CHAT
        if action == 'chats.create':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            other_id = body.get('user_id')
            if not other_id: return er('Нет user_id')
            cur = conn.cursor()
            cur.execute("""
                SELECT c.id FROM chats c
                JOIN chat_participants cp1 ON c.id=cp1.chat_id AND cp1.user_id=%s
                JOIN chat_participants cp2 ON c.id=cp2.chat_id AND cp2.user_id=%s
            """, (u['id'], other_id))
            ex = cur.fetchone()
            if ex: return ok({'chat_id': ex[0]})
            cur.execute("INSERT INTO chats DEFAULT VALUES RETURNING id")
            cid = cur.fetchone()[0]
            cur.execute("INSERT INTO chat_participants(chat_id,user_id) VALUES(%s,%s),(%s,%s)",
                        (cid, u['id'], cid, other_id))
            conn.commit()
            return ok({'chat_id': cid})

        # GET MESSAGES
        if action == 'chats.messages':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            cid = qs.get('chat_id')
            if not cid: return er('Нет chat_id')
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM chat_participants WHERE chat_id=%s AND user_id=%s", (cid, u['id']))
            if not cur.fetchone(): return er('Нет доступа', 403)
            cur.execute("""
                SELECT m.id,m.sender_id,m.text,m.is_read,m.created_at,
                  u.first_name,u.last_name,u.avatar,u.mt_id
                FROM messages m JOIN users u ON m.sender_id=u.id
                WHERE m.chat_id=%s ORDER BY m.created_at ASC LIMIT 200
            """, (cid,))
            rows = cur.fetchall()
            cur.execute("UPDATE messages SET is_read=true WHERE chat_id=%s AND sender_id!=%s AND is_read=false", (cid, u['id']))
            conn.commit()
            msgs = [{'id': r[0], 'sender_id': r[1], 'text': r[2], 'is_read': r[3], 'created_at': str(r[4]),
                'sender': {'first_name': r[5], 'last_name': r[6], 'avatar': r[7], 'mt_id': r[8]}} for r in rows]
            return ok({'messages': msgs})

        # SEND MESSAGE
        if action == 'chats.send':
            u = me(conn, token)
            if not u: return er('Не авторизован', 401)
            cid = body.get('chat_id'); text = body.get('text', '').strip()
            if not cid or not text: return er('Нет данных')
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM chat_participants WHERE chat_id=%s AND user_id=%s", (cid, u['id']))
            if not cur.fetchone(): return er('Нет доступа', 403)
            cur.execute("INSERT INTO messages(chat_id,sender_id,text) VALUES(%s,%s,%s) RETURNING id,created_at", (cid, u['id'], text))
            r = cur.fetchone(); conn.commit()
            return ok({'message': {'id': r[0], 'sender_id': u['id'], 'text': text, 'is_read': False,
                'created_at': str(r[1]), 'sender': uf(u)}})

        return er('Не найдено', 404)

    finally:
        conn.close()
