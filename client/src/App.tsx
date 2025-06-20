import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { Navigation } from "@/components/Navigation";
import { FirebaseSetupGuide } from "@/components/FirebaseSetupGuide";
import { HomePage } from "@/pages/HomePage";
import { AuthPage } from "@/pages/AuthPage";
import { ProfileSetupPage } from "@/pages/ProfileSetupPage";
import { VerificationPage } from "@/pages/VerificationPage";
import { AppPage } from "@/pages/AppPage";
import { ChatPage } from "@/pages/ChatPage";
import { VideoCallPage } from "@/pages/VideoCallPage";
import { PremiumPage } from "@/pages/PremiumPage";
import { WaitlistPage } from "@/pages/WaitlistPage";
import { UnderDevelopmentPage } from "@/pages/UnderDevelopmentPage";
import { FeaturesPage } from "@/pages/FeaturesPage";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { error } = useAuthContext();

  if (error === 'firebase-setup-required') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <FirebaseSetupGuide />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Router />
      </main>
      <Toaster />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/profile-setup" component={ProfileSetupPage} />
      <Route path="/verification" component={VerificationPage} />
      <Route path="/app" component={AppPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/video-call" component={VideoCallPage} />
      <Route path="/premium" component={PremiumPage} />
      <Route path="/waitlist" component={WaitlistPage} />
      <Route path="/under-development" component={UnderDevelopmentPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PremiumProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </PremiumProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
