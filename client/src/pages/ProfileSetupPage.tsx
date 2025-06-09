import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, User } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function ProfileSetupPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    bio: '',
    interests: [] as string[],
    profilePhoto: '',
  });

  const { user, updateUserProfile } = useAuthContext();
  const { toast } = useToast();

  const interests = [
    'Music', 'Movies', 'Travel', 'Sports', 'Books', 'Gaming',
    'Cooking', 'Art', 'Photography', 'Fitness', 'Dancing', 'Technology',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderSelect = (gender: string) => {
    setProfileData({ ...profileData, gender });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = profileData.interests.includes(interest)
      ? profileData.interests.filter(i => i !== interest)
      : [...profileData.interests, interest];
    
    setProfileData({ ...profileData, interests: newInterests });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      await updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        age: profileData.age ? parseInt(profileData.age) : undefined,
        gender: profileData.gender as 'male' | 'female',
        bio: profileData.bio,
        interests: profileData.interests,
        profilePhoto: profileData.profilePhoto,
      });

      toast({
        title: "Success",
        description: "Profile created successfully!",
      });

      setLocation('/verification');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profileData.firstName && profileData.age && profileData.gender;
      case 2:
        return profileData.bio;
      case 3:
        return profileData.interests.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {profileData.profilePhoto ? (
                    <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-600">Upload your best photo</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <Input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleInputChange}
                placeholder="25"
                min="18"
                max="100"
                required
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={profileData.gender === 'female' ? 'default' : 'outline'}
                  className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                    profileData.gender === 'female' ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-200 hover:border-pink-400'
                  }`}
                  onClick={() => handleGenderSelect('female')}
                >
                  <div className="text-2xl">♀</div>
                  <span>Female</span>
                </Button>
                <Button
                  type="button"
                  variant={profileData.gender === 'male' ? 'default' : 'outline'}
                  className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                    profileData.gender === 'male' ? 'bg-blue-500 hover:bg-blue-600' : 'border-blue-200 hover:border-blue-400'
                  }`}
                  onClick={() => handleGenderSelect('male')}
                >
                  <div className="text-2xl">♂</div>
                  <span>Male</span>
                </Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
              <Textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                placeholder="Tell people about yourself, your hobbies, what you're looking for..."
                className="h-32 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {profileData.bio.length}/500 characters
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Interests</label>
              <p className="text-gray-600 text-sm mb-4">
                Select your interests to help us find better matches for you
              </p>
              <div className="grid grid-cols-3 gap-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={profileData.interests.includes(interest) ? 'default' : 'outline'}
                    className={`cursor-pointer text-center justify-center py-2 ${
                      profileData.interests.includes(interest)
                        ? 'bg-pink-500 hover:bg-pink-600 text-white'
                        : 'border-gray-300 hover:border-pink-400 hover:text-pink-600'
                    }`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selected: {profileData.interests.length} interests
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-red-400 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Complete Your Profile
              </CardTitle>
              <div className="text-sm bg-white/20 rounded-full px-3 py-1">
                Step {step} of 3
              </div>
            </div>
            <p className="text-white/90">
              {step === 1 && "Let's start with the basics"}
              {step === 2 && "Tell us about yourself"}
              {step === 3 && "What are you interested in?"}
            </p>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <div>
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <Link href="/auth">
                    <Button variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                )}
              </div>

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
              >
                {step === 3 ? 'Complete Profile' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
