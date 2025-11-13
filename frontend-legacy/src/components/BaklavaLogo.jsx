import React from 'react';

const BaklavaLogo = ({ className = "w-36" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-red-700" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" opacity="0.3"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-red-700 leading-tight">Taze</span>
          <span className="text-lg font-bold text-yellow-600 leading-tight">Baklava</span>
        </div>
      </div>
    </div>
  );
};

export default BaklavaLogo;
