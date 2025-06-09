import React, { useState } from 'react';
import { ArrowLeft, Crown, Check, Mail, User, Heart } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface WaitlistFormData {
  firstName: string;
  lastName: string;
  email: string;
  interestedFeatures: string[];
}

export function WaitlistPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<WaitlistFormData>({
    firstName: '',
    lastName: '',
    email: '',
    interestedFeatures: [],
  });

  const { toast } = useToast();

  const availableFeatures = [
    { id: 'gender-filters', name: 'Gender Filters', description: 'Connect with girls or boys only' },
    { id: 'video-calls', name: 'HD Video Calls', description: 'Crystal clear video calling' },
    { id: 'verification', name: 'Profile Verification', description: 'Get verified with photo verification' },
    { id: 'unlimited-swipes', name: 'Unlimited Swipes', description: 'No daily limits on matching' },
    { id: 'priority-matching', name: 'Priority Matching', description: 'Get matched first with better algorithm' },
    { id: 'incognito-mode', name: 'Incognito Mode', description: 'Browse profiles anonymously' },
  ];

  const mockWaitlistUsers = [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interestedFeatures: checked
        ? [...prev.interestedFeatures, featureId]
        : prev.interestedFeatures.filter(id => id !== featureId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitted(true);
      toast({
        title: "Success!",
        description: "You've been added to our premium waitlist. We'll notify you as soon as features are available!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to the Waitlist!</CardTitle>
            <p className="text-white/90">You're all set! Here's what happens next.</p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="flex -space-x-2">
                  {mockWaitlistUsers.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`User ${index + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">+2K</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                You're #<span className="font-bold text-pink-500">2,848</span> on the waitlist
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">What's Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-green-700">We'll email you when premium features are ready</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-green-700">You'll get early access before the general public</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-green-700">Enjoy 50% off your first month</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Waitlist Perks</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">Early access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">50% discount</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">Beta testing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">Priority support</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <Button
                  onClick={() => setLocation('/app')}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
                  size="lg"
                >
                  Continue to NexMeet
                </Button>
                <p className="text-sm text-gray-500">
                  We'll send you updates at {formData.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-red-400 text-white">
          <div className="flex items-center justify-between">
            <Link href="/premium">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-yellow-300" />
            </div>
            <div></div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2 text-center">Join the Premium Waitlist</CardTitle>
          <p className="text-white/90 text-center">Be among the first to experience our premium features</p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Social Proof */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex -space-x-2">
                {mockWaitlistUsers.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`User ${index + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">+2K</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              <span className="font-bold text-pink-500">2,847 people</span> are already on the waitlist
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  First Name
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            {/* Feature Interest */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Which premium features are you most excited about?
              </label>
              <div className="grid grid-cols-1 gap-3">
                {availableFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={feature.id}
                      checked={formData.interestedFeatures.includes(feature.id)}
                      onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={feature.id} className="font-medium text-gray-900 cursor-pointer">
                        {feature.name}
                      </label>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.email || !formData.firstName}
              className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Joining Waitlist...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Join Premium Waitlist
                </>
              )}
            </Button>
          </form>

          {/* Perks */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 text-pink-500 mr-2" />
              Waitlist Perks
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Early access to premium features
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                50% discount on first month
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Exclusive beta testing opportunities
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Priority customer support
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
