
import React from 'react';
import { CrossIcon } from './icons';
import { UserTier } from '../types';

interface HeaderProps {
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;
}

export const Header: React.FC<HeaderProps> = ({ userTier, setUserTier }) => {
  const isPaid = userTier === 'paid';

  return (
    <header className="py-6 border-b border-red-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <CrossIcon className="w-8 h-8 text-red-500 neon-text" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-gothic tracking-wider neon-text">Touch Feets</h1>
            <p className="text-xs sm:text-sm text-gray-400 tracking-widest">Let the Savior Touch Your Soles</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 hidden sm:inline">Demo Mode:</span>
          <div className="relative inline-block w-32 text-left">
              <label className="flex items-center cursor-pointer">
                  <div className="relative">
                      <input type="checkbox" className="sr-only" checked={isPaid} onChange={() => setUserTier(isPaid ? 'free' : 'paid')} />
                      <div className="block bg-gray-800 border border-red-900 w-14 h-8 rounded-full"></div>
                      <div className={`dot absolute left-1 top-1 bg-red-500 w-6 h-6 rounded-full transition-transform ${isPaid ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-300 font-semibold">
                      {isPaid ? 'Paid' : 'Free'}
                  </div>
              </label>
          </div>
        </div>
      </div>
    </header>
  );
};
