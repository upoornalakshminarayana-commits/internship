import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { Briefcase, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  // 1. Get our login function from the AuthContext we just simplified
  const { login } = useAuth();
  
  // 2. React Router's hook to help us navigate to a different page after logging in
  const navigate = useNavigate();
  
  // 3. Simple State Variables (Replacing the complex react-hook-form)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // States for UI feedback
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 4. The function that runs when the user clicks "Sign In"
  const onSubmit = async (e) => {
    // Prevent the default browser form submission (which reloads the whole page)
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      // Pass the username and password to our AuthContext login function
      const user = await login({ username, password });
      
      toast.success(`Welcome back, ${user.username}!`);
      
      // Redirect them to their specific dashboard based on their role
      if (user.role === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // If the login fails (wrong password, etc.), show the error message
      const msg = err?.response?.data?.detail || 'Invalid credentials. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      // Stop the loading spinner whether it succeeded or failed
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20 dark:from-darkBg dark:via-slate-900 dark:to-slate-900">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg mb-4">
              <Briefcase size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your CareerConnect AI account</p>
          </div>

          {/* 5. Our simplified form. Notice the onSubmit handler. */}
          <form onSubmit={onSubmit} className="space-y-5" id="login-form">
            
            {/* Display error message if there is one */}
            {error && (
              <div className="p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div>
              <label htmlFor="login-username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                placeholder="yourname"
                // Link the input to our state variable
                value={username}
                // When the user types, update the state variable
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="btn-primary w-full py-3 text-base rounded-xl"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

