import { useState, useEffect } from 'react';
import { applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { Send, MapPin, Briefcase, Clock, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  REVIEWING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ACCEPTED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_OPTIONS = ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED'];

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const isEmployer = user?.role === 'EMPLOYER';

  const fetchApplications = async () => {
    try {
      const { data } = await applicationService.getAll();
      setApplications(data.results || data);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await applicationService.updateStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchApplications();
    } catch { toast.error('Failed to update status'); }
    finally { setUpdatingId(null); }
  };

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await applicationService.delete(id);
      toast.success('Application withdrawn');
      fetchApplications();
    } catch { toast.error('Could not withdraw application'); }
  };

  const timeAgo = (dateStr) => {
    const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEmployer ? 'All Applications' : 'My Applications'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 skeleton-bg rounded-2xl" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <Send size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">No applications yet</h3>
            {!isEmployer && (
              <Link to="/jobs" className="btn-primary mt-4 text-sm py-2 px-5 inline-flex">Browse Jobs</Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={`/jobs/${app.job_details?.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors block truncate">
                          {app.job_details?.title}
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {app.job_details?.company} · {app.job_details?.location}
                        </p>
                        {isEmployer && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                            Applicant: {app.applicant_details?.username}
                          </p>
                        )}
                      </div>

                      {/* Status */}
                      {isEmployer ? (
                        <select
                          value={app.status}
                          disabled={updatingId === app.id}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0 ${statusColors[app.status]}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Clock size={12} /> Applied {timeAgo(app.applied_at)}</span>
                        {app.job_details?.job_type && <span className="flex items-center gap-1"><Briefcase size={12} />{app.job_details.job_type}</span>}
                      </div>
                      {!isEmployer && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
                        >
                          <Trash2 size={12} /> Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
