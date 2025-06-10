'use client';

import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useFavorites } from '@/store/favorites';

interface FavoriteButtonProps {
  id: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FavoriteButton({ id, size = 'md', className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(id);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} ${className} flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFav ? (
        <HeartIconSolid className="w-5/6 h-5/6 text-red-500" />
      ) : (
        <HeartIconOutline className="w-5/6 h-5/6 text-gray-700" />
      )}
    </button>
  );
}
