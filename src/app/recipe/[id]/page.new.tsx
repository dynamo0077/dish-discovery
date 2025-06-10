"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById } from '@/utils/api';
import { FavoriteButton } from '@/components';
import { Recipe } from '@/types/recipe';

type Props = {
  params: { id: string };
};

export default function RecipePage({ params }: Props) {
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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
        <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="text-amber-600 hover:text-amber-700 font-medium">
          ← Back to home
        </Link>
      </div>
    );
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
    const measure = recipe[`strMeasure${i}` as keyof Recipe];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        name: ingredient,
        measure: measure || '',
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
          ← Back to recipes
        </Link>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-96">
            <Image
              src={recipe.strMealThumb || '/placeholder.jpg'}
              alt={recipe.strMeal}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute top-4 right-4">
              <FavoriteButton id={recipe.idMeal} />
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{recipe.strMeal}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                {recipe.strCategory}
              </span>
            </div>
            
            {recipe.strArea && (
              <p className="text-gray-600 mb-6">
                <span className="font-medium">Cuisine:</span> {recipe.strArea}
              </p>
            )}
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Ingredients</h2>
                <ul className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-2 mr-2"></span>
                      <span>
                        {ingredient.name}
                        {ingredient.measure && (
                          <span className="text-gray-500 ml-1">({ingredient.measure.trim()})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Instructions</h2>
                <div className="prose max-w-none">
                  {recipe.strInstructions?.split('\r\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            
            {recipe.strYoutube && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Video Tutorial</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`}
                    title={recipe.strMeal}
                    className="w-full h-96 rounded-lg"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
