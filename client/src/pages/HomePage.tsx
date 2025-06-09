import React from 'react';
import { ArrowRight, Heart, Shield, Video, Crown, Star } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';

export function HomePage() {
  const { user } = useAuthContext();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Premium Gender Filters',
      description: 'Connect exclusively with girls or boys. Premium feature for targeted matching.',
      gradient: 'from-pink-50 to-purple-50',
      tags: ['Girls Only', 'Boys Only'],
      tagColors: ['bg-pink-100 text-pink-700', 'bg-blue-100 text-blue-700'],
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'HD Video & Voice Calls',
      description: 'Crystal clear video calls with premium users getting priority connection quality.',
      gradient: 'from-blue-50 to-cyan-50',
      tags: ['Premium Quality'],
      tagColors: ['bg-blue-100 text-blue-700'],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Profile Verification',
      description: 'Get verified with photo verification. Build trust with authentic connections.',
      gradient: 'from-green-50 to-emerald-50',
      tags: ['Verified Profiles'],
      tagColors: ['bg-green-100 text-green-700'],
    },
  ];

  const stats = [
    { value: '2M+', label: 'Active Users' },
    { value: '500K+', label: 'Matches Made' },
    { value: '50K+', label: 'Success Stories' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full animate-bounce" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent"> Perfect</span>
            <br />Match
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Connect with amazing people worldwide. Premium features for deeper connections, video calls, and exclusive matching.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href={user ? "/app" : "/auth"}>
              <Button size="lg" className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Start Connecting
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg font-semibold">
                <Crown className="mr-2 w-5 h-5" />
                Go Premium
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose NexMeet?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced features designed to help you find meaningful connections
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`bg-gradient-to-br ${feature.gradient} hover:shadow-lg transition-all`}>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex space-x-2">
                    {feature.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${feature.tagColors[tagIndex]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See NexMeet in Action</h2>
            <p className="text-xl text-gray-600">Modern design meets powerful functionality</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Smart Matching',
                description: 'AI-powered algorithm finds your perfect match',
                image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
              },
              {
                title: 'Premium Features',
                description: 'Unlock exclusive features and priority matching',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
              },
              {
                title: 'Video Calls',
                description: 'HD video and voice calling with crystal clear quality',
                image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
              },
              {
                title: 'Beautiful Design',
                description: 'Instagram-inspired modern interface',
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600',
              },
            ].map((preview, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                  <img
                    src={preview.image}
                    alt={preview.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{preview.title}</h3>
                  <p className="text-gray-600 text-sm">{preview.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join millions of users who have found love on NexMeet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? "/app" : "/auth"}>
              <Button size="lg" className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/premium">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-500 px-8 py-4 text-lg font-semibold">
                View Premium Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
