import React from 'react';

const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col animate-pulse">
      <div className="relative h-48 bg-gray-200"></div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex flex-wrap gap-2 mt-auto">
          <div className="h-6 bg-gray-200 rounded-full px-3 py-1 text-xs w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full px-3 py-1 text-xs w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
