import React from 'react';
import { Heart, X, Star, Shield, Crown, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';

interface MatchCardProps {
  user: User;
  onLike?: () => void;
  onPass?: () => void;
  onSuperLike?: () => void;
  onVideoCall?: () => void;
  className?: string;
  showActions?: boolean;
}

export function MatchCard({ 
  user, 
  onLike, 
  onPass, 
  onSuperLike, 
  onVideoCall,
  className = '',
  showActions = true 
}: MatchCardProps) {
  const getDistance = () => {
    // Mock distance calculation
    return Math.floor(Math.random() * 50) + 1;
  };

  const getLastActive = () => {
    const now = new Date();
    const lastActive = user.lastActive;
    const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 5) return 'Active now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className={`relative overflow-hidden shadow-xl ${className}`}>
      <div className="relative">
        {/* Profile Image */}
        <div className="aspect-[3/4] relative overflow-hidden">
          {user.profilePhoto ? (
            <img 
              src={user.profilePhoto} 
              alt={`${user.firstName}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <div className="text-6xl text-pink-300">
                {user.firstName?.[0] || '?'}
              </div>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {user.isVerified && (
              <Badge className="bg-blue-500 text-white flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Verified</span>
              </Badge>
            )}
            
            {user.premiumTier !== 'free' && (
              <Badge className="bg-yellow-500 text-black flex items-center space-x-1">
                <Crown className="w-3 h-3" />
                <span>{user.premiumTier.toUpperCase()}</span>
              </Badge>
            )}
          </div>

          {/* Last Active */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/20 backdrop-blur-sm text-white flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{getLastActive()}</span>
            </Badge>
          </div>
        </div>

        {/* Profile Info */}
        <CardContent className="absolute bottom-0 left-0 right-0 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold">
                {user.firstName} {user.lastName?.[0] && `${user.lastName[0]}.`}
                {user.age && `, ${user.age}`}
              </h3>
              <div className="flex items-center text-white/80 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{getDistance()} km away</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-white/90 text-sm mb-3 line-clamp-2">
              {user.bio}
            </p>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {user.interests.slice(0, 3).map((interest, index) => (
                <Badge 
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white text-xs"
                >
                  {interest}
                </Badge>
              ))}
              {user.interests.length > 3 && (
                <Badge className="bg-white/20 backdrop-blur-sm text-white text-xs">
                  +{user.interests.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="absolute bottom-6 right-6 flex space-x-3">
          {onPass && (
            <Button
              size="sm"
              variant="secondary"
              className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-600 shadow-lg"
              onClick={onPass}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          
          {onSuperLike && (
            <Button
              size="sm"
              className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
              onClick={onSuperLike}
            >
              <Star className="w-5 h-5" />
            </Button>
          )}
          
          {onVideoCall && (
            <Button
              size="sm"
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              onClick={onVideoCall}
            >
              <video className="w-5 h-5" />
            </Button>
          )}
          
          {onLike && (
            <Button
              size="sm"
              className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
              onClick={onLike}
            >
              <Heart className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
