import React, { useState } from 'react';
import { Crown, Check, Star, Shield, Video, Heart, Zap, Eye, Rocket, Lock } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { PremiumFeatureCard } from '@/components/PremiumFeatureCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { useToast } from '@/hooks/use-toast';

export function PremiumPage() {
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuthContext();
  const { plans, features, isPremium, upgradeToPremium } = usePremiumContext();
  const { toast } = useToast();

  const handleUpgrade = async (planId: string) => {
    try {
      await upgradeToPremium(planId);
    } catch (error) {
      // Redirect to waitlist since payment is not implemented
      toast({
        title: "Coming Soon!",
        description: "Payment processing is under development. Join our waitlist to be notified when it's ready!",
      });
      setLocation('/waitlist');
    }
  };

  const premiumFeatures = [
    {
      feature: features.find(f => f.id === 'gender-filters')!,
      icon: <Heart className="w-6 h-6" />,
      gradient: 'from-pink-50 to-purple-50',
      benefits: ['Connect with girls only', 'Connect with boys only', 'Advanced matching'],
    },
    {
      feature: features.find(f => f.id === 'video-calling')!,
      icon: <Video className="w-6 h-6" />,
      gradient: 'from-blue-50 to-cyan-50',
      benefits: ['HD video quality', 'Crystal clear audio', 'Screen sharing'],
    },
    {
      feature: features.find(f => f.id === 'incognito-mode')!,
      icon: <Eye className="w-6 h-6" />,
      gradient: 'from-gray-50 to-slate-50',
      benefits: ['Browse anonymously', 'Hide online status', 'Private mode'],
    },
    {
      feature: features.find(f => f.id === 'super-likes')!,
      icon: <Star className="w-6 h-6" />,
      gradient: 'from-yellow-50 to-orange-50',
      benefits: ['Send super likes', 'Premium gifts', 'Profile boosts'],
    },
    {
      feature: features.find(f => f.id === 'priority-matching')!,
      icon: <Rocket className="w-6 h-6" />,
      gradient: 'from-purple-50 to-pink-50',
      benefits: ['Get matched first', 'Advanced algorithm', 'Better visibility'],
    },
    {
      feature: features.find(f => f.id === 'advanced-filters')!,
      icon: <Shield className="w-6 h-6" />,
      gradient: 'from-green-50 to-emerald-50',
      benefits: ['Education filters', 'Lifestyle filters', 'Verified only'],
    },
  ];

  const getMonthlyPrice = (plan: any) => {
    return billingCycle === 'yearly' ? (plan.price * 0.8).toFixed(2) : plan.price.toFixed(2);
  };

  const getYearlyDiscount = () => {
    return billingCycle === 'yearly' ? '20% OFF' : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-yellow-300" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Choose Your Premium Plan
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Unlock exclusive features and find better connections with our premium plans
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`${billingCycle === 'monthly' ? 'text-white' : 'text-white/60'}`}>Monthly</span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={`${billingCycle === 'yearly' ? 'text-white' : 'text-white/60'}`}>Yearly</span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-yellow-500 text-black ml-2">Save 20%</Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  plan.popular ? 'transform scale-105 ring-2 ring-pink-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-pink-500 text-white px-4 py-1 font-semibold">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'bg-gradient-to-r from-pink-500 to-red-400 text-white' : ''}`}>
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold mb-1">
                    ${getMonthlyPrice(plan)}
                    <span className="text-base font-normal opacity-70">/month</span>
                  </div>
                  {getYearlyDiscount() && (
                    <Badge className="bg-green-500 text-white">{getYearlyDiscount()}</Badge>
                  )}
                  {billingCycle === 'yearly' && (
                    <p className="text-sm opacity-80">
                      Billed annually (${(parseFloat(getMonthlyPrice(plan)) * 12).toFixed(2)}/year)
                    </p>
                  )}
                </CardHeader>

                <CardContent className="p-6">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500'
                        : plan.tier === 'vip'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    disabled={isPremium() && user?.premiumTier === plan.tier}
                  >
                    {isPremium() && user?.premiumTier === plan.tier ? (
                      'Current Plan'
                    ) : (
                      `Choose ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Exclusive Premium Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock powerful features designed to help you find meaningful connections
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((item, index) => (
              <PremiumFeatureCard
                key={index}
                feature={item.feature}
                icon={item.icon}
                gradient={item.gradient}
                benefits={item.benefits}
                showUpgrade={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
            <p className="text-xl text-gray-600">See what's included in each plan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Basic</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-pink-50">Premium</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">VIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Daily Swipes</td>
                    <td className="px-6 py-4 text-center text-sm">5</td>
                    <td className="px-6 py-4 text-center text-sm">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm bg-pink-50">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Gender Filters</td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm bg-pink-50"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Video Calling</td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm bg-pink-50"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Read Receipts</td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm bg-pink-50"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Incognito Mode</td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm bg-pink-50"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Super Likes</td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm bg-pink-50"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">What makes NexMeet Premium worth it?</h3>
                <p className="text-gray-600">
                  Our premium features like gender-specific filters, HD video calling, and advanced matching algorithms 
                  significantly improve your chances of finding meaningful connections. Premium users get 3x more matches on average.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time from your account settings. Your premium features 
                  will continue until the end of your billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">How does the gender filter work?</h3>
                <p className="text-gray-600">
                  Premium and VIP members can choose to connect exclusively with girls or boys. This feature helps you 
                  find exactly what you're looking for and eliminates unwanted matches.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">What's the difference between Premium and VIP?</h3>
                <p className="text-gray-600">
                  VIP includes everything in Premium plus exclusive features like incognito browsing, super likes, 
                  profile boosts, and priority customer support. Perfect for users who want the ultimate experience.
                </p>
              </CardContent>
            </Card>
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
            Join thousands of premium members who found love on NexMeet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => handleUpgrade('premium')}
              className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Premium Trial
            </Button>
            <Link href="/waitlist">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-pink-500 px-8 py-4 text-lg font-semibold"
              >
                Join Waitlist
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
