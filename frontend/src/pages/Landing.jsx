import { Link } from 'react-router-dom';
import { ArrowRight, Search, Briefcase, Users, TrendingUp, Star, CheckCircle, Zap } from 'lucide-react';

const stats = [
  { label: 'Jobs Posted', value: '50K+' },
  { label: 'Companies', value: '12K+' },
  { label: 'Candidates', value: '200K+' },
  { label: 'Placements', value: '98K+' },
];

const features = [
  { icon: Search, title: 'Smart Job Search', desc: 'AI-powered search with advanced filters to find your perfect role quickly.' },
  { icon: Zap, title: 'Instant Apply', desc: 'One-click apply with your profile and resume already saved to your account.' },
  { icon: TrendingUp, title: 'Track Progress', desc: 'Real-time dashboard showing your application status and employer actions.' },
  { icon: Users, title: 'Candidate Discovery', desc: 'Employers can search and shortlist top talent across every skill category.' },
];

const categories = [
  { name: 'Technology', icon: '💻', count: '8,200+' },
  { name: 'Design', icon: '🎨', count: '3,100+' },
  { name: 'Marketing', icon: '📢', count: '2,400+' },
  { name: 'Finance', icon: '💰', count: '1,900+' },
  { name: 'Healthcare', icon: '🏥', count: '4,500+' },
  { name: 'Education', icon: '📚', count: '2,800+' },
  { name: 'Engineering', icon: '⚙️', count: '5,100+' },
  { name: 'Sales', icon: '📈', count: '3,300+' },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/40 to-secondary-50/20 dark:from-darkBg dark:via-slate-900 dark:to-slate-900 py-24 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
            <Star size={14} className="fill-current" />
            The #1 AI-Powered Job Board Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-sans tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
            Find Your Dream Job<br />
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            CareerConnect AI connects talented professionals with world-class employers.
            Search thousands of jobs, apply instantly, and track your success — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/jobs" className="btn-primary text-base py-3 px-8 rounded-2xl shadow-lg shadow-primary-600/20">
              Find Jobs <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-secondary text-base py-3 px-8 rounded-2xl">
              Post a Job <Briefcase size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map(({ label, value }) => (
              <div key={label} className="glass-card rounded-2xl p-5 text-center">
                <div className="text-3xl font-bold font-sans text-primary-600 dark:text-primary-400">{value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Browse by Category</h2>
            <p className="text-slate-500 dark:text-slate-400">Explore opportunities across every major industry</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(({ name, icon, count }) => (
              <Link
                key={name}
                to={`/jobs?category=${encodeURIComponent(name)}`}
                className="glass-card glass-card-hover rounded-2xl p-5 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{icon}</div>
                <div className="font-semibold text-slate-800 dark:text-white text-sm">{name}</div>
                <div className="text-xs text-slate-400 mt-1">{count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-darkCard dark:to-darkBg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Everything You Need</h2>
            <p className="text-slate-500 dark:text-slate-400">Powerful tools for both job seekers and employers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card glass-card-hover rounded-2xl p-6 group">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center shadow-2xl shadow-primary-900/30">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative">Ready to Get Started?</h2>
            <p className="text-primary-100 mb-8 text-lg relative">Join over 200,000 professionals who found their next opportunity on CareerConnect AI.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <Link to="/register" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3 rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Create Free Account
              </Link>
              <Link to="/jobs" className="border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-2xl transition-colors flex items-center justify-center gap-2">
                Browse Jobs <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
