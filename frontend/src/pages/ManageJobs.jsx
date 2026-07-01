import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/api';
import { toast } from '../components/Toast';
import { Briefcase, MapPin, Edit2, Trash2, Plus, Eye } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      // Get all jobs by this employer - filter client-side isn't needed 
      // since the API returns only employer's own jobs when authenticated as employer
      const { data } = await jobService.getAll({ page_size: 100 });
      setJobs(data.results || data);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await jobService.delete(id);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch { toast.error('Could not delete job'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Jobs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
          </div>
          <Link to="/employer/create-job" className="btn-primary py-2.5 px-5 rounded-xl" id="new-job-btn">
            <Plus size={16} /> Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 skeleton-bg rounded-2xl" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <Briefcase size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">No jobs posted yet</h3>
            <Link to="/employer/create-job" className="btn-primary mt-4 text-sm py-2 px-5 inline-flex"><Plus size={14} /> Post Your First Job</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                  <Briefcase size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/jobs/${job.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors block truncate">
                    {job.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                    <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">{job.job_type}</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">{job.experience_level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/jobs/${job.id}`} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors" title="View">
                    <Eye size={16} />
                  </Link>
                  <Link to={`/employer/edit-job/${job.id}`} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </Link>
                  <button onClick={() => handleDelete(job.id, job.title)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
