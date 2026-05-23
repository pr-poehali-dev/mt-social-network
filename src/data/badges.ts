export type Rarity = 'common' | 'uncommon' | 'epic' | 'legendary' | 'mythic' | 'chromatic' | 'cosmic';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  description: string;
  color: string;
  gradient?: string;
}

export const RARITY_CONFIG: Record<Rarity, {
  label: string; labelRu: string; color: string; textColor: string;
  gradient: string; chance: number; animated: boolean; glowClass?: string;
}> = {
  common:     { label: 'Common',     labelRu: 'Обычная',      color: '#9ca3af', textColor: '#fff', gradient: 'linear-gradient(135deg,#6b7280,#9ca3af)', chance: 55,  animated: false },
  uncommon:   { label: 'Uncommon',   labelRu: 'Необычная',    color: '#22c55e', textColor: '#fff', gradient: 'linear-gradient(135deg,#16a34a,#22c55e)', chance: 25,  animated: false },
  epic:       { label: 'Epic',       labelRu: 'Эпическая',    color: '#a855f7', textColor: '#fff', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)', chance: 10,  animated: true, glowClass: 'badge-epic' },
  legendary:  { label: 'Legendary',  labelRu: 'Легендарная',  color: '#f59e0b', textColor: '#000', gradient: 'linear-gradient(135deg,#d97706,#fbbf24)', chance: 5,   animated: true, glowClass: 'badge-legendary' },
  mythic:     { label: 'Mythic',     labelRu: 'Мифическая',   color: '#ec4899', textColor: '#fff', gradient: 'linear-gradient(135deg,#9d174d,#ec4899,#a855f7)', chance: 2,   animated: true, glowClass: 'badge-mythic' },
  chromatic:  { label: 'Chromatic',  labelRu: 'Хроматическая',color: '#06b6d4', textColor: '#fff', gradient: 'linear-gradient(135deg,#0891b2,#f0abfc,#34d399)', chance: 1.9, animated: true, glowClass: 'badge-chroma' },
  cosmic:     { label: 'Cosmic',     labelRu: 'Космическая',  color: '#6366f1', textColor: '#fff', gradient: 'linear-gradient(135deg,#312e81,#6366f1,#c084fc,#f472b6)', chance: 0.1, animated: true, glowClass: 'badge-cosmic' },
};

