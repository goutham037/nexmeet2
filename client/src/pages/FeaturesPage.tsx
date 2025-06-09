import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Video, 
  Shield, 
  Crown, 
  MessageCircle, 
  Users, 
  Star,
  Globe,
  Zap,
  Eye,
  Gift,
  Filter
} from 'lucide-react';

export function FeaturesPage() {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Smart Matching",
      description: "Advanced algorithm finds your perfect match based on interests, values, and compatibility.",
      category: "Core"
    },
    {
      icon: <Video className="w-8 h-8 text-blue-500" />,
      title: "HD Video Calls",
      description: "Crystal clear video calls with premium quality for deeper connections.",
      category: "Premium",
      premium: true
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Profile Verification",
      description: "Verified profiles with photo and ID verification for authentic connections.",
      category: "Safety"
    },
    {
      icon: <Filter className="w-8 h-8 text-purple-500" />,
      title: "Gender Filters",
      description: "Connect with specific genders - 'Girls Only' or 'Boys Only' filtering.",
      category: "Premium",
      premium: true
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-indigo-500" />,
      title: "Advanced Messaging",
      description: "Rich messaging with photos, voice notes, read receipts, and reactions.",
      category: "Communication"
    },
    {
      icon: <Eye className="w-8 h-8 text-gray-500" />,
      title: "Incognito Mode",
      description: "Browse profiles privately without being seen by others.",
      category: "Premium",
      premium: true
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Super Likes",
      description: "Stand out with Super Likes to show you're really interested.",
      category: "Premium",
      premium: true
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-500" />,
      title: "Global Connections",
      description: "Connect with people from around the world with location filters.",
      category: "Core"
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      title: "Priority Matching",
      description: "Get seen first with priority placement in potential matches.",
      category: "Premium",
      premium: true
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Unlimited Swipes",
      description: "No daily limits - swipe as much as you want to find your match.",
      category: "Premium",
      premium: true
    },
    {
      icon: <Gift className="w-8 h-8 text-red-500" />,
      title: "Virtual Gifts",
      description: "Send virtual gifts to show appreciation and stand out.",
      category: "Premium",
      premium: true
    },
    {
      icon: <Crown className="w-8 h-8 text-yellow-600" />,
      title: "VIP Status",
      description: "Exclusive VIP features including read receipts and advanced filters.",
      category: "VIP",
      premium: true
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'VIP': return 'bg-yellow-100 text-yellow-800';
      case 'Safety': return 'bg-green-100 text-green-800';
      case 'Communication': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"> Modern Dating</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover an extensive set of features designed to help you find meaningful connections, 
            from basic matching to premium video calls and advanced filtering options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500">
                Start Connecting
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="border-2">
                View Premium Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Find Love
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From basic matching to advanced premium features, NexMeet offers comprehensive tools for modern dating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    {feature.icon}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(feature.category)}>
                      {feature.category}
                    </Badge>
                    {feature.premium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Premium Dating?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Join thousands of verified users who have found meaningful connections on NexMeet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}