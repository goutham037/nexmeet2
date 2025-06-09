import React from 'react';
import { AlertCircle, Database, Shield, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function FirebaseSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800">Firebase Setup Required</AlertTitle>
        <AlertDescription className="text-orange-700">
          Your Firebase project needs additional configuration to enable all features. Follow the steps below to complete the setup.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">1. Enable Firestore Database</h3>
              <p className="text-sm text-gray-600">Set up your app's database storage</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">
              Go to your <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a>
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-4">
              <li>Navigate to "Firestore Database" in the left sidebar</li>
              <li>Click "Create database"</li>
              <li>Choose "Start in test mode" for development</li>
              <li>Select a location close to your users</li>
              <li>Click "Done" to create the database</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">2. Configure Authentication</h3>
              <p className="text-sm text-gray-600">Enable user sign-up and login</p>
            </div>
          </div>
          <div className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-4">
              <li>Go to "Authentication" in the Firebase Console</li>
              <li>Click "Get started" if you haven't already</li>
              <li>Go to the "Sign-in method" tab</li>
              <li>Enable "Email/Password" provider</li>
              <li>Add your domain to "Authorized domains"</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">3. Update Security Rules (Optional)</h3>
              <p className="text-sm text-gray-600">Configure database access permissions</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              For production, update Firestore security rules to restrict access:
            </p>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /matches/{matchId} {
      allow read, write: if request.auth != null;
    }
  }
}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-2">After Setup:</h4>
        <p className="text-sm text-green-700 mb-3">
          Once you've completed these steps, refresh this page and the Firebase errors should be resolved.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
}