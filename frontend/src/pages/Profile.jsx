import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { ProfileSkeleton } from '../components/Skeletons';
import { User, Mail, Phone, Globe, Link as LinkIcon, Building2, Save, Loader2, Upload } from 'lucide-react';

const InputField = ({ label, id, icon: Icon, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
    <div className="relative">
      {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={16} /></div>}
      <input
        id={id}
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${error ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isEmployer = user?.role === 'EMPLOYER';

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileService.get();
        setProfile(data);
        reset(data);
      } catch { toast.error('Could not load profile'); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { data: updated } = await profileService.update(data);
      setProfile(updated);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Could not save profile'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4"><ProfileSkeleton /><ProfileSkeleton /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.username}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{user?.email}</p>
              <span className={`mt-2 inline-flex text-xs font-semibold px-3 py-1 rounded-full ${isEmployer ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300'}`}>
                {isEmployer ? 'Employer' : 'Job Seeker'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-3xl p-8 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {isEmployer ? 'Company Information' : 'Personal Information'}
          </h2>

          {isEmployer ? (
            <>
              <InputField label="Company Name" id="company_name" icon={Building2} placeholder="Acme Corp" {...register('company_name')} />
              <InputField label="Website" id="website" icon={Globe} placeholder="https://company.com" type="url" {...register('website')} />
              <InputField label="Industry" id="industry" icon={Building2} placeholder="Technology, Finance..." {...register('industry')} />
              <InputField label="Location" id="location" icon={Globe} placeholder="New York, Remote..." {...register('location')} />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea rows={4} {...register('description')} placeholder="Tell candidates about your company..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
            </>
          ) : (
            <>
              <InputField label="Phone" id="phone" icon={Phone} placeholder="+1 (555) 000-0000" type="tel" {...register('phone')} />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Skills</label>
                <input placeholder="Python, Django, React, PostgreSQL..." {...register('skills')} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <p className="text-xs text-slate-400 mt-1">Comma-separated skills</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Education</label>
                <textarea rows={3} {...register('education')} placeholder="B.Sc Computer Science, MIT 2022..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Experience</label>
                <textarea rows={3} {...register('experience')} placeholder="3 years at Startup X as a Full Stack Developer..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <InputField label="GitHub Profile URL" id="github" icon={LinkIcon} placeholder="https://github.com/yourname" type="url" {...register('github')} />
              <InputField label="LinkedIn Profile URL" id="linkedin" icon={LinkIcon} placeholder="https://linkedin.com/in/yourname" type="url" {...register('linkedin')} />

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Resume (PDF / DOC)</label>
                {profile?.resume && (
                  <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 mb-2">
                    <Upload size={14} />
                    <a href={profile.resume} target="_blank" rel="noreferrer" className="hover:underline">Current resume</a>
                  </div>
                )}
                <input type="file" accept=".pdf,.doc,.docx" {...register('resume')} className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-900/30 dark:file:text-primary-300" />
              </div>
            </>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 rounded-xl" id="save-profile-btn">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
