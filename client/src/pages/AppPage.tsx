import React, { useState, useEffect } from 'react';
import { Heart, X, Star, Video, Crown, Settings, Filter, Lock } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MatchCard } from '@/components/MatchCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { User } from '@/types';

export function AppPage() {
  const { user } = useAuthContext();
  const { 
    canUseGenderFilter, 
    hasUnlimitedSwipes, 
    getDailySwipeLimit,
    isPremium 
  } = usePremiumContext();

  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [dailySwipeCount, setDailySwipeCount] = useState(0);
  const [filters, setFilters] = useState({
    genderFilter: 'all',
    ageRange: [18, 50],
    maxDistance: 50,
    verifiedOnly: false,
  });

  // Mock potential matches
  const [potentialMatches] = useState<User[]>([
    {
      id: '1',
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      age: 24,
      gender: 'female',
      bio: 'Love hiking, coffee, and good conversations. Looking for genuine connections! 🌟',
      interests: ['Travel', 'Photography', 'Coffee'],
      profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
      isVerified: true,
      verificationStatus: 'approved',
      premiumTier: 'premium',
      location: { city: 'New York', state: 'NY', country: 'USA' },
      createdAt: new Date(),
      lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: '2',
      email: 'alex@example.com',
      firstName: 'Alex',
      lastName: 'Chen',
      age: 26,
      gender: 'male',
      bio: 'Software engineer who loves rock climbing and trying new restaurants. Let\'s explore the city together!',
      interests: ['Technology', 'Rock Climbing', 'Food'],
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
      isVerified: true,
      verificationStatus: 'approved',
      premiumTier: 'vip',
      location: { city: 'San Francisco', state: 'CA', country: 'USA' },
      createdAt: new Date(),
      lastActive: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: '3',
      email: 'emma@example.com',
      firstName: 'Emma',
      lastName: 'Wilson',
      age: 22,
      gender: 'female',
      bio: 'Artist and dancer. Passionate about creativity and self-expression. Looking for someone who appreciates the arts.',
      interests: ['Art', 'Dancing', 'Music'],
      profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
      isVerified: false,
      verificationStatus: 'none',
      premiumTier: 'free',
      location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
      createdAt: new Date(),
      lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  ]);

  const [recentMatches] = useState([
    {
      id: '1',
      name: 'Emma',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50',
      lastMessage: "Hey! How's your day going?",
      timestamp: '2m',
      unread: true,
      isOnline: true,
      isPremium: false,
    },
    {
      id: '2',
      name: 'Michael',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50',
      lastMessage: 'Thanks for the match! 😊',
      timestamp: '1h',
      unread: false,
      isOnline: false,
      isPremium: true,
    },
    {
      id: '3',
      name: 'Sofia',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50',
      lastMessage: 'Nice to meet you!',
      timestamp: '3h',
      unread: false,
      isOnline: false,
      isPremium: false,
    },
  ]);

  const currentMatch = potentialMatches[currentMatchIndex];
  const swipeLimit = getDailySwipeLimit();
  const canSwipe = hasUnlimitedSwipes() || dailySwipeCount < swipeLimit;

  const handleLike = () => {
    if (!canSwipe) return;
    
    setDailySwipeCount(prev => prev + 1);
    setCurrentMatchIndex(prev => (prev + 1) % potentialMatches.length);
  };

  const handlePass = () => {
    if (!canSwipe) return;
    
    setDailySwipeCount(prev => prev + 1);
    setCurrentMatchIndex(prev => (prev + 1) % potentialMatches.length);
  };

  const handleSuperLike = () => {
    // Super likes typically don't count against daily limit
    setCurrentMatchIndex(prev => (prev + 1) % potentialMatches.length);
  };

  const handleVideoCall = () => {
    // Redirect to video call page
    window.location.href = '/video-call';
  };

  const handleRandomMatch = () => {
    const randomIndex = Math.floor(Math.random() * potentialMatches.length);
    setCurrentMatchIndex(randomIndex);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to access the app.</p>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-pink-500 to-red-400">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-400 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NexMeet</h1>
                <p className="text-xs text-gray-500">Find Your Match</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isPremium() && (
                <Link href="/premium">
                  <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600">
                    <Crown className="w-4 h-4 mr-2" />
                    Go Premium
                  </Button>
                </Link>
              )}
              
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </h3>
                  {!isPremium() && (
                    <Badge variant="outline" className="text-xs">
                      Limited
                    </Badge>
                  )}
                </div>
                
                {/* Gender Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Who would you like to meet?</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Button
                        variant={filters.genderFilter === 'all' ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => setFilters({ ...filters, genderFilter: 'all' })}
                      >
                        Everyone
                      </Button>
                    </div>
                    
                    {/* Premium Girls Only */}
                    <div className="relative">
                      <Button
                        variant={filters.genderFilter === 'female' ? 'default' : 'outline'}
                        className={`w-full justify-start ${!canUseGenderFilter('female') ? 'opacity-50' : ''}`}
                        onClick={() => canUseGenderFilter('female') && setFilters({ ...filters, genderFilter: 'female' })}
                        disabled={!canUseGenderFilter('female')}
                      >
                        <span className="text-pink-600 mr-2">♀</span>
                        Girls Only
                        {!canUseGenderFilter('female') && (
                          <Lock className="w-4 h-4 ml-auto" />
                        )}
                      </Button>
                      {!canUseGenderFilter('female') && (
                        <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                    
                    {/* Premium Boys Only */}
                    <div className="relative">
                      <Button
                        variant={filters.genderFilter === 'male' ? 'default' : 'outline'}
                        className={`w-full justify-start ${!canUseGenderFilter('male') ? 'opacity-50' : ''}`}
                        onClick={() => canUseGenderFilter('male') && setFilters({ ...filters, genderFilter: 'male' })}
                        disabled={!canUseGenderFilter('male')}
                      >
                        <span className="text-blue-600 mr-2">♂</span>
                        Boys Only
                        {!canUseGenderFilter('male') && (
                          <Lock className="w-4 h-4 ml-auto" />
                        )}
                      </Button>
                      {!canUseGenderFilter('male') && (
                        <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Age Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                  <div className="px-2">
                    <Slider
                      value={filters.ageRange}
                      onValueChange={(value) => setFilters({ ...filters, ageRange: value as [number, number] })}
                      min={18}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{filters.ageRange[0]}</span>
                      <span>{filters.ageRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worldwide">Worldwide</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Verified Only */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    Verified profiles only
                  </label>
                  <Switch
                    checked={filters.verifiedOnly}
                    onCheckedChange={(checked) => setFilters({ ...filters, verifiedOnly: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/video-call">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500">
                      <Video className="w-4 h-4 mr-2" />
                      Start Video Chat
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleRandomMatch}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Random Match
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Match Cards */}
          <div className="lg:col-span-1">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover People</h2>
              <p className="text-gray-600">
                {hasUnlimitedSwipes() 
                  ? 'Unlimited swipes available!' 
                  : `${swipeLimit - dailySwipeCount} swipes remaining today`
                }
              </p>
            </div>

            {/* Match Card */}
            {currentMatch && (
              <div className="relative mb-6">
                <MatchCard
                  user={currentMatch}
                  onLike={canSwipe ? handleLike : undefined}
                  onPass={canSwipe ? handlePass : undefined}
                  onSuperLike={handleSuperLike}
                  onVideoCall={handleVideoCall}
                  showActions={canSwipe}
                  className="mx-auto max-w-sm"
                />
                
                {!canSwipe && (
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-2xl">
                    <div className="text-center">
                      <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">Daily Limit Reached</h3>
                      <p className="text-gray-600 text-sm mb-4">Upgrade to Premium for unlimited swipes</p>
                      <Link href="/premium">
                        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                          Upgrade Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Premium Upgrade Prompt */}
            {!isPremium() && (
              <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-8 h-8 text-yellow-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-800">Unlock Premium Features</h4>
                      <p className="text-sm text-yellow-700">Unlimited swipes, gender filters, and more!</p>
                    </div>
                    <Link href="/premium">
                      <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-600">
                        Upgrade
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Matches & Chat */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Matches</h3>
                  <Badge variant="outline">{recentMatches.filter(m => m.unread).length} new</Badge>
                </div>
                
                <div className="space-y-3">
                  {recentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={match.photo}
                          alt={match.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          match.isOnline ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        {match.isPremium && (
                          <div className="absolute -top-1 -right-1">
                            <Crown className="w-4 h-4 text-yellow-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold truncate">{match.name}</h4>
                          <span className="text-xs text-gray-500">{match.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{match.lastMessage}</p>
                      </div>
                      {match.unread && (
                        <div className="w-2 h-2 bg-pink-500 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
                
                <Link href="/chat">
                  <Button variant="outline" className="w-full mt-4">
                    View All Matches
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Features Showcase */}
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                  Premium Features
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    Unlimited swipes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    See who likes you
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    Gender filters
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    Video & voice calls
                  </li>
                </ul>
                <Link href="/premium">
                  <Button className="w-full mt-4 bg-white text-purple-600 hover:bg-gray-100">
                    Upgrade Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
