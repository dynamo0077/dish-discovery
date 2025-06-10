import axios from 'axios';
import { Recipe, RecipeListResponse, RecipeDetailResponse } from '@/types/recipe';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const isBeefRecipe = (recipe: Recipe): boolean => {
  if (!recipe) return false;
  
  const ingredients = [
    recipe.strIngredient1, recipe.strIngredient2, recipe.strIngredient3,
    recipe.strIngredient4, recipe.strIngredient5, recipe.strIngredient6,
    recipe.strIngredient7, recipe.strIngredient8, recipe.strIngredient9,
    recipe.strIngredient10, recipe.strIngredient11, recipe.strIngredient12,
    recipe.strIngredient13, recipe.strIngredient14, recipe.strIngredient15,
    recipe.strIngredient16, recipe.strIngredient17, recipe.strIngredient18,
    recipe.strIngredient19, recipe.strIngredient20
  ].filter(Boolean) as string[]; // Filter out null/undefined and assert as string[]
  
  const beefKeywords = [
    // Common beef terms
    'beef', 'steak', 'hamburger', 'meatball', 'meat loaf', 'meatloaf', 
    'ground beef', 'minced beef', 'roast beef', 'corned beef', 'beef stew',
    'beef broth', 'beef stock', 'beef jerky', 'beef patty', 'beef brisket',
    'beef ribs', 'beef shank', 'beef tenderloin', 'beef wellington',
    'beef bourguignon', 'beef stroganoff', 'beef bourguignon', 'beef tartare',
    'beef tongue', 'beef tripe', 'beef udon', 'beef wellington', 'beefy',
    // Cuts of beef
    'sirloin', 'ribeye', 't-bone', 'tenderloin', 'filet mignon', 'new york strip',
    'flank steak', 'skirt steak', 'hanger steak', 'chuck', 'round', 'shank',
    'short ribs', 'brisket', 'plate', 'short loin', 'sirloin tip', 'tri-tip',
    // Other terms
    'cow', 'cattle', 'veal', 'wagyu', 'kobe', 'angus', 'bovine', 'bull', 'ox',
    'hamburg', 'cheeseburg', 'philly cheesesteak', 'philly steak', 'philly cheese',
    'bulgogi', 'carpaccio', 'fajita', 'kebab', 'kabob', 'meatball', 'meatloaf',
    'pastrami', 'pepperoni', 'salisbury', 'sauerbraten', 'sukiyaki', 'taco',
    'tamale', 'teriyaki', 'wellington', 'yakiniku'
  ].map(term => term.toLowerCase());
  
  // Check recipe name and category
  const nameMatch = recipe.strMeal?.toLowerCase() || '';
  const categoryMatch = recipe.strCategory?.toLowerCase() || '';
  
  // Check if any beef keyword is found in name, category, or ingredients
  return beefKeywords.some(keyword => {
    // Check recipe name
    if (nameMatch.includes(keyword)) return true;
    
    // Check category
    if (categoryMatch.includes(keyword)) return true;
    
    // Check ingredients
    if (ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(keyword)
    )) return true;
    
    // Check recipe instructions if available
    const instructions = recipe.strInstructions?.toLowerCase() || '';
    if (instructions.includes(keyword)) return true;
    
    return false;
  });
};

export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  try {
    const response = await axios.get<RecipeListResponse>(
      `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );
    const meals = response.data.meals || [];
    return meals.filter(recipe => !isBeefRecipe(recipe));
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await axios.get<RecipeDetailResponse>(
      `${API_BASE_URL}/lookup.php?i=${id}`
    );
    return response.data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};

export const getRandomRecipes = async (count: number = 12): Promise<Recipe[]> => {
  try {
    // Fetch more than needed to account for filtered out beef recipes
    const fetchCount = Math.ceil(count * 1.5);
    const requests = Array(fetchCount).fill(null).map(() => 
      axios.get<RecipeDetailResponse>(`${API_BASE_URL}/random.php`)
    );
    
    const responses = await Promise.all(requests);
    const recipes = responses.map(response => response.data.meals?.[0]).filter(Boolean) as Recipe[];
    
    // Filter out beef recipes and limit to requested count
    return recipes.filter(recipe => !isBeefRecipe(recipe)).slice(0, count);
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
};

export const getCategories = async (): Promise<{strCategory: string}[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories.php`);
    const categories = response.data.categories || [];
    // Filter out the Beef category
    return categories.filter((category: {strCategory: string}) => 
      category.strCategory.toLowerCase() !== 'beef'
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getMealsByCategory = async (category: string): Promise<Recipe[]> => {
  try {
    // Skip if the category is beef
    if (category.toLowerCase() === 'beef') {
      return [];
    }
    
    const response = await axios.get<RecipeListResponse>(
      `${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
    );
    const meals = response.data.meals || [];
    
    // For non-beef categories, we still need to filter in case there are beef recipes
    if (category.toLowerCase() !== 'beef') {
      // Fetch full recipe details to check ingredients
      const detailedRecipes = await Promise.all(
        meals.map(meal => getRecipeById(meal.idMeal))
      );
      return detailedRecipes.filter((recipe): recipe is Recipe => 
        recipe !== null && !isBeefRecipe(recipe)
      );
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    return [];
  }
};
