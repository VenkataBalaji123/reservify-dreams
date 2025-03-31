
import { ReactNode } from 'react';

interface SectionBannerProps {
  title: string;
  subtitle?: string;
  image: string;
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
  overlay?: boolean;
  height?: 'small' | 'medium' | 'large';
}

const SectionBanner = ({
  title,
  subtitle,
  image,
  children,
  align = 'center',
  overlay = true,
  height = 'medium',
}: SectionBannerProps) => {
  const heightClass = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-96',
  }[height];

  const alignClass = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end',
  }[align];

  return (
    <div className={`relative w-full ${heightClass} mb-8 rounded-xl overflow-hidden`}>
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-purple-900/50" />
      )}
      
      <div className={`relative flex flex-col ${alignClass} h-full px-8 py-6`}>
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{title}</h2>
          {subtitle && <p className="text-lg text-white/90 mb-4">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default SectionBanner;
