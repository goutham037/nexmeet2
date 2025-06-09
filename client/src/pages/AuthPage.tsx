import React, { useState } from 'react';
import { Heart, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function AuthPage() {
  const [, setLocation] = useLocation();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { signIn, signUp, error } = useAuthContext();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords don't match",
            variant: "destructive",
          });
          return;
        }
        await signUp(formData.email, formData.password);
        toast({
          title: "Success",
          description: "Account created successfully! Please complete your profile.",
        });
        setLocation('/profile-setup');
      } else {
        await signIn(formData.email, formData.password);
        toast({
          title: "Success",
          description: "Welcome back to NexMeet!",
        });
        setLocation('/app');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    setLocation('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to NexMeet
          </CardTitle>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account to start connecting' : 'Sign in to continue your journey'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center mt-2">
                {error}
              </div>
            )}
          </form>

          {/* Toggle Sign In/Sign Up */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <Button
              variant="link"
              className="text-pink-500 font-semibold p-0"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Guest Access */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGuestAccess}
          >
            Continue as Guest
          </Button>

          {/* Premium CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Want premium features?
            </p>
            <Link href="/premium">
              <Button variant="link" className="text-pink-500 font-semibold">
                View Premium Plans
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
