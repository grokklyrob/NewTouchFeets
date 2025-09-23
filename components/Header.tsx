import React from 'react';
import { CrossIcon } from './icons';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { user, signIn, signOut, isLoading } = useAuth();

  const renderAuthButton = () => {
    if (isLoading) {
      return <div className="w-40 h-10 bg-gray-800/50 rounded-lg animate-pulse"></div>;
    }

    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.tier.toUpperCase()}</p>
          </div>
          <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-red-800"/>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-transparent border border-red-800 text-red-400 rounded-lg hover:bg-red-900/50 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={signIn}
        className="px-6 py-2 bg-red-800/50 text-white font-semibold border-2 border-red-600 rounded-lg hover:bg-red-700 hover:neon-text transition-all"
      >
        Sign In
      </button>
    );
  };

  return (
    <header className="py-4 border-b border-red-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <CrossIcon className="w-8 h-8 text-red-500 neon-text" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-gothic tracking-wider neon-text">Touch Feets</h1>
            <p className="text-xs sm:text-sm text-gray-400 tracking-widest">Let the Savior Touch Your Soles</p>
          </div>
        </div>
        <div>
          {renderAuthButton()}
        </div>
      </div>
    </header>
  );
};