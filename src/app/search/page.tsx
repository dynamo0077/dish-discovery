'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import { searchRecipes, getMealsByCategory, getCategories } from '@/utils/api';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';

interface Category {
  strCategory: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const searchQuery = searchParams.get('q') || '';
  
  const categories = useMemo(() => [
    { idCategory: '2', strCategory: 'Chicken' },
    { idCategory: '3', strCategory: 'Dessert' },
    { idCategory: '4', strCategory: 'Lamb' },
    { idCategory: '5', strCategory: 'Miscellaneous' },
    { idCategory: '6', strCategory: 'Pasta' },
    { idCategory: '7', strCategory: 'Pork' },
    { idCategory: '8', strCategory: 'Seafood' },
    { idCategory: '9', strCategory: 'Side' },
    { idCategory: '10', strCategory: 'Starter' },
    { idCategory: '11', strCategory: 'Vegan' },
    { idCategory: '12', strCategory: 'Vegetarian' },
    { idCategory: '13', strCategory: 'Breakfast' },
    { idCategory: '14', strCategory: 'Goat' }
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let recipesData: Recipe[] = [];
        let categoriesData = await getCategories();
        
        if (searchQuery) {
          recipesData = await searchRecipes(searchQuery);
        } else if (selectedCategory) {
          recipesData = await getMealsByCategory(selectedCategory);
        } else if (categoriesData.length > 0) {
          // Show popular recipes or empty state
          recipesData = await getMealsByCategory(categoriesData[0].strCategory);
        }
        
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : selectedCategory 
              ? `${selectedCategory} Recipes` 
              : 'Browse Recipes'}
        </h1>
        
        <div className="mb-8">
          <SearchBar initialValue={searchQuery} />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/search" 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !selectedCategory 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.strCategory}
                href={`/search?category=${encodeURIComponent(cat.strCategory)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === cat.strCategory
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.strCategory}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">No recipes found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery 
              ? `We couldn't find any recipes matching "${searchQuery}". Try a different search term.`
              : selectedCategory
                ? `No ${selectedCategory} recipes found. Please check back later.`
                : 'Try searching for recipes or browse by category.'}
          </p>
        </div>
      )}
    </div>
  );
}
