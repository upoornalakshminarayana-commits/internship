import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, DollarSign, Bookmark, BookmarkCheck, Building2 } from 'lucide-react';
import { jobService } from '../services/api';
import { toast } from './Toast';
import { useState } from 'react';

const typeColors = {
  'Full-time': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Part-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Remote': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'Contract': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Internship': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
};

const levelColors = {
  'Entry': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  'Mid': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Senior': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Lead': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const JobCard = ({ job, showSave = true, onSaveToggle }) => {
  const [saved, setSaved] = useState(job.is_saved);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      if (saved) {
        await jobService.unsaveJob(job.id);
        setSaved(false);
        toast.info('Job removed from saved list');
      } else {
        await jobService.saveJob(job.id);
        setSaved(true);
        toast.success('Job saved!');
      }
      onSaveToggle?.();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Could not update saved status');
    } finally {
      setSaving(false);
    }
  };

  const salaryText = job.salary
    ? `$${Number(job.salary).toLocaleString()}/yr`
    : 'Salary not disclosed';

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col gap-4 block group"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0 group-hover:scale-105 transition-transform">
          <Building2 size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{job.company}</p>
        </div>
        {showSave && (
          <button
            onClick={handleSave}
            disabled={saving}
            className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' : 'text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'}`}
            aria-label={saved ? 'Unsave job' : 'Save job'}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[job.job_type] || 'bg-slate-100 text-slate-600'}`}>
          {job.job_type}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[job.experience_level] || 'bg-slate-100 text-slate-600'}`}>
          {job.experience_level}
        </span>
        {job.category && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {job.category}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5"><MapPin size={13} />{job.location}</span>
        <span className="flex items-center gap-1.5"><DollarSign size={13} />{salaryText}</span>
        <span className="flex items-center gap-1.5 ml-auto"><Clock size={13} />{timeAgo(job.created_at)}</span>
      </div>
    </Link>
  );
};

export default JobCard;
