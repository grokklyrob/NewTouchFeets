
import React from 'react';
import { CrossIcon } from './icons';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-red-900/50 mt-20 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <div className="flex justify-center items-center space-x-2">
          <CrossIcon className="w-6 h-6 text-red-800" />
          <p className="font-gothic text-xl tracking-wider text-gray-400">Touch Feets</p>
          <CrossIcon className="w-6 h-6 text-red-800" />
        </div>
        <p className="mt-4 text-sm">
          Where technology meets theology. A digital homage to the sacred.
        </p>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()} Touch Feets. All rights reserved. This is a fictional application.
        </p>
      </div>
    </footer>
  );
};
