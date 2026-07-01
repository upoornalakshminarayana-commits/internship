import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { MapPin, DollarSign, Clock, Briefcase, Building2, ExternalLink, Bookmark, BookmarkCheck, Send, Loader2, X } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    REVIEWING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ACCEPTED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobService.getById(id);
        setJob(data);
        setSaved(data.is_saved);
      } catch {
        toast.error('Could not load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      if (saved) { await jobService.unsaveJob(id); setSaved(false); toast.info('Removed from saved'); }
      else { await jobService.saveJob(id); setSaved(true); toast.success('Job saved!'); }
    } catch (e) { toast.error(e?.response?.data?.error || 'Could not update'); }
  };

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'JOBSEEKER') { toast.warning('Only job seekers can apply'); return; }
    setApplying(true);
    try {
      await applicationService.apply({ job: id, cover_letter: coverLetter, resume: resumeFile });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setHasApplied(true);
    } catch (e) {
      const msg = e?.response?.data?.non_field_errors?.[0] || e?.response?.data?.detail || 'Application failed';
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!job) return null;

  const timeAgo = (dateStr) => {
    const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="glass-card rounded-3xl p-8 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
              <Building2 size={30} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{job.title}</h1>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><Building2 size={14} />{job.company}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase size={14} />{job.job_type}</span>
            <span className="flex items-center gap-1.5"><DollarSign size={14} />{job.salary ? `$${Number(job.salary).toLocaleString()}/yr` : 'Not disclosed'}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} />{timeAgo(job.created_at)}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium">{job.experience_level} Level</span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-medium">{job.category}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {user?.role === 'JOBSEEKER' && (
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={hasApplied}
                className="btn-primary py-2.5 px-6 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
                id="apply-btn"
              >
                {hasApplied ? <><Send size={16} /> Applied</> : <><Send size={16} /> Apply Now</>}
              </button>
            )}
            <button onClick={handleSave} className={`btn-secondary py-2.5 px-4 rounded-xl ${saved ? 'border-primary-500 text-primary-600 dark:text-primary-400' : ''}`} id="save-job-btn">
              {saved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save Job</>}
            </button>
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">Job Description</h2>
              <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">{job.description}</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">Requirements</h2>
              <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">{job.requirements}</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="glass-card rounded-2xl p-6 h-fit">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">About the Employer</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Building2 size={18} />
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white text-sm">{job.employer?.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{job.employer?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Apply for {job.title}</h2>
              <button onClick={() => setShowApplyModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cover Letter</label>
                <textarea
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Resume (PDF, DOC) — Optional</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-900/30 dark:file:text-primary-300 hover:file:bg-primary-100"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowApplyModal(false)} className="btn-secondary flex-1 py-2.5 rounded-xl">Cancel</button>
              <button onClick={handleApply} disabled={applying} className="btn-primary flex-1 py-2.5 rounded-xl" id="submit-application-btn">
                {applying ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit Application</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
