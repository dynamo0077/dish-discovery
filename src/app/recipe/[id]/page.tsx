"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById } from '@/utils/api';
import { FavoriteButton } from '@/components';
import { Recipe } from '@/types/recipe';

type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function RecipePage({ params }: PageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(params.id);
        if (!data) {
          router.push('/404');
          return;
        }
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        router.push('/500');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
        <p className="text-gray-600 mb-6">The recipe you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="text-amber-600 hover:text-amber-700 font-medium">
          ← Back to home
        </Link>
      </div>
    );
  }

  // Extract ingredients and measures
  type IngredientItem = {
    ingredient: string;
    measure: string;
  };

  const ingredients: IngredientItem[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string | undefined;
    const measure = recipe[`strMeasure${i}` as keyof Recipe] as string | undefined;
    
    if (ingredient && typeof ingredient === 'string' && ingredient.trim() !== '') {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: (measure || '').trim(),
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6 transition-colors"
      >
        <svg 
          className="w-5 h-5 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Back to recipes
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={recipe.strMealThumb || '/placeholder-recipe.jpg'}
              alt={recipe.strMeal}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute top-4 right-4">
              <FavoriteButton id={recipe.idMeal} size="lg" />
            </div>
          </div>
        </div>

        {/* Recipe Info */}
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{recipe.strMeal}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.strCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    {recipe.strCategory}
                  </span>
                )}
                {recipe.strArea && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {recipe.strArea}
                  </span>
                )}
              </div>
            </div>
          </div>

          {recipe.strTags && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.strTags
                  .split(',')
                  .map(tag => (typeof tag === 'string' ? tag.trim() : ''))
                  .filter(Boolean)
                  .map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Ingredients</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ingredients.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-medium mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">
                    <span className="font-medium">{item.ingredient}</span>
                    {item.measure && ` - ${item.measure}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
        <div className="prose max-w-none">
          {recipe.strInstructions?.split('\r\n').filter(Boolean).map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {recipe.strYoutube && (
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Tutorial</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`}
              title={`${recipe.strMeal} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
