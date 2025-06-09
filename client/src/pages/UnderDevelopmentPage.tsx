import React from 'react';
import { ArrowLeft, Code, Clock, Rocket, Check, Crown } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function UnderDevelopmentPage() {
  const developmentPhases = [
    {
      phase: 1,
      title: 'Core Features',
      description: 'Basic matching and chat functionality',
      status: 'complete',
      progress: 100,
      features: ['User profiles', 'Basic matching', 'Text messaging', 'Photo sharing'],
    },
    {
      phase: 2,
      title: 'Premium Features',
      description: 'Video calls, gender filters, verification',
      status: 'in-progress',
      progress: 75,
      features: ['HD video calling', 'Gender-specific filters', 'Profile verification', 'Read receipts'],
    },
    {
      phase: 3,
      title: 'Advanced AI & Analytics',
      description: 'Smart matching, personality insights, advanced features',
      status: 'planned',
      progress: 0,
      features: ['AI personality matching', 'Advanced analytics', 'Smart recommendations', 'Behavioral insights'],
    },
  ];

  const upcomingFeatures = [
    {
      name: 'Voice Messages',
      description: 'Send and receive high-quality voice messages',
      eta: '2 weeks',
      tier: 'premium',
    },
    {
      name: 'Story Sharing',
      description: 'Share moments with your matches through stories',
      eta: '1 month',
      tier: 'basic',
    },
    {
      name: 'Advanced Matching Algorithm',
      description: 'AI-powered compatibility scoring and suggestions',
      eta: '6 weeks',
      tier: 'premium',
    },
    {
      name: 'Group Video Calls',
      description: 'Video calls with multiple people for group dates',
      eta: '2 months',
      tier: 'vip',
    },
    {
      name: 'Real-time Translation',
      description: 'Chat with people who speak different languages',
      eta: '3 months',
      tier: 'premium',
    },
    {
      name: 'Virtual Date Experiences',
      description: 'Shared virtual experiences and activities',
      eta: '4 months',
      tier: 'vip',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'planned':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      default:
        return 'Unknown';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'bg-blue-100 text-blue-700';
      case 'premium':
        return 'bg-pink-100 text-pink-700';
      case 'vip':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Code className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Coming Soon!</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            This amazing feature is currently under development. We're working hard to bring you the best experience possible.
          </p>
          
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Clock className="w-5 h-5" />
            <span className="text-lg">Estimated completion: March 2024</span>
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Development Roadmap</h2>
            <p className="text-xl text-gray-600">Track our progress as we build amazing features</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {developmentPhases.map((phase) => (
              <Card key={phase.phase} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${getStatusColor(phase.status)} rounded-full flex items-center justify-center text-white font-bold`}>
                        {phase.status === 'complete' ? <Check className="w-4 h-4" /> : phase.phase}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{phase.title}</h3>
                        <Badge className={`${getStatusColor(phase.status)} text-white text-xs`}>
                          {getStatusText(phase.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{phase.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    {phase.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          phase.status === 'complete' ? 'bg-green-500' : 
                          phase.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Features</h2>
            <p className="text-xl text-gray-600">Exciting new features coming to NexMeet</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{feature.name}</h3>
                    <Badge className={getTierColor(feature.tier)}>
                      {feature.tier === 'vip' && <Crown className="w-3 h-3 mr-1" />}
                      {feature.tier.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">ETA: {feature.eta}</span>
                    <div className="flex items-center text-blue-600">
                      <Rocket className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">In Development</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Testing Signup */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Want Early Access?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our beta testing program and be the first to try new features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/waitlist">
              <Button size="lg" className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Join Beta Program
              </Button>
            </Link>
            <Link href="/app">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-500 px-8 py-4 text-lg font-semibold">
                Back to App
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-6">
            Follow our development progress and get notified about new features
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/waitlist">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Join Waitlist
              </Button>
            </Link>
            <Link href="/premium">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                View Premium Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
