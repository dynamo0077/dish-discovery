'use client';

import { useFavorites } from '@/store/favorites';
import RecipeCard from '@/components/RecipeCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Favorite Recipes</h1>
        <p className="text-gray-600">
          {favorites.length > 0 
            ? `You have ${favorites.length} saved recipe${favorites.length !== 1 ? 's' : ''}`
            : 'Save your favorite recipes to see them here.'}
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} showFavorite={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-medium text-gray-900 mb-4">No favorites yet</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Browse recipes and click the heart icon to save your favorites here.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      )}
    </div>
  );
}
