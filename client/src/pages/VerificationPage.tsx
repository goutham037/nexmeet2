import React, { useState } from 'react';
import { ArrowLeft, Shield, Camera, CheckCircle, Upload } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function VerificationPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'start' | 'photo' | 'submitted'>('start');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { updateUserProfile } = useAuthContext();
  const { toast } = useToast();

  const verificationSteps = [
    {
      step: 1,
      title: 'Take a clear selfie showing your face',
      description: 'Make sure your face is clearly visible and well-lit',
    },
    {
      step: 2,
      title: 'Match the pose shown in the example',
      description: 'Follow the pose guide to ensure proper verification',
    },
    {
      step: 3,
      title: 'Wait for manual review (24-48 hours)',
      description: 'Our team will review your photo and approve your verification',
    },
  ];

  const handleStartVerification = () => {
    setVerificationStep('photo');
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const mockPhotoUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150';
    setSelectedPhoto(mockPhotoUrl);
  };

  const handleSubmitVerification = async () => {
    setLoading(true);
    
    try {
      // Update user verification status
      await updateUserProfile({
        verificationStatus: 'pending',
      });

      setVerificationStep('submitted');
      
      toast({
        title: "Verification Submitted",
        description: "Your verification photo has been submitted for review. We'll notify you within 24-48 hours.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit verification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipVerification = () => {
    setLocation('/app');
  };

  const handleContinueToApp = () => {
    setLocation('/app');
  };

  if (verificationStep === 'submitted') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Verification Submitted!</CardTitle>
              <p className="text-white/90">Your photo is being reviewed by our team</p>
            </CardHeader>

            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">What happens next?</h3>
                  <div className="text-left space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <span className="text-green-700">Our team reviews your photo (usually within 24 hours)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <span className="text-green-700">You'll receive a notification about the verification status</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <span className="text-green-700">Get your verification badge and increased trust</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Verification Benefits</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">Verified badge</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">Increased trust</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">Better matches</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">Higher visibility</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleContinueToApp}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
                  size="lg"
                >
                  Continue to NexMeet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle className="text-2xl font-bold mb-2">Verify Your Profile</CardTitle>
            <p className="text-white/90">Build trust with other users by verifying your identity</p>
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-2/3 transition-all duration-300" />
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {verificationStep === 'start' && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-12 h-12 text-green-500" />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Photo Verification</h3>
                  <p className="text-gray-600 mb-8">
                    Take a selfie to verify your identity. This helps other users know you're real and builds trust in our community.
                  </p>
                </div>

                {/* Verification Steps */}
                <div className="space-y-4">
                  {verificationSteps.map((step) => (
                    <div key={step.step} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl text-left">
                      <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleStartVerification}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Verification
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkipVerification}
                    className="flex-1"
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            )}

            {verificationStep === 'photo' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Take Your Verification Photo</h3>
                  <p className="text-gray-600">Make sure your face is clearly visible and follows the example pose</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Photo Upload Area */}
                  <div className="text-center">
                    <div 
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 transition-colors"
                      onClick={handlePhotoUpload}
                    >
                      {selectedPhoto ? (
                        <img src={selectedPhoto} alt="Verification photo" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <>
                          <Camera className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Tap to take photo</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Your Selfie</p>
                  </div>

                  {/* Example Pose */}
                  <div className="text-center">
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                        alt="Example verification pose"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Example Pose</p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Photo Requirements</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Face must be clearly visible</li>
                    <li>• Good lighting, no shadows</li>
                    <li>• Look directly at the camera</li>
                    <li>• No filters or editing</li>
                    <li>• Match the example pose</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setVerificationStep('start')}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitVerification}
                    disabled={!selectedPhoto || loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit for Review
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
