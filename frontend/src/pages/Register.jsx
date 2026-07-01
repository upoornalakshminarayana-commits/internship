import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { Briefcase, Eye, EyeOff, Loader2, UserCheck, Building2 } from 'lucide-react';

const Register = () => {
  // 1. Get our register function from the AuthContext
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  // 2. Simple State Variables for our form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // This state tracks whether they are signing up as an Employer or a Job Seeker
  const [selectedRole, setSelectedRole] = useState('JOBSEEKER');
  
  // UI states
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 3. Form submission handler
  const onSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing

    // Basic Validation
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError(''); // Clear past errors

    try {
      // 4. Send the data to the backend using our AuthContext function
      await registerUser({ 
        username, 
        email, 
        password, 
        role: selectedRole 
      });
      
      toast.success('Account created! Please log in.');
      navigate('/login'); // Redirect them to login so they can use their new account
      
    } catch (err) {
      // Show error messages from the backend if something went wrong
      const errData = err?.response?.data;
      if (errData) {
        // Grab the first error message sent by the server
        const firstErr = Object.values(errData)[0];
        const msg = Array.isArray(firstErr) ? firstErr[0] : firstErr;
        setError(msg);
        toast.error(msg);
      } else {
        setError('Registration failed. Please try again.');
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20 dark:from-darkBg dark:via-slate-900 dark:to-slate-900">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg mb-4">
              <Briefcase size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join CareerConnect AI — it's free</p>
          </div>

          {/* 5. Role Selector Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('JOBSEEKER')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${selectedRole === 'JOBSEEKER' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <UserCheck size={16} /> Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('EMPLOYER')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${selectedRole === 'EMPLOYER' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <Building2 size={16} /> Employer
            </button>
          </div>

          {/* 6. Our Simplified Form */}
          <form onSubmit={onSubmit} className="space-y-4" id="register-form">
            
            {/* Display error message if there is one */}
            {error && (
              <div className="p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
              <input
                id="register-username"
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors dark:border-slate-700"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors dark:border-slate-700"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors dark:border-slate-700"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" id="register-submit-btn" disabled={loading} className="btn-primary w-full py-3 text-base rounded-xl">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : `Create ${selectedRole === 'EMPLOYER' ? 'Employer' : 'Job Seeker'} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

