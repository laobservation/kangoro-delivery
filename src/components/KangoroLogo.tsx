import React from 'react';
import { KANGORO_LOGO_URL } from '../constants';

interface KangoroLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  onClick?: () => void;
}

export const KangoroLogo: React.FC<KangoroLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  onClick
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <img
        src={KANGORO_LOGO_URL}
        alt="KANGORO DELIVERY"
        referrerPolicy="no-referrer"
        className={`${heightClasses[size]} w-auto object-contain drop-shadow-xs transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );
};
