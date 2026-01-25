import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun icon */}
        <Sun
          size={24}
          className={`absolute top-0 left-0 text-yellow-500 transition-all duration-500 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0' 
              : 'opacity-0 rotate-90'
          }`}
        />
        
        {/* Moon icon */}
        <Moon
          size={24}
          className={`absolute top-0 left-0 text-blue-400 transition-all duration-500 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0' 
              : 'opacity-0 -rotate-90'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
