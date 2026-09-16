import React from 'react';

interface BadgeProps {
  label: string;
  color?: string;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = 'bg-gray-100 text-gray-700 border-gray-200',
  onClick,
  onRemove,
  className = '',
}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      } ${color} ${className}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-red-600 focus:outline-none"
        >
          &times;
        </button>
      )}
    </span>
  );
};
