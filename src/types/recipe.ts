export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strTags?: string;
  strYoutube?: string;
  ingredients?: { ingredient: string; measure: string }[];
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

export interface RecipeListResponse {
  meals: Recipe[] | null;
}

export interface RecipeDetailResponse {
  meals: Recipe[] | null;
}

export interface SearchParams {
  q?: string;
  category?: string;
  area?: string;
  [key: string]: string | string[] | undefined;
}
