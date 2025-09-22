
import React from 'react';
import { PricingPlan } from '../types';
import { CheckIcon } from './icons';

const plans: PricingPlan[] = [
  {
    name: "Pilgrim",
    price: 2,
    generations: "50/month",
    features: ["No Watermark", "Standard Queue", "Community Support"],
    isFeatured: false,
  },
  {
    name: "Apostle",
    price: 5,
    generations: "200/month",
    features: ["No Watermark", "Priority Queue", "Email Support"],
    isFeatured: true,
  },
  {
    name: "Saint",
    price: 10,
    generations: "1,000/month",
    features: ["No Watermark", "High-Priority Queue", "Direct Support"],
    isFeatured: false,
  },
];

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => (
  <div className={`p-8 border rounded-lg flex flex-col ${plan.isFeatured ? 'border-red-500 neon-box bg-red-900/10' : 'border-red-900/50 bg-black/30'}`}>
    <h3 className="text-2xl font-gothic tracking-wider neon-text">{plan.name}</h3>
    <p className="mt-4">
      <span className="text-4xl font-bold">${plan.price}</span>
      <span className="text-gray-400">/month</span>
    </p>
    <p className="mt-1 text-red-400 font-semibold">{plan.generations}</p>
    <ul className="mt-6 space-y-3 text-gray-300 flex-grow">
      {plan.features.map(feature => (
        <li key={feature} className="flex items-center">
          <CheckIcon className="w-5 h-5 mr-2 text-red-500"/>
          {feature}
        </li>
      ))}
    </ul>
    <button className="mt-8 w-full py-3 px-6 bg-transparent text-white font-gothic text-xl tracking-wider border-2 border-red-600 rounded-lg hover:bg-red-800/50 hover:neon-text transition-all duration-300 disabled:opacity-50" title="Payments not implemented in this demo" disabled>
      Subscribe
    </button>
  </div>
);

export const Pricing: React.FC = () => {
  return (
    <section className="py-20" id="pricing">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-gothic tracking-wider neon-text">Choose Your Offering</h2>
        <p className="mt-4 text-gray-400">Unlock more blessings. All paid tiers are watermark-free.</p>
        <p className="text-xs mt-2 text-gray-500">(Note: Payments are not functional in this demo application)</p>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => <PricingCard key={plan.name} plan={plan} />)}
      </div>
    </section>
  );
};
