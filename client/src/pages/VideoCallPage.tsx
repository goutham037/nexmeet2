import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Phone, Monitor, Sparkles, Crown } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { User } from '@/types';

export function VideoCallPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuthContext();
  const { getCallQuality, canMakeVideoCalls } = usePremiumContext();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  // Mock call partner
  const [callPartner] = useState<User>({
    id: '2',
    email: 'emma@example.com',
    firstName: 'Emma',
    lastName: 'Wilson',
    age: 24,
    gender: 'female',
    bio: 'Love hiking, coffee, and good conversations.',
    interests: ['Travel', 'Photography', 'Coffee'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    isVerified: true,
    verificationStatus: 'approved',
    premiumTier: 'premium',
    location: { city: 'New York', state: 'NY', country: 'USA' },
    createdAt: new Date(),
    lastActive: new Date(),
  });

  // Simulate call connection
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setLocation('/chat');
    }, 1000);
  };

  const getQualityBadge = () => {
    const quality = getCallQuality();
    switch (quality) {
      case 'premium':
        return { text: 'Premium 4K', color: 'bg-purple-500', icon: <Crown className="w-3 h-3" /> };
      case 'hd':
        return { text: 'HD Premium', color: 'bg-yellow-500', icon: <Crown className="w-3 h-3" /> };
      default:
        return { text: 'Standard', color: 'bg-gray-500', icon: null };
    }
  };

  const qualityBadge = getQualityBadge();

  if (!canMakeVideoCalls()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <VideoOff className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Premium Feature Required</h1>
          <p className="text-white/80 mb-6">
            Video calling is available for Premium and VIP members only.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setLocation('/premium')}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation('/chat')}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Back to Chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (callStatus === 'connecting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-pink-500 animate-pulse">
            <img 
              src={callPartner.profilePhoto} 
              alt={callPartner.firstName}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">Calling {callPartner.firstName}...</h2>
          <p className="text-white/80 mb-8">Connecting to {qualityBadge.text} video call</p>
          <Button 
            variant="destructive" 
            size="lg"
            onClick={() => setLocation('/chat')}
            className="rounded-full"
          >
            <Phone className="w-5 h-5 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (callStatus === 'ended') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Call Ended</h2>
          <p className="text-white/80 mb-4">Duration: {formatDuration(callDuration)}</p>
          <p className="text-sm text-white/60">Redirecting back to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Main Video Area */}
      <div className="absolute inset-0">
        {/* Partner's Video (Main) */}
        <div className="w-full h-full relative">
          <img 
            src={callPartner.profilePhoto} 
            alt={`${callPartner.firstName} on video call`}
            className="w-full h-full object-cover"
          />
          
          {/* Video overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        {/* Your Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-32 h-40 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20">
          {isVideoOn ? (
            <img 
              src={user?.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=250'} 
              alt="Your video"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Call Header */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
              <img 
                src={callPartner.profilePhoto} 
                alt={callPartner.firstName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">{callPartner.firstName}</h3>
                {callPartner.isVerified && (
                  <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>
                )}
              </div>
              <p className="text-white/80 text-sm">Connected • {formatDuration(callDuration)}</p>
            </div>
          </div>

          {/* Quality Badge */}
          <Badge className={`${qualityBadge.color} text-white flex items-center space-x-1`}>
            {qualityBadge.icon}
            <span>{qualityBadge.text}</span>
          </Badge>
        </div>
      </div>

      {/* Premium Features Overlay */}
      <div className="absolute top-20 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold">Premium Quality</span>
        </div>
        <div className="text-xs space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>{qualityBadge.text === 'Premium 4K' ? '4K Ultra HD' : qualityBadge.text === 'HD Premium' ? '1080p HD' : '720p'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Crystal Clear Audio</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Priority Connection</span>
          </div>
          {qualityBadge.text === 'Premium 4K' && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>AI Enhancement</span>
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex justify-center space-x-6">
          {/* Mute Audio */}
          <Button
            size="lg"
            variant={isMuted ? "destructive" : "secondary"}
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 border-0"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {/* Toggle Video */}
          <Button
            size="lg"
            variant={!isVideoOn ? "destructive" : "secondary"}
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 border-0"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          {/* End Call */}
          <Button
            size="lg"
            variant="destructive"
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600"
            onClick={handleEndCall}
          >
            <Phone className="w-6 h-6 rotate-[135deg]" />
          </Button>

          {/* Screen Share (Premium) */}
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 border-0 relative"
            onClick={() => {}}
          >
            <Monitor className="w-6 h-6" />
            {qualityBadge.text !== 'Standard' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-2 h-2 text-black" />
              </div>
            )}
          </Button>

          {/* Effects (Premium) */}
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 border-0 relative"
            onClick={() => {}}
          >
            <Sparkles className="w-6 h-6" />
            {qualityBadge.text !== 'Standard' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-2 h-2 text-black" />
              </div>
            )}
          </Button>
        </div>

        {/* Premium Call Quality Info */}
        <div className="text-center mt-4">
          <p className="text-white/80 text-sm">
            <Crown className="w-4 h-4 inline mr-2 text-yellow-400" />
            {qualityBadge.text} quality • Crystal clear audio • Priority connection
          </p>
        </div>
      </div>
    </div>
  );
}
