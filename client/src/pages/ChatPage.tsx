import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChatInterface } from '@/components/ChatInterface';
import { useAuthContext } from '@/contexts/AuthContext';
import { User, Message } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export function ChatPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Mock chat partner (in a real app, this would come from route params or query)
  const [chatPartner] = useState<User>({
    id: '2',
    email: 'emma@example.com',
    firstName: 'Emma',
    lastName: 'Wilson',
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
    lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  });

  // Initialize with some mock messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        matchId: 'match1',
        senderId: chatPartner.id,
        content: "Hey! How's your day going? 😊",
        type: 'text',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        readAt: new Date(Date.now() - 8 * 60 * 1000),
      },
      {
        id: '2',
        matchId: 'match1',
        senderId: user?.id || '',
        content: "Hey Emma! It's going great, thanks for asking. How about yours?",
        type: 'text',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        readAt: new Date(Date.now() - 6 * 60 * 1000),
      },
      {
        id: '3',
        matchId: 'match1',
        senderId: chatPartner.id,
        content: "Pretty good! I love your profile by the way. Do you really play guitar? 🎸",
        type: 'text',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        readAt: new Date(Date.now() - 3 * 60 * 1000),
      },
    ];
    
    setMessages(initialMessages);
  }, [chatPartner.id, user?.id]);

  const handleSendMessage = (content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      matchId: 'match1',
      senderId: user.id,
      content,
      type: 'text',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate partner response after a delay
    setTimeout(() => {
      const responses = [
        "That's awesome! 😄",
        "I'd love to hear more about that!",
        "Sounds interesting! Tell me more.",
        "That's really cool! 🌟",
        "Nice! What else do you enjoy?",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const partnerMessage: Message = {
        id: (Date.now() + 1).toString(),
        matchId: 'match1',
        senderId: chatPartner.id,
        content: randomResponse,
        type: 'text',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, partnerMessage]);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleVideoCall = () => {
    setLocation('/video-call');
  };

  const handleVoiceCall = () => {
    setLocation('/under-development');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to access chat.</p>
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
    <ChatInterface
      partner={chatPartner}
      messages={messages}
      onSendMessage={handleSendMessage}
      onVideoCall={handleVideoCall}
      onVoiceCall={handleVoiceCall}
      isTyping={false}
    />
  );
}
