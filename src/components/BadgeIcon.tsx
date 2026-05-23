import React from 'react';
import { Badge, RARITY_CONFIG } from '@/data/badges';

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = { sm: 16, md: 22, lg: 32, xl: 52 };

const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, size = 'md', showTooltip = false, onClick }) => {
  const cfg = RARITY_CONFIG[badge.rarity];
  const px = SIZE_MAP[size];
  const id = `grad-${badge.id}-${size}`;

  const getStops = () => {
    if (badge.rarity === 'chromatic') return (
      <>
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="33%" stopColor="#60a5fa" />
        <stop offset="66%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#fbbf24" />
      </>
    );
    if (badge.rarity === 'cosmic') return (
      <>
        <stop offset="0%" stopColor="#312e81" />
        <stop offset="40%" stopColor="#6366f1" />
        <stop offset="70%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#f472b6" />
      </>
    );
    if (badge.rarity === 'mythic') return (
      <>
        <stop offset="0%" stopColor="#9d174d" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#a855f7" />
      </>
    );
    if (badge.rarity === 'legendary') return (
      <>
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#fbbf24" />
      </>
    );
    return (
      <>
        <stop offset="0%" stopColor={cfg.color} stopOpacity="1" />
        <stop offset="100%" stopColor={cfg.color} stopOpacity="0.75" />
      </>
    );
  };

  return (
    <div
      className={`inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-110 flex-shrink-0 ${cfg.glowClass || ''}`}
      onClick={onClick}
      title={showTooltip ? `${badge.name} — ${cfg.labelRu}: ${badge.description}` : undefined}
      style={{ width: px, height: px, position: 'relative' }}
    >
      {cfg.animated && (
        <div className="absolute inset-0 rounded-full" style={{
          background: cfg.gradient, opacity: 0.3,
          filter: `blur(${px / 3}px)`, transform: 'scale(1.2)',
        }} />
      )}
      <svg
        width={px} height={px} viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ filter: cfg.animated ? `drop-shadow(0 0 ${px / 5}px ${cfg.color}cc)` : 'none' }}
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            {getStops()}
          </linearGradient>
        </defs>
        {/* Shield verification shape */}
        <path
          d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11 4.5-.85 8-5.75 8-11V6l-8-4z"
          fill={`url(#${id})`}
        />
        {/* White checkmark */}
        <path
          d="M9 12l2 2 4-4"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default BadgeIcon;
