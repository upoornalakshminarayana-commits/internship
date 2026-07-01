import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { StatCardSkeleton } from '../components/Skeletons';
import { Briefcase, Users, CheckCircle, Clock, ArrowRight, Plus, BarChart3, TrendingUp } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="glass-card rounded-2xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon size={22} /></div>
    </div>
  </div>
);

const STATUS_OPTIONS = ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED'];
const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  REVIEWING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ACCEPTED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const EmployerDashboard = () => {
  const { user } = useAuth();
  // 1. State to hold the data we get from the backend
  const [data, setData] = useState(null);
  
  // 2. State to show a loading spinner while we wait for the data
  const [loading, setLoading] = useState(true);
  
  // 3. State to track which application we are currently updating
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // 4. useEffect runs this code automatically when the page first loads
  useEffect(() => {
    // We create an async function because fetching data from the internet takes time
    const fetchDash = async () => {
      try {
        // Call our simplified dashboard service (which uses fetch behind the scenes)
        const res = await dashboardService.getStats();
        
        // Save the data to our state so React can display it on the screen
        setData(res.data);
      } catch { 
        toast.error('Could not load dashboard'); 
      } finally { 
        // Whether it succeeded or failed, stop the loading spinner
        setLoading(false); 
      }
    };
    
    // Actually call the function we just created
    fetchDash();
  }, []); // The empty array [] means "Only run this once when the page loads"

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdatingStatus(appId);
    try {
      await applicationService.updateStatus(appId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      // Refresh dashboard
      const res = await dashboardService.getStats();
      setData(res.data);
    } catch { toast.error('Could not update status'); }
    finally { setUpdatingStatus(null); }
  };

  const stats = data?.stats || {};
  const breakdown = stats.applications_by_status || {};
  const totalApps = stats.total_applications_received || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Employer Dashboard, <span className="text-primary-600 dark:text-primary-400">{user?.username}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your job postings and applicants</p>
          </div>
          <Link to="/employer/create-job" className="btn-primary py-2.5 px-5 rounded-xl" id="create-job-btn">
            <Plus size={16} /> Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Jobs Posted" value={stats.total_jobs_posted || 0} icon={Briefcase} color="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" />
              <StatCard label="Total Applicants" value={totalApps} icon={Users} color="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" />
              <StatCard label="Accepted" value={breakdown.ACCEPTED || 0} icon={CheckCircle} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
              <StatCard label="Pending Review" value={breakdown.PENDING || 0} icon={Clock} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown Bar Chart */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={18} className="text-primary-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Applications by Status</h2>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-6 skeleton-bg rounded" />)}</div>
            ) : totalApps === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No applications yet</p>
            ) : (
              <div className="space-y-3">
                {[['PENDING', 'amber'], ['REVIEWING', 'blue'], ['ACCEPTED', 'emerald'], ['REJECTED', 'red']].map(([key, color]) => {
                  const count = breakdown[key] || 0;
                  const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>{key}</span><span>{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                        <div className={`h-full rounded-full bg-${color}-500 transition-all duration-700`} style={{ width: `${pct}%` }} />
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
              <Link to="/employer/applicants" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 skeleton-bg rounded-xl" />)}</div>
            ) : (data?.recent_applications || []).length === 0 ? (
              <div className="text-center py-8">
                <Users size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-400">No applications yet. Post a job to start receiving applications.</p>
                <Link to="/employer/create-job" className="btn-primary mt-4 text-sm py-2 px-4 inline-flex">Post a Job</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {(data.recent_applications || []).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div>
                      <p className="font-medium text-sm text-slate-800 dark:text-white">{app.applicant_details?.username}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{app.job_details?.title}</p>
                    </div>
                    <select
                      value={app.status}
                      disabled={updatingStatus === app.id}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${statusColors[app.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="glass-card rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Your Job Postings</h2>
            </div>
            <Link to="/employer/jobs" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">Manage all <ArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 skeleton-bg rounded-xl" />)}</div>
          ) : (data?.recent_jobs || []).length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No jobs posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(data.recent_jobs || []).map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                    <Briefcase size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-800 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{job.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{job.location} · {job.job_type}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
