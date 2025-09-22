
import React from 'react';

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="relative p-6 bg-black/30 border border-red-900/50 rounded-lg backdrop-blur-sm transition-all duration-300 hover:border-red-600 hover:neon-box">
    <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center bg-[#0a0a0a] border-2 border-red-700 rounded-full font-gothic text-2xl text-red-500 neon-text">
      {number}
    </div>
    <h3 className="mt-4 text-xl font-gothic text-red-400">{title}</h3>
    <p className="mt-2 text-gray-400">{description}</p>
  </div>
);

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20" id="how-it-works">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-gothic tracking-wider neon-text">The Path to Salvation</h2>
        <p className="mt-4 text-gray-400">A simple, three-step pilgrimage.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <StepCard 
          number="I"
          title="Offer Your Image"
          description="Select and upload a clear photo featuring bare feet. Our system respects your privacy and focuses only on the sacred task."
        />
        <StepCard 
          number="II"
          title="Invoke the AI"
          description="With a single click, our 'Nano Banana' model begins its divine work, guided by a prompt crafted for reverence and artistry."
        />
        <StepCard 
          number="III"
          title="Receive Your Blessing"
          description="Behold the generated image—a unique, AI-crafted masterpiece. Download and share this testament of digital grace."
        />
      </div>
    </section>
  );
};
