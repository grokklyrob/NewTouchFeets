
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Generator } from './components/Generator';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { redirectToCheckout } from './services/stripeService';

const App: React.FC = () => {
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
  const { user, token, signIn } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    if (!user || !token) {
      // Prompt user to sign in if they lack a valid token.
      // After sign-in, the context will update with a new token.
      // The user will need to click the button again. This is a simple and safe flow.
      await signIn();
      return;
    }

    setIsSubscribing(priceId);
    try {
      // Pass the valid token to the checkout service.
      await redirectToCheckout(priceId, token);
      
      // In a real app with webhooks, the user's status is updated on the backend.
      // The client will learn about the new 'paid' status on the next page load
      // or via a real-time update mechanism (e.g., WebSockets).
      // We no longer simulate the upgrade on the client side.

    } catch (error) {
      console.error("Subscription failed:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Could not redirect to checkout.'}`);
    } finally {
      setIsSubscribing(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-gray-300 overflow-x-hidden">
      <div className="digital-incense"></div>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <HowItWorks />
        <Generator />
        <Pricing onSubscribe={handleSubscribe} isSubscribing={isSubscribing} />
      </main>
      <Footer />
    </div>
  );
};

export default App;