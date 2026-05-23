import React from 'react';
import { Badge, RARITY_CONFIG } from '@/data/badges';

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = { sm: 22, md: 32, lg: 44, xl: 64 };
const FONT_MAP = { sm: '11px', md: '16px', lg: '22px', xl: '32px' };

const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, size = 'md', showTooltip = false, onClick }) => {
  const cfg = RARITY_CONFIG[badge.rarity];
  const px = SIZE_MAP[size];
  const fs = FONT_MAP[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-110 ${cfg.glowClass || ''}`}
      style={{ width: px, height: px }}
      onClick={onClick}
      title={showTooltip ? `${badge.name} — ${cfg.labelRu}` : undefined}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: cfg.gradient, opacity: 0.18 }}
      />
      <div
        className="relative flex items-center justify-center rounded-full border-2"
        style={{
          width: px - 2,
          height: px - 2,
          borderColor: cfg.color,
          background: cfg.gradient,
          fontSize: fs,
          lineHeight: 1,
        }}
      >
        <span style={{ fontSize: fs, lineHeight: 1 }}>{badge.emoji}</span>
      </div>
      {cfg.animated && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 ${px / 3}px ${cfg.color}88`,
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
};

export default BadgeIcon;
