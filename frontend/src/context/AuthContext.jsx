import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// 1. Create a Context. This is like a global variable storage for our React app.
// We use it so we don't have to pass 'user' and 'login' functions through every single component.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 2. Define our state. 
  // 'user' holds the current logged-in user's details (like name, role).
  const [user, setUser] = useState(null);
  // 'loading' helps us wait to show the page until we've checked if the user is already logged in.
  const [loading, setLoading] = useState(true);

  // 3. When the app first loads, check if the user is already logged in
  useEffect(() => {
    // We look in the browser's localStorage for saved user details
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        // We parse the string back into an object and save it to our state
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // If something goes wrong, we clear the bad data
        localStorage.clear();
      }
    }
    
    // We are done checking, so stop loading!
    setLoading(false);
  }, []);

  // 4. The Login Function
  // We use our authService to call the backend API, and then we save the tokens and user details.
  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    
    // Save tokens to localStorage so the user stays logged in if they refresh the page
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    // Save user details to localStorage and also to our React state
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    
    return data.user;
  };

  // 5. The Register Function
  const register = async (formData) => {
    const { data } = await authService.register(formData);
    return data;
  };

  // 6. The Logout Function
  // We clear everything from localStorage and set our user state back to null.
  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      // Tell the backend to invalidate (destroy) our token if possible
      if (refresh) {
        await authService.logout(refresh);
      }
    } catch (error) {
      // If the backend call fails, we ignore it because we are logging out locally anyway
    }
    
    // Clear all saved data from the browser
    localStorage.clear();
    // Update React state to show the user as logged out
    setUser(null);
  };

  // 7. Update User Profile
  // We use this when the user edits their profile to keep our global state in sync
  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      // Combine the old user data with the new fields
      const updatedUser = { ...prevUser, ...updatedFields };
      // Save it back to local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // 8. Provide all these values and functions to the rest of our app
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        updateUser, 
        isAuthenticated: !!user // This turns user into a true/false value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 9. A custom hook to make using this context super easy!
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside the AuthProvider');
  }
  return context;
};