export const ALL_BADGES: Badge[] = [
  // ===== COMMON (30) =====
  { id:'c1',  name:'Новичок',      emoji:'🔵', rarity:'common',    color:'#9ca3af', description:'Первые шаги в МТ' },
  { id:'c2',  name:'Читатель',     emoji:'📖', rarity:'common',    color:'#9ca3af', description:'Любитель чтения постов' },
  { id:'c3',  name:'Наблюдатель',  emoji:'👀', rarity:'common',    color:'#9ca3af', description:'Следит за новостями' },
  { id:'c4',  name:'Комментатор',  emoji:'💬', rarity:'common',    color:'#9ca3af', description:'Оставил первый комментарий' },
  { id:'c5',  name:'Подписчик',    emoji:'➕', rarity:'common',    color:'#9ca3af', description:'Подписался на кого-то' },
  { id:'c6',  name:'Лайкер',       emoji:'👍', rarity:'common',    color:'#9ca3af', description:'Поставил 10 лайков' },
  { id:'c7',  name:'Профиль',      emoji:'🪪', rarity:'common',    color:'#9ca3af', description:'Заполнил профиль' },
  { id:'c8',  name:'Гость',        emoji:'🚪', rarity:'common',    color:'#9ca3af', description:'Зашёл впервые' },
  { id:'c9',  name:'Дневной',      emoji:'☀️', rarity:'common',    color:'#9ca3af', description:'Зашёл 3 дня подряд' },
  { id:'c10', name:'Мессенджер',   emoji:'✉️', rarity:'common',    color:'#9ca3af', description:'Отправил первое сообщение' },
  { id:'c11', name:'Фото',         emoji:'📷', rarity:'common',    color:'#9ca3af', description:'Добавил фото профиля' },
  { id:'c12', name:'История',      emoji:'📽️', rarity:'common',    color:'#9ca3af', description:'Создал первую историю' },
  { id:'c13', name:'Путешественник',emoji:'🗺️',rarity:'common',    color:'#9ca3af', description:'Заполнил местоположение' },
  { id:'c14', name:'Именинник',    emoji:'🎂', rarity:'common',    color:'#9ca3af', description:'День рождения сегодня' },
  { id:'c15', name:'Ранняя Птица', emoji:'🐦', rarity:'common',    color:'#9ca3af', description:'Зарегистрировался первым' },
  { id:'c16', name:'Тихий',        emoji:'🤫', rarity:'common',    color:'#9ca3af', description:'Молчаливый участник' },
  { id:'c17', name:'Кликер',       emoji:'🖱️', rarity:'common',    color:'#9ca3af', description:'Активный пользователь' },
  { id:'c18', name:'Сохранитель',  emoji:'🔖', rarity:'common',    color:'#9ca3af', description:'Сохранил пост' },
  { id:'c19', name:'Репостер',     emoji:'🔄', rarity:'common',    color:'#9ca3af', description:'Сделал первый репост' },
  { id:'c20', name:'Emoji мастер', emoji:'😄', rarity:'common',    color:'#9ca3af', description:'Использовал 10 эмодзи' },
  { id:'c21', name:'Вечерний',     emoji:'🌙', rarity:'common',    color:'#9ca3af', description:'Активен ночью' },
  { id:'c22', name:'Утренний',     emoji:'🌅', rarity:'common',    color:'#9ca3af', description:'Заходит рано утром' },
  { id:'c23', name:'Меломан',      emoji:'🎵', rarity:'common',    color:'#9ca3af', description:'Любитель музыки' },
  { id:'c24', name:'Геймер',       emoji:'🎮', rarity:'common',    color:'#9ca3af', description:'Интересуется играми' },
  { id:'c25', name:'Спортсмен',    emoji:'⚽', rarity:'common',    color:'#9ca3af', description:'Спортивный дух' },
  { id:'c26', name:'Повар',        emoji:'🍳', rarity:'common',    color:'#9ca3af', description:'Делится рецептами' },
  { id:'c27', name:'Книголюб',     emoji:'📚', rarity:'common',    color:'#9ca3af', description:'Любитель книг' },
  { id:'c28', name:'Турист',       emoji:'✈️', rarity:'common',    color:'#9ca3af', description:'Путешественник' },
  { id:'c29', name:'Мастер',       emoji:'🔧', rarity:'common',    color:'#9ca3af', description:'Умелые руки' },
  { id:'c30', name:'Художник',     emoji:'🎨', rarity:'common',    color:'#9ca3af', description:'Творческая душа' },

  // ===== UNCOMMON (30) =====
  { id:'u1',  name:'Активист',     emoji:'⚡', rarity:'uncommon',  color:'#22c55e', description:'Активный участник' },
  { id:'u2',  name:'Оратор',       emoji:'🎤', rarity:'uncommon',  color:'#22c55e', description:'Любит высказываться' },
  { id:'u3',  name:'Советник',     emoji:'💡', rarity:'uncommon',  color:'#22c55e', description:'Даёт полезные советы' },
  { id:'u4',  name:'Блогер',       emoji:'✍️', rarity:'uncommon',  color:'#22c55e', description:'Пишет много постов' },
  { id:'u5',  name:'Социальный',   emoji:'🤝', rarity:'uncommon',  color:'#22c55e', description:'50+ друзей' },
  { id:'u6',  name:'Аналитик',     emoji:'📊', rarity:'uncommon',  color:'#22c55e', description:'Вдумчивый человек' },
  { id:'u7',  name:'Ветеран',      emoji:'🏅', rarity:'uncommon',  color:'#22c55e', description:'30 дней в МТ' },
  { id:'u8',  name:'Коллекционер', emoji:'🗂️', rarity:'uncommon',  color:'#22c55e', description:'Собирает значки' },
  { id:'u9',  name:'Фотограф',     emoji:'📸', rarity:'uncommon',  color:'#22c55e', description:'Публикует фото' },
  { id:'u10', name:'Трендсеттер',  emoji:'🔥', rarity:'uncommon',  color:'#22c55e', description:'Создаёт тренды' },
  { id:'u11', name:'Дипломат',     emoji:'🕊️', rarity:'uncommon',  color:'#22c55e', description:'Миротворец' },
  { id:'u12', name:'Мотиватор',    emoji:'💪', rarity:'uncommon',  color:'#22c55e', description:'Вдохновляет других' },
  { id:'u13', name:'Исследователь',emoji:'🔍', rarity:'uncommon',  color:'#22c55e', description:'Изучает всё' },
  { id:'u14', name:'Знаток',       emoji:'🧠', rarity:'uncommon',  color:'#22c55e', description:'Эрудит МТ' },
  { id:'u15', name:'Генератор',    emoji:'⚙️', rarity:'uncommon',  color:'#22c55e', description:'Много идей' },
  { id:'u16', name:'Стримовщик',   emoji:'📡', rarity:'uncommon',  color:'#22c55e', description:'Любитель трансляций' },
  { id:'u17', name:'Критик',       emoji:'🎭', rarity:'uncommon',  color:'#22c55e', description:'Конструктивная критика' },
  { id:'u18', name:'Командный',    emoji:'👥', rarity:'uncommon',  color:'#22c55e', description:'Работает в команде' },
  { id:'u19', name:'Энтузиаст',    emoji:'🌟', rarity:'uncommon',  color:'#22c55e', description:'Полон энергии' },
  { id:'u20', name:'Помощник',     emoji:'🆘', rarity:'uncommon',  color:'#22c55e', description:'Помогает новичкам' },
  { id:'u21', name:'Стратег',      emoji:'♟️', rarity:'uncommon',  color:'#22c55e', description:'Думает наперёд' },
  { id:'u22', name:'Новатор',      emoji:'🚀', rarity:'uncommon',  color:'#22c55e', description:'Первопроходец' },
  { id:'u23', name:'Спорщик',      emoji:'⚖️', rarity:'uncommon',  color:'#22c55e', description:'Любит дискуссии' },
  { id:'u24', name:'Куратор',      emoji:'🗃️', rarity:'uncommon',  color:'#22c55e', description:'Организует контент' },
  { id:'u25', name:'Летописец',    emoji:'📜', rarity:'uncommon',  color:'#22c55e', description:'Хранитель истории' },
  { id:'u26', name:'Марафонец',    emoji:'🏃', rarity:'uncommon',  color:'#22c55e', description:'60 дней подряд' },
  { id:'u27', name:'Технарь',      emoji:'💻', rarity:'uncommon',  color:'#22c55e', description:'Разбирается в технологиях' },
  { id:'u28', name:'Авантюрист',   emoji:'🗡️', rarity:'uncommon',  color:'#22c55e', description:'Любит риск' },
  { id:'u29', name:'Оптимист',     emoji:'🌈', rarity:'uncommon',  color:'#22c55e', description:'Всегда позитивен' },
  { id:'u30', name:'Защитник',     emoji:'🛡️', rarity:'uncommon',  color:'#22c55e', description:'Стоит за правду' },

  // ===== EPIC (30) =====
  { id:'e1',  name:'Легенда',      emoji:'🔮', rarity:'epic',      color:'#a855f7', description:'Известная личность' },
  { id:'e2',  name:'Маг',          emoji:'🧙', rarity:'epic',      color:'#a855f7', description:'Волшебник контента' },
  { id:'e3',  name:'Воин',         emoji:'⚔️', rarity:'epic',      color:'#a855f7', description:'Непобедимый дух' },
  { id:'e4',  name:'Феникс',       emoji:'🦅', rarity:'epic',      color:'#a855f7', description:'Возрождается снова' },
  { id:'e5',  name:'Титан',        emoji:'🗿', rarity:'epic',      color:'#a855f7', description:'Непоколебимый' },
  { id:'e6',  name:'Дракон',       emoji:'🐉', rarity:'epic',      color:'#a855f7', description:'Могучий и мудрый' },
  { id:'e7',  name:'Волшебник',    emoji:'🪄', rarity:'epic',      color:'#a855f7', description:'Творит чудеса' },
  { id:'e8',  name:'Пророк',       emoji:'🔭', rarity:'epic',      color:'#a855f7', description:'Видит будущее' },
  { id:'e9',  name:'Капитан',      emoji:'⚓', rarity:'epic',      color:'#a855f7', description:'Ведёт за собой' },
  { id:'e10', name:'Генерал',      emoji:'🎖️', rarity:'epic',      color:'#a855f7', description:'Командир МТ' },
  { id:'e11', name:'Алхимик',      emoji:'⚗️', rarity:'epic',      color:'#a855f7', description:'Превращает в золото' },
  { id:'e12', name:'Хранитель',    emoji:'🏛️', rarity:'epic',      color:'#a855f7', description:'Страж традиций' },
  { id:'e13', name:'Искатель',     emoji:'🧭', rarity:'epic',      color:'#a855f7', description:'Ищет смысл' },
  { id:'e14', name:'Виртуоз',      emoji:'🎻', rarity:'epic',      color:'#a855f7', description:'Мастер своего дела' },
  { id:'e15', name:'Пионер',       emoji:'🚩', rarity:'epic',      color:'#a855f7', description:'Открывает новые пути' },
  { id:'e16', name:'Архитектор',   emoji:'🏗️', rarity:'epic',      color:'#a855f7', description:'Строит будущее' },
  { id:'e17', name:'Охотник',      emoji:'🏹', rarity:'epic',      color:'#a855f7', description:'Достигает цели' },
  { id:'e18', name:'Герой',        emoji:'🦸', rarity:'epic',      color:'#a855f7', description:'Настоящий герой' },
  { id:'e19', name:'Оракул',       emoji:'🔮', rarity:'epic',      color:'#a855f7', description:'Мудрый провидец' },
  { id:'e20', name:'Рыцарь',       emoji:'🤺', rarity:'epic',      color:'#a855f7', description:'Благородный воин' },
  { id:'e21', name:'Зодиак',       emoji:'♈', rarity:'epic',      color:'#a855f7', description:'Под счастливой звездой' },
  { id:'e22', name:'Квант',        emoji:'⚛️', rarity:'epic',      color:'#a855f7', description:'Суперпозиция' },
  { id:'e23', name:'Нейрон',       emoji:'🧬', rarity:'epic',      color:'#a855f7', description:'Умный и быстрый' },
  { id:'e24', name:'Сфинкс',       emoji:'🦁', rarity:'epic',      color:'#a855f7', description:'Загадочный' },
  { id:'e25', name:'Призрак',      emoji:'👻', rarity:'epic',      color:'#a855f7', description:'Незаметный, но везде' },
  { id:'e26', name:'Электрон',     emoji:'⚡', rarity:'epic',      color:'#a855f7', description:'Скорость мысли' },
  { id:'e27', name:'Кристалл',     emoji:'💎', rarity:'epic',      color:'#a855f7', description:'Чистый разум' },
  { id:'e28', name:'Инферно',      emoji:'🌋', rarity:'epic',      color:'#a855f7', description:'Огненный дух' },
  { id:'e29', name:'Немезида',     emoji:'⚖️', rarity:'epic',      color:'#a855f7', description:'Справедливость' },
  { id:'e30', name:'Протос',       emoji:'🌀', rarity:'epic',      color:'#a855f7', description:'Первоначало' },

  // ===== LEGENDARY (30) =====
  { id:'l1',  name:'Солнце',       emoji:'☀️', rarity:'legendary', color:'#f59e0b', description:'Яркий как солнце' },
  { id:'l2',  name:'Корона',       emoji:'👑', rarity:'legendary', color:'#f59e0b', description:'Достоин короны' },
  { id:'l3',  name:'Трон',         emoji:'🏆', rarity:'legendary', color:'#f59e0b', description:'Властелин МТ' },
  { id:'l4',  name:'Золото',       emoji:'🥇', rarity:'legendary', color:'#f59e0b', description:'Первый среди равных' },
  { id:'l5',  name:'Звезда',       emoji:'⭐', rarity:'legendary', color:'#f59e0b', description:'Настоящая звезда' },
  { id:'l6',  name:'Буря',         emoji:'⛈️', rarity:'legendary', color:'#f59e0b', description:'Стихийная сила' },
  { id:'l7',  name:'Молния',       emoji:'🌩️', rarity:'legendary', color:'#f59e0b', description:'Ударяет внезапно' },
  { id:'l8',  name:'Огонь',        emoji:'🔥', rarity:'legendary', color:'#f59e0b', description:'Жаркий дух' },
  { id:'l9',  name:'Алмаз',        emoji:'💠', rarity:'legendary', color:'#f59e0b', description:'Твёрдость духа' },
  { id:'l10', name:'Сокол',        emoji:'🦅', rarity:'legendary', color:'#f59e0b', description:'Зоркий взгляд' },
  { id:'l11', name:'Лев',          emoji:'🦁', rarity:'legendary', color:'#f59e0b', description:'Царь зверей' },
  { id:'l12', name:'Тигр',         emoji:'🐯', rarity:'legendary', color:'#f59e0b', description:'Свирепый и сильный' },
  { id:'l13', name:'Пантера',      emoji:'🐆', rarity:'legendary', color:'#f59e0b', description:'Элегантный хищник' },
  { id:'l14', name:'Акула',        emoji:'🦈', rarity:'legendary', color:'#f59e0b', description:'Острый как акула' },
  { id:'l15', name:'Стихия',       emoji:'🌊', rarity:'legendary', color:'#f59e0b', description:'Сила природы' },
  { id:'l16', name:'Циклон',       emoji:'🌪️', rarity:'legendary', color:'#f59e0b', description:'Неостановимый вихрь' },
  { id:'l17', name:'Кратер',       emoji:'🌑', rarity:'legendary', color:'#f59e0b', description:'Оставляет след' },
  { id:'l18', name:'Метеор',       emoji:'☄️', rarity:'legendary', color:'#f59e0b', description:'Падает с небес' },
  { id:'l19', name:'Атлас',        emoji:'🌍', rarity:'legendary', color:'#f59e0b', description:'Держит мир' },
  { id:'l20', name:'Небеса',       emoji:'🌤️', rarity:'legendary', color:'#f59e0b', description:'Высшее существо' },
  { id:'l21', name:'Феромон',      emoji:'🌸', rarity:'legendary', color:'#f59e0b', description:'Притягивает всех' },
  { id:'l22', name:'Гроза',        emoji:'⛩️', rarity:'legendary', color:'#f59e0b', description:'Священная сила' },
  { id:'l23', name:'Ройал',        emoji:'🫅', rarity:'legendary', color:'#f59e0b', description:'Королевская кровь' },
  { id:'l24', name:'Империя',      emoji:'🏰', rarity:'legendary', color:'#f59e0b', description:'Строитель империй' },
  { id:'l25', name:'Вечный',       emoji:'♾️', rarity:'legendary', color:'#f59e0b', description:'Бесконечный дух' },
  { id:'l26', name:'Мечта',        emoji:'💫', rarity:'legendary', color:'#f59e0b', description:'Живёт мечтой' },
  { id:'l27', name:'Страж',        emoji:'🗽', rarity:'legendary', color:'#f59e0b', description:'Хранитель свободы' },
  { id:'l28', name:'Кузнец',       emoji:'⚒️', rarity:'legendary', color:'#f59e0b', description:'Кует судьбу' },
  { id:'l29', name:'Восход',       emoji:'🌄', rarity:'legendary', color:'#f59e0b', description:'Символ начала' },
  { id:'l30', name:'Коллайдер',    emoji:'💥', rarity:'legendary', color:'#f59e0b', description:'Сталкивает миры' },

  // ===== MYTHIC (30) =====
  { id:'m1',  name:'Единорог',     emoji:'🦄', rarity:'mythic',    color:'#ec4899', description:'Редчайшее существо' },
  { id:'m2',  name:'Кракен',       emoji:'🐙', rarity:'mythic',    color:'#ec4899', description:'Ужас глубин' },
  { id:'m3',  name:'Сирена',       emoji:'🧜', rarity:'mythic',    color:'#ec4899', description:'Зов морей' },
  { id:'m4',  name:'Гарпия',       emoji:'🦋', rarity:'mythic',    color:'#ec4899', description:'Крылатый дух' },
  { id:'m5',  name:'Левиафан',     emoji:'🐋', rarity:'mythic',    color:'#ec4899', description:'Монстр глубин' },
  { id:'m6',  name:'Голем',        emoji:'🗿', rarity:'mythic',    color:'#ec4899', description:'Созданный из камня' },
  { id:'m7',  name:'Химера',       emoji:'🔱', rarity:'mythic',    color:'#ec4899', description:'Трёхголовый ужас' },
  { id:'m8',  name:'Вампир',       emoji:'🧛', rarity:'mythic',    color:'#ec4899', description:'Ночной охотник' },
  { id:'m9',  name:'Банши',        emoji:'👁️', rarity:'mythic',    color:'#ec4899', description:'Предвестник' },
  { id:'m10', name:'Церберус',     emoji:'🐕', rarity:'mythic',    color:'#ec4899', description:'Страж подземного мира' },
  { id:'m11', name:'Медуза',       emoji:'🐍', rarity:'mythic',    color:'#ec4899', description:'Взгляд в камень' },
  { id:'m12', name:'Минотавр',     emoji:'🐂', rarity:'mythic',    color:'#ec4899', description:'Лабиринтный дух' },
  { id:'m13', name:'Посейдон',     emoji:'🌊', rarity:'mythic',    color:'#ec4899', description:'Владыка морей' },
  { id:'m14', name:'Зевс',         emoji:'⚡', rarity:'mythic',    color:'#ec4899', description:'Громовержец' },
  { id:'m15', name:'Аид',          emoji:'💀', rarity:'mythic',    color:'#ec4899', description:'Владыка теней' },
  { id:'m16', name:'Арес',         emoji:'🗡️', rarity:'mythic',    color:'#ec4899', description:'Бог войны' },
  { id:'m17', name:'Афина',        emoji:'🦉', rarity:'mythic',    color:'#ec4899', description:'Богиня мудрости' },
  { id:'m18', name:'Аполлон',      emoji:'🎸', rarity:'mythic',    color:'#ec4899', description:'Бог музыки' },
  { id:'m19', name:'Артемида',     emoji:'🌙', rarity:'mythic',    color:'#ec4899', description:'Богиня охоты' },
  { id:'m20', name:'Гермес',       emoji:'🪽', rarity:'mythic',    color:'#ec4899', description:'Вестник богов' },
  { id:'m21', name:'Прометей',     emoji:'🕯️', rarity:'mythic',    color:'#ec4899', description:'Похититель огня' },
  { id:'m22', name:'Геракл',       emoji:'💪', rarity:'mythic',    color:'#ec4899', description:'Двенадцать подвигов' },
  { id:'m23', name:'Ахиллес',      emoji:'⚔️', rarity:'mythic',    color:'#ec4899', description:'Непобедимый герой' },
  { id:'m24', name:'Одиссей',      emoji:'⛵', rarity:'mythic',    color:'#ec4899', description:'Хитрейший из героев' },
  { id:'m25', name:'Орфей',        emoji:'🎵', rarity:'mythic',    color:'#ec4899', description:'Покоряет музыкой' },
  { id:'m26', name:'Икар',         emoji:'🌞', rarity:'mythic',    color:'#ec4899', description:'Летит к солнцу' },
  { id:'m27', name:'Тесей',        emoji:'🧵', rarity:'mythic',    color:'#ec4899', description:'Победитель лабиринта' },
  { id:'m28', name:'Персей',       emoji:'🗡️', rarity:'mythic',    color:'#ec4899', description:'Убийца горгоны' },
  { id:'m29', name:'Пандора',      emoji:'📦', rarity:'mythic',    color:'#ec4899', description:'Открыла ящик' },
  { id:'m30', name:'Гефест',       emoji:'🔨', rarity:'mythic',    color:'#ec4899', description:'Бог-кузнец' },

  // ===== CHROMATIC (30) =====
  { id:'ch1',  name:'Призма',      emoji:'🌈', rarity:'chromatic', color:'#06b6d4', description:'Все цвета радуги' },
  { id:'ch2',  name:'Аврора',      emoji:'🌌', rarity:'chromatic', color:'#06b6d4', description:'Северное сияние' },
  { id:'ch3',  name:'Спектр',      emoji:'💠', rarity:'chromatic', color:'#06b6d4', description:'Весь спектр' },
  { id:'ch4',  name:'Калейдоскоп', emoji:'🔵', rarity:'chromatic', color:'#06b6d4', description:'Бесконечные узоры' },
  { id:'ch5',  name:'Хамелеон',    emoji:'🦎', rarity:'chromatic', color:'#06b6d4', description:'Меняет цвет' },
  { id:'ch6',  name:'Опал',        emoji:'🪩', rarity:'chromatic', color:'#06b6d4', description:'Радужный камень' },
  { id:'ch7',  name:'Перламутр',   emoji:'🐚', rarity:'chromatic', color:'#06b6d4', description:'Морское свечение' },
  { id:'ch8',  name:'Голограмма',  emoji:'📀', rarity:'chromatic', color:'#06b6d4', description:'Трёхмерный образ' },
  { id:'ch9',  name:'Интерференция',emoji:'✨', rarity:'chromatic', color:'#06b6d4', description:'Световые волны' },
  { id:'ch10', name:'Дифракция',   emoji:'🔆', rarity:'chromatic', color:'#06b6d4', description:'Разложение света' },
  { id:'ch11', name:'Радуга',      emoji:'🌈', rarity:'chromatic', color:'#06b6d4', description:'После бури' },
  { id:'ch12', name:'Нимб',        emoji:'😇', rarity:'chromatic', color:'#06b6d4', description:'Хроматический ореол' },
  { id:'ch13', name:'Иридий',      emoji:'⭕', rarity:'chromatic', color:'#06b6d4', description:'Редчайший металл' },
  { id:'ch14', name:'Хрусталь',    emoji:'🔮', rarity:'chromatic', color:'#06b6d4', description:'Кристальная чистота' },
  { id:'ch15', name:'Флюорит',     emoji:'🟣', rarity:'chromatic', color:'#06b6d4', description:'Светящийся минерал' },
  { id:'ch16', name:'Галактика',   emoji:'🌠', rarity:'chromatic', color:'#06b6d4', description:'Звёздный водоворот' },
  { id:'ch17', name:'Туманность',  emoji:'☁️', rarity:'chromatic', color:'#06b6d4', description:'Космический туман' },
  { id:'ch18', name:'Пульсар',     emoji:'💫', rarity:'chromatic', color:'#06b6d4', description:'Ритмичный пульс' },
  { id:'ch19', name:'Квазар',      emoji:'⭐', rarity:'chromatic', color:'#06b6d4', description:'Яркий объект' },
  { id:'ch20', name:'Нептун',      emoji:'🔵', rarity:'chromatic', color:'#06b6d4', description:'Ледяная планета' },
  { id:'ch21', name:'Уран',        emoji:'🌀', rarity:'chromatic', color:'#06b6d4', description:'Голубая планета' },
  { id:'ch22', name:'Диффузия',    emoji:'🌫️', rarity:'chromatic', color:'#06b6d4', description:'Рассеянный свет' },
  { id:'ch23', name:'Люминесценция',emoji:'🪩',rarity:'chromatic', color:'#06b6d4', description:'Холодный свет' },
  { id:'ch24', name:'Биолюмин.',   emoji:'🐠', rarity:'chromatic', color:'#06b6d4', description:'Живой свет' },
  { id:'ch25', name:'Плазма',      emoji:'⚡', rarity:'chromatic', color:'#06b6d4', description:'Четвёртое состояние' },
  { id:'ch26', name:'Фотон',       emoji:'🌟', rarity:'chromatic', color:'#06b6d4', description:'Частица света' },
  { id:'ch27', name:'Лазер',       emoji:'📡', rarity:'chromatic', color:'#06b6d4', description:'Точный луч' },
  { id:'ch28', name:'Нанолюкс',    emoji:'🔬', rarity:'chromatic', color:'#06b6d4', description:'Нано-свет' },
  { id:'ch29', name:'Суперновая',  emoji:'💥', rarity:'chromatic', color:'#06b6d4', description:'Взрыв звезды' },
  { id:'ch30', name:'Хромосфера',  emoji:'☀️', rarity:'chromatic', color:'#06b6d4', description:'Оболочка солнца' },

  // ===== COSMIC (30) =====
  { id:'co1',  name:'Большой Взрыв',emoji:'💥', rarity:'cosmic',  color:'#6366f1', description:'Начало всего' },
  { id:'co2',  name:'Сингулярность',emoji:'🕳️', rarity:'cosmic',  color:'#6366f1', description:'Точка бесконечности' },
  { id:'co3',  name:'Омега',        emoji:'♾️', rarity:'cosmic',  color:'#6366f1', description:'Конец всего' },
  { id:'co4',  name:'Альфа',        emoji:'🌌', rarity:'cosmic',  color:'#6366f1', description:'Начало всего' },
  { id:'co5',  name:'Мультивёрс',   emoji:'🔮', rarity:'cosmic',  color:'#6366f1', description:'Множество вселенных' },
  { id:'co6',  name:'Энтропия',     emoji:'🌀', rarity:'cosmic',  color:'#6366f1', description:'Беспорядок вселенной' },
  { id:'co7',  name:'Тёмная Материя',emoji:'🌑',rarity:'cosmic',  color:'#6366f1', description:'Невидимая масса' },
  { id:'co8',  name:'Тёмная Энергия',emoji:'⚫',rarity:'cosmic',  color:'#6366f1', description:'Тёмная сила' },
  { id:'co9',  name:'Квантовая Пена',emoji:'🫧',rarity:'cosmic',  color:'#6366f1', description:'Основа пространства' },
  { id:'co10', name:'Суперструна',   emoji:'🎻', rarity:'cosmic',  color:'#6366f1', description:'Теория всего' },
  { id:'co11', name:'Бог частиц',    emoji:'⚛️', rarity:'cosmic',  color:'#6366f1', description:'Бозон Хиггса' },
  { id:'co12', name:'Абсолют',       emoji:'🌟', rarity:'cosmic',  color:'#6366f1', description:'Высшее состояние' },
  { id:'co13', name:'Трансцендент',  emoji:'🛸', rarity:'cosmic',  color:'#6366f1', description:'За пределами' },
  { id:'co14', name:'Нирвана',       emoji:'🪷', rarity:'cosmic',  color:'#6366f1', description:'Высшее просветление' },
  { id:'co15', name:'Вечность',      emoji:'🌠', rarity:'cosmic',  color:'#6366f1', description:'Вне времени' },
  { id:'co16', name:'Бесконечность', emoji:'∞',  rarity:'cosmic',  color:'#6366f1', description:'Безграничен' },
  { id:'co17', name:'Создатель',     emoji:'🌈', rarity:'cosmic',  color:'#6366f1', description:'Творец миров' },
  { id:'co18', name:'Пространство',  emoji:'🚀', rarity:'cosmic',  color:'#6366f1', description:'Владелец космоса' },
  { id:'co19', name:'Время',         emoji:'⏳', rarity:'cosmic',  color:'#6366f1', description:'Хозяин времени' },
  { id:'co20', name:'Реальность',    emoji:'🔯', rarity:'cosmic',  color:'#6366f1', description:'Создаёт реальность' },
  { id:'co21', name:'Измерение',     emoji:'📐', rarity:'cosmic',  color:'#6366f1', description:'Многомерный разум' },
  { id:'co22', name:'Нексус',        emoji:'🌐', rarity:'cosmic',  color:'#6366f1', description:'Точка пересечения' },
  { id:'co23', name:'Аномалия',      emoji:'❓', rarity:'cosmic',  color:'#6366f1', description:'Необъяснимый' },
  { id:'co24', name:'Парадокс',      emoji:'🔄', rarity:'cosmic',  color:'#6366f1', description:'Противоречие бытия' },
  { id:'co25', name:'Хаос',          emoji:'🌪️', rarity:'cosmic',  color:'#6366f1', description:'Первобытный хаос' },
  { id:'co26', name:'Порядок',       emoji:'⚙️', rarity:'cosmic',  color:'#6366f1', description:'Космический порядок' },
  { id:'co27', name:'Судьба',        emoji:'🎯', rarity:'cosmic',  color:'#6366f1', description:'Предначертан' },
  { id:'co28', name:'Рок',           emoji:'⚡', rarity:'cosmic',  color:'#6366f1', description:'Неизбежность' },
  { id:'co29', name:'МТ Избранный',  emoji:'👁️', rarity:'cosmic',  color:'#6366f1', description:'Один на миллион' },
  { id:'co30', name:'Архонт',        emoji:'🌌', rarity:'cosmic',  color:'#6366f1', description:'Верховный правитель' },
];

export function generateDailyShop(): Badge[] {
  const today = new Date().toDateString();
  let seed = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return Math.abs(seed) / 0xffffffff; };

  const result: Badge[] = [];
  const used = new Set<string>();

  const rarityOrder: Rarity[] = ['common','uncommon','epic','legendary','mythic','chromatic','cosmic'];
  const chances = [55, 25, 10, 5, 2, 1.9, 0.1];

  const pick = (r: number): Rarity => {
    let sum = 0;
    for (let i = 0; i < chances.length; i++) {
      sum += chances[i];
      if (r * 100 <= sum) return rarityOrder[i];
    }
    return 'common';
  };

  while (result.length < 10) {
    const rarity = pick(rng());
    const pool = ALL_BADGES.filter(b => b.rarity === rarity && !used.has(b.id));
    if (pool.length === 0) continue;
    const badge = pool[Math.floor(rng() * pool.length)];
    used.add(badge.id);
    result.push(badge);
  }
  return result;
}

export const BADGE_PRICES: Record<Rarity, number> = {
  common: 50, uncommon: 150, epic: 500, legendary: 1500, mythic: 5000, chromatic: 15000, cosmic: 99999,
};
