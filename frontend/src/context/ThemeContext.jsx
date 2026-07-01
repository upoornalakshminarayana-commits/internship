import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create a Context to store our current theme (light or dark)
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // 2. We set up our state to track if we are in Dark Mode or not.
  const [isDark, setIsDark] = useState(() => {
    // First, check if the user previously chose a theme and saved it
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If they never chose a theme, we check their computer's default preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 3. Every time 'isDark' changes, this code runs automatically
  useEffect(() => {
    if (isDark) {
      // Add 'dark' class to the main HTML tag so Tailwind CSS knows to use dark colors
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      // Save their choice so we remember it next time they visit
      localStorage.setItem('theme', 'dark');
    } else {
      // Remove the 'dark' class to go back to light mode
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]); // The array here tells React: "Only run this effect when isDark changes"

  // 4. A simple function to flip the theme from dark to light, or light to dark
  const toggleTheme = () => {
    setIsDark((previousState) => !previousState);
  };

  // 5. Provide the theme state and the toggle function to all components inside
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 6. A custom hook to easily use the theme in any component
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
};

