import React from 'react';
import { Zap } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-dark-800/50 rounded-2xl border border-neon-cyan/30">
            <Zap className="h-12 w-12 text-neon-cyan animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">GameHost</h2>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;