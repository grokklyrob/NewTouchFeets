
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Generator } from './components/Generator';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { UserTier } from './types';


const App: React.FC = () => {
  const [userTier, setUserTier] = useState<UserTier>('free');

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-gray-300 overflow-x-hidden">
      <div className="digital-incense"></div>
      <Header userTier={userTier} setUserTier={setUserTier} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <HowItWorks />
        <Generator userTier={userTier} />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;
