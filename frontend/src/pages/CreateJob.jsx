import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { jobService } from '../services/api';
import { toast } from '../components/Toast';
import { useEffect, useState } from 'react';
import { Loader2, Briefcase } from 'lucide-react';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const EXP_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead'];
const CATEGORIES = ['Technology', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Sales', 'Operations', 'HR', 'Legal', 'Other'];

const InputField = ({ label, id, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const CreateJob = () => {
  const { id } = useParams(); // If id present → edit mode
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const isEdit = !!id;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!isEdit) return;
    const fetchJob = async () => {
      try {
        const { data } = await jobService.getById(id);
        reset(data);
      } catch { toast.error('Could not load job'); navigate('/employer/jobs'); }
      finally { setFetching(false); }
    };
    fetchJob();
  }, [id, isEdit, navigate, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await jobService.update(id, data);
        toast.success('Job updated successfully!');
      } else {
        await jobService.create(data);
        toast.success('Job posted successfully!');
      }
      navigate('/employer/jobs');
    } catch (err) {
      const errData = err?.response?.data;
      if (errData) {
        const firstErr = Object.values(errData)[0];
        toast.error(Array.isArray(firstErr) ? firstErr[0] : String(firstErr));
      } else {
        toast.error('Failed to save job');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white">
              <Briefcase size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Job' : 'Post New Job'}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{isEdit ? 'Update your job posting details' : 'Fill in the details to attract top candidates'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-3xl p-8 space-y-5">
          <InputField label="Job Title *" id="title" error={errors.title}>
            <input id="title" placeholder="e.g. Senior React Developer" {...register('title', { required: 'Job title is required' })}
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.title ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`} />
          </InputField>

          <InputField label="Company Name *" id="company" error={errors.company}>
            <input id="company" placeholder="Your company name" {...register('company', { required: 'Company name is required' })}
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.company ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`} />
          </InputField>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Job Type *" id="job_type" error={errors.job_type}>
              <select id="job_type" {...register('job_type', { required: true })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </InputField>
            <InputField label="Experience Level *" id="experience_level" error={errors.experience_level}>
              <select id="experience_level" {...register('experience_level', { required: true })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </InputField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Location *" id="location" error={errors.location}>
              <input id="location" placeholder="New York, Remote..." {...register('location', { required: 'Location is required' })}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.location ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`} />
            </InputField>
            <InputField label="Salary (Annual, USD)" id="salary" error={errors.salary}>
              <input id="salary" type="number" placeholder="e.g. 120000" {...register('salary')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </InputField>
          </div>

          <InputField label="Category *" id="category" error={errors.category}>
            <select id="category" {...register('category', { required: 'Category is required' })}
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.category ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </InputField>

          <InputField label="Job Description *" id="description" error={errors.description}>
            <textarea id="description" rows={5} placeholder="Describe the role, responsibilities, and what you're looking for..." {...register('description', { required: 'Job description is required' })}
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-colors ${errors.description ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`} />
          </InputField>

          <InputField label="Requirements *" id="requirements" error={errors.requirements}>
            <textarea id="requirements" rows={4} placeholder="List skills, experience, or qualifications required..." {...register('requirements', { required: 'Requirements are required' })}
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-colors ${errors.requirements ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`} />
          </InputField>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/employer/jobs')} className="btn-secondary flex-1 py-3 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 rounded-xl" id="post-job-submit-btn">
              {loading ? <><Loader2 size={16} className="animate-spin" /> {isEdit ? 'Updating...' : 'Posting...'}</> : isEdit ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
