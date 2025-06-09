import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, Menu, X, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { usePremiumContext } from '@/contexts/PremiumContext';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuthContext();
  const { isPremium } = usePremiumContext();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-400 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">NexMeet</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className={`text-gray-700 hover:text-pink-500 transition-colors ${isActive('/') ? 'text-pink-500 font-medium' : ''}`}>
                Home
              </a>
            </Link>
            <Link href="/features">
              <a className={`text-gray-700 hover:text-pink-500 transition-colors ${isActive('/features') ? 'text-pink-500 font-medium' : ''}`}>
                Features
              </a>
            </Link>
            <Link href="/premium">
              <a className={`text-gray-700 hover:text-pink-500 transition-colors ${isActive('/premium') ? 'text-pink-500 font-medium' : ''}`}>
                Premium
              </a>
            </Link>
            {user && (
              <Link href="/app">
                <a className={`text-gray-700 hover:text-pink-500 transition-colors ${isActive('/app') ? 'text-pink-500 font-medium' : ''}`}>
                  App
                </a>
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Premium Badge */}
                {isPremium() && (
                  <div className="hidden sm:flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    <Crown className="w-4 h-4" />
                    <span>Premium</span>
                  </div>
                )}
                
                {/* Profile Menu */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                        <span className="text-pink-600 font-medium text-sm">
                          {user.firstName?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="hidden sm:inline-flex"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="hidden md:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <Link href="/">
              <a className="block text-gray-700 hover:text-pink-500 transition-colors">Home</a>
            </Link>
            <Link href="/features">
              <a className="block text-gray-700 hover:text-pink-500 transition-colors">Features</a>
            </Link>
            <Link href="/premium">
              <a className="block text-gray-700 hover:text-pink-500 transition-colors">Premium</a>
            </Link>
            {user ? (
              <>
                <Link href="/app">
                  <a className="block text-gray-700 hover:text-pink-500 transition-colors">App</a>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="w-full justify-start"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-red-400">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
