import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import BadgeIcon from './BadgeIcon';
import { Badge, RARITY_CONFIG, Rarity, generateDailyShop, ALL_BADGES, BADGE_PRICES } from '@/data/badges';
import { User, formatNumber } from '@/data/mockData';

interface BadgeShopPageProps { currentUser: User; onBuy: (badge: Badge, price: number) => void; }

const BadgeShopPage: React.FC<BadgeShopPageProps> = ({ currentUser, onBuy }) => {
  const [shopBadges] = useState<Badge[]>(generateDailyShop());
  const [filterRarity, setFilterRarity] = useState<Rarity | 'all'>('all');
  const [selected, setSelected] = useState<Badge | null>(null);
  const [bought, setBought] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [coins, setCoins] = useState(currentUser.mtCoins);

  const handleBuy = (badge: Badge) => {
    const price = BADGE_PRICES[badge.rarity];
    if (coins < price) return;
    setCoins(c => c - price);
    setBought(b => new Set([...b, badge.id]));
    onBuy(badge, price);
    setSelected(null);
  };

  const rarities: (Rarity | 'all')[] = ['all', 'common', 'uncommon', 'epic', 'legendary', 'mythic', 'chromatic', 'cosmic'];
  const filtered = (showAll ? ALL_BADGES : shopBadges).filter(b => filterRarity === 'all' || b.rarity === filterRarity);
  const nextReset = (() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}ч ${m}м`;
  })();

  return (
    <div className="max-w-xl mx-auto px-3 py-4">
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-slide-up text-center" style={{ background: 'var(--mt-surface)' }}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4" style={{ color: 'var(--mt-text-2)' }}>
              <Icon name="X" size={18} />
            </button>
            <div className="flex justify-center mb-4">
              <BadgeIcon badge={selected} size="xl" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-1" style={{ color: 'var(--mt-text)' }}>{selected.name}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mb-2"
              style={{ background: RARITY_CONFIG[selected.rarity].color + '20', color: RARITY_CONFIG[selected.rarity].color }}>
              {RARITY_CONFIG[selected.rarity].labelRu}
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--mt-text-2)' }}>{selected.description}</p>
            <div className="flex items-center justify-center gap-2 mb-5 text-sm" style={{ color: 'var(--mt-text-2)' }}>
              <span>Шанс появления:</span>
              <span className="font-bold" style={{ color: 'var(--mt-text)' }}>{RARITY_CONFIG[selected.rarity].chance}%</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-5 text-lg font-bold font-heading" style={{ color: '#f59e0b' }}>
              <span>🪙</span> {formatNumber(BADGE_PRICES[selected.rarity])} MTCoins
            </div>
            {bought.has(selected.id) ? (
              <div className="py-3 rounded-xl text-center font-medium text-green-500" style={{ background: '#22c55e15' }}>
                <Icon name="CheckCircle" size={16} className="inline mr-2" /> Куплено
              </div>
            ) : (
              <button
                onClick={() => handleBuy(selected)}
                disabled={coins < BADGE_PRICES[selected.rarity]}
                className="w-full py-3 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: coins >= BADGE_PRICES[selected.rarity] ? 'var(--mt-blue)' : 'var(--mt-border)' }}>
                {coins < BADGE_PRICES[selected.rarity] ? 'Недостаточно монет' : 'Купить'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mt-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-heading font-bold" style={{ color: 'var(--mt-text)' }}>Магазин значков</h2>
            <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>Обновление через {nextReset}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--mt-surface-2)' }}>
            <span className="text-lg">🪙</span>
            <span className="font-bold font-heading" style={{ color: '#f59e0b' }}>{formatNumber(coins)}</span>
            <span className="text-xs" style={{ color: 'var(--mt-text-2)' }}>MTCoins</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--mt-surface-2)' }}>
          <Icon name="Info" size={14} style={{ color: 'var(--mt-text-2)' } as React.CSSProperties} />
          <p className="text-xs" style={{ color: 'var(--mt-text-2)' }}>Сегодня в магазине: <span className="font-medium" style={{ color: 'var(--mt-text)' }}>{shopBadges.length} значков</span></p>
        </div>
      </div>

      {/* Rarity chances */}
      <div className="mt-card p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--mt-text)' }}>Шансы выпадения</h3>
        <div className="space-y-2">
          {(Object.entries(RARITY_CONFIG) as [Rarity, typeof RARITY_CONFIG[Rarity]][]).map(([r, cfg]) => (
            <div key={r} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.labelRu}</span>
                <span className="text-xs" style={{ color: 'var(--mt-text-2)' }}>{cfg.chance}%</span>
              </div>
              <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--mt-border)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(cfg.chance * 1.5, 100)}%`, background: cfg.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {rarities.map(r => {
          const cfg = r !== 'all' ? RARITY_CONFIG[r] : null;
          return (
            <button key={r} onClick={() => setFilterRarity(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${filterRarity === r ? 'text-white' : ''}`}
              style={filterRarity === r
                ? { background: cfg?.color || 'var(--mt-blue)', color: 'white' }
                : { background: 'var(--mt-surface-2)', color: 'var(--mt-text-2)' }}>
              {r === 'all' ? 'Все' : cfg?.labelRu}
            </button>
          );
        })}
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--mt-text)' }}>
          {showAll ? `Все значки (${ALL_BADGES.length})` : `Сегодня в магазине (${shopBadges.length})`}
        </h3>
        <button onClick={() => setShowAll(!showAll)} className="text-xs font-medium" style={{ color: 'var(--mt-blue)' }}>
          {showAll ? 'Только сегодня' : 'Все значки'}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {filtered.map(badge => {
          const cfg = RARITY_CONFIG[badge.rarity];
          const isBought = bought.has(badge.id);
          return (
            <button key={badge.id} onClick={() => setSelected(badge)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all hover:scale-105 relative ${isBought ? 'opacity-60' : ''}`}
              style={{ background: 'var(--mt-surface)', border: `1.5px solid ${cfg.color}30` }}>
              <BadgeIcon badge={badge} size="md" showTooltip />
              <span className="text-xs text-center leading-tight font-medium truncate w-full" style={{ color: 'var(--mt-text)', fontSize: '10px' }}>{badge.name}</span>
              <span className="text-xs font-bold" style={{ color: '#f59e0b', fontSize: '10px' }}>🪙{formatNumber(BADGE_PRICES[badge.rarity])}</span>
              {isBought && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <Icon name="Check" size={16} className="text-green-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeShopPage;
