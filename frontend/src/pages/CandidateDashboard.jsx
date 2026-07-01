import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { StatCardSkeleton, JobCardSkeleton } from '../components/Skeletons';
import { Briefcase, Send, Bookmark, CheckCircle, Clock, XCircle, BarChart3, ArrowRight } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="glass-card rounded-2xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const statusConfig = {
  PENDING: { color: 'bg-amber-500', label: 'Pending' },
  REVIEWING: { color: 'bg-blue-500', label: 'Reviewing' },
  ACCEPTED: { color: 'bg-emerald-500', label: 'Accepted' },
  REJECTED: { color: 'bg-red-500', label: 'Rejected' },
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDash = async () => {
      try {
        const res = await dashboardService.getStats();
        setData(res.data);
      } catch { toast.error('Could not load dashboard'); }
      finally { setLoading(false); }
    };
    fetchDash();
  }, []);

  const stats = data?.stats || {};
  const breakdown = stats.applied_jobs_by_status || {};
  const totalApplied = stats.total_applied || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, <span className="text-primary-600 dark:text-primary-400">{user?.username}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your job search</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Applied" value={totalApplied} icon={Send} color="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" />
              <StatCard label="Saved Jobs" value={stats.total_saved || 0} icon={Bookmark} color="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" />
              <StatCard label="Accepted" value={breakdown.ACCEPTED || 0} icon={CheckCircle} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
              <StatCard label="Pending" value={breakdown.PENDING || 0} icon={Clock} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Status Chart */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={18} className="text-primary-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Application Status</h2>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-6 skeleton-bg rounded" />)}</div>
            ) : totalApplied === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <Send size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(statusConfig).map(([key, cfg]) => {
                  const count = breakdown[key] || 0;
                  const pct = totalApplied > 0 ? Math.round((count / totalApplied) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>{cfg.label}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div className={`h-full rounded-full ${cfg.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900 dark:text-white">Recent Applications</h2>
              <Link to="/applications" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 skeleton-bg rounded-xl" />)}</div>
            ) : (data?.recent_applications || []).length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Briefcase size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No recent applications</p>
                <Link to="/jobs" className="btn-primary mt-4 text-sm py-2 px-4 inline-flex">Find Jobs</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {(data.recent_applications || []).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-slate-800 dark:text-white">{app.job_details?.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{app.job_details?.company}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      app.status === 'REVIEWING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
