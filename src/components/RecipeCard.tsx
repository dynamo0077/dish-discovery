'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import RecipeCardSkeleton from './RecipeCardSkeleton';
import { useFavorites } from '@/store/favorites';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

interface RecipeCardProps {
  recipe: Recipe | null;
  showFavorite?: boolean;
  className?: string;
}

export default function RecipeCard({ 
  recipe, 
  showFavorite = true,
  className = '' 
}: RecipeCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = recipe ? isFavorite(recipe.idMeal) : false;

  if (!recipe) {
    return <RecipeCardSkeleton />;
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.idMeal, recipe);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col group ${className}`}>
      <Link href={`/recipe/${recipe.idMeal}`} className="block flex-1">
        <div className="relative h-48 bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <Image
            src={imageError || !recipe.strMealThumb ? '/placeholder-recipe.jpg' : recipe.strMealThumb}
            alt={recipe.strMeal || 'Recipe image'}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoadingComplete={() => setImageLoading(false)}
            onError={() => setImageError(true)}
            priority={false}
          />
          {showFavorite && (
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={handleFavoriteClick}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:scale-110 transition-transform"
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFav ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIconOutline className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {recipe.strMeal || 'Untitled Recipe'}
          </h3>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            {recipe.strArea && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                {recipe.strArea}
              </span>
            )}
            {recipe.strCategory && (
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                {recipe.strCategory}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
