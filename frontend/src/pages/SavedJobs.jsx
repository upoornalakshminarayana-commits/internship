import { useState, useEffect } from 'react';
import { jobService } from '../services/api';
import JobCard from '../components/JobCard';
import { JobCardSkeleton } from '../components/Skeletons';
import { toast } from '../components/Toast';
import { Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const { data } = await jobService.getSaved();
      const savedItems = data.results || data;
      setJobs(savedItems.map((s) => ({ ...s.job_details, is_saved: true, _savedId: s.id })));
    } catch { toast.error('Failed to load saved jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSaved(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark size={24} className="text-primary-500" /> Saved Jobs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{jobs.length} saved job{jobs.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <Bookmark size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">No saved jobs yet</h3>
            <p className="text-sm text-slate-400 mb-6">Browse jobs and click the bookmark icon to save them here</p>
            <Link to="/jobs" className="btn-primary text-sm py-2 px-5 inline-flex"><Search size={14} /> Find Jobs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onSaveToggle={fetchSaved} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
