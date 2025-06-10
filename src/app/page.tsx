import Link from "next/link";
import { getRandomRecipes } from "@/utils/api";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";

export default async function Home() {
  const featuredRecipes = await getRandomRecipes(6);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-center mb-6">&quot;Discover Delicious Recipes&quot;</h1>
        <p className="text-xl text-center mb-8 max-w-2xl mx-auto">
          Find and save your favorite recipes. Search by name or browse by category.
        </p>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Cook with confidence using our easy-to-follow instructions.
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Recipes</h2>
          <Link 
            href="/search" 
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            View All →
          </Link>
        </div>
        
        {featuredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured recipes found. Please try again later.</p>
          </div>
        )}
      </section>

      {/* Categories Preview */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Beef', 'Chicken', 'Dessert', 'Pasta', 'Seafood', 'Vegetarian'].map((category) => (
            <Link 
              key={category} 
              href={`/search?category=${category.toLowerCase()}`}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="h-16 w-16 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍳</span>
              </div>
              <h3 className="font-medium text-gray-900">{category}</h3>
              <p className="text-sm text-gray-500 mt-1">View recipes</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Try our advanced search to find the perfect recipe based on ingredients, cuisine, or dietary restrictions.
        </p>
        <Link 
          href="/search" 
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Browse All Recipes
        </Link>
      </section>
    </div>
  );
}
