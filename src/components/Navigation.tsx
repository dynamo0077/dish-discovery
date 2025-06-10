"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, MagnifyingGlassIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-amber-600">DishDiscovery</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link 
              href="/" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/') 
                  ? 'border-amber-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <HomeIcon className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link 
              href="/search" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/search')
                  ? 'border-amber-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
              Search
            </Link>
            <Link 
              href="/favorites" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              {pathname === '/favorites' ? (
                <HeartIconSolid className="h-5 w-5 mr-1" />
              ) : (
                <HeartIconOutline className="h-5 w-5 mr-1" />
              )}
              Favorites
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1 flex justify-around">
          <Link 
            href="/" 
            className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
              isActive('/') ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="mt-1">Home</span>
          </Link>
          <Link 
            href="/search" 
            className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
              isActive('/search') ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
            <span className="mt-1">Search</span>
          </Link>
          <Link 
            href="/favorites" 
            className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            {pathname === '/favorites' ? (
            <HeartIconSolid className="h-6 w-6" />
          ) : (
            <HeartIconOutline className="h-6 w-6" />
          )}
            <span className="mt-1">Favorites</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
