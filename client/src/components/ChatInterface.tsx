import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, Phone, MoreVertical, Send, Paperclip, Smile, Mic, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Message } from '@/types';
import { useAuthContext } from '@/contexts/AuthContext';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { Link } from 'wouter';

interface ChatInterfaceProps {
  partner: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onVideoCall?: () => void;
  onVoiceCall?: () => void;
  isTyping?: boolean;
}

export function ChatInterface({ 
  partner, 
  messages, 
  onSendMessage, 
  onVideoCall, 
  onVoiceCall,
  isTyping = false 
}: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();
  const { canMakeVideoCalls, canSeeReadReceipts, isPremium } = usePremiumContext();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
      setIsUserTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    // Simulate typing indicator
    if (!isUserTyping && e.target.value) {
      setIsUserTyping(true);
      setTimeout(() => setIsUserTyping(false), 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOnlineStatus = () => {
    const now = new Date();
    const lastActive = partner.lastActive;
    const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 5) return 'Active now';
    if (diffInMinutes < 60) return `Active ${diffInMinutes}m ago`;
    return `Active ${Math.floor(diffInMinutes / 60)}h ago`;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/app">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {partner.profilePhoto ? (
                    <img src={partner.profilePhoto} alt={partner.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 font-medium">
                        {partner.firstName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{partner.firstName}</h3>
                  {partner.isVerified && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs">Verified</Badge>
                  )}
                  {partner.premiumTier !== 'free' && (
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>{partner.premiumTier}</span>
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-green-500">{getOnlineStatus()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Video Call Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onVideoCall}
              disabled={!canMakeVideoCalls()}
              className="relative"
            >
              <Video className="w-5 h-5" />
              {!canMakeVideoCalls() && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
              )}
            </Button>
            
            {/* Voice Call Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoiceCall}
              disabled={!canMakeVideoCalls()}
              className="relative"
            >
              <Phone className="w-5 h-5" />
              {!canMakeVideoCalls() && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
              )}
            </Button>
            
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Features Banner */}
      {!isPremium() && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-800">Upgrade for HD video calls, read receipts, and more</span>
            </div>
            <Link href="/premium">
              <Button size="sm" variant="outline" className="text-yellow-800 border-yellow-300 hover:bg-yellow-200">
                Upgrade
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === user?.id;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                {!isOwnMessage && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mb-1">
                    {partner.profilePhoto ? (
                      <img src={partner.profilePhoto} alt={partner.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                        <span className="text-pink-600 text-sm font-medium">
                          {partner.firstName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-pink-500 to-red-400 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center justify-between mt-1 text-xs ${
                    isOwnMessage ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {isOwnMessage && canSeeReadReceipts() && message.readAt && (
                      <span className="ml-2">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          {/* Attachment Button (Premium) */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isPremium()}
            className="relative"
          >
            <Paperclip className="w-5 h-5" />
            {!isPremium() && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
            )}
          </Button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              value={messageText}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="pr-12 rounded-full border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 rounded-full"
            disabled={!messageText.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>

          {/* Voice Message Button (Premium) */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isPremium()}
            className="relative"
          >
            <Mic className="w-5 h-5" />
            {!isPremium() && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
