import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../services/api';
import JobCard from '../components/JobCard';
import { JobCardSkeleton } from '../components/Skeletons';
import { toast } from '../components/Toast';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const EXP_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead'];

const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    experience_level: searchParams.get('experience_level') || '',
    category: searchParams.get('category') || '',
    page: Number(searchParams.get('page') || 1),
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.job_type) params.job_type = filters.job_type;
      if (filters.experience_level) params.experience_level = filters.experience_level;
      if (filters.category) params.category = filters.category;
      params.page = filters.page;

      const { data } = await jobService.getAll(params);
      setJobs(data.results || data);
      if (data.count) setTotalPages(Math.ceil(data.count / 10));
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    setSearchParams((prev) => {
      if (value) prev.set(key, value); else prev.delete(key);
      prev.delete('page');
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '', job_type: '', experience_level: '', category: '', page: 1 });
    setSearchParams({});
  };

  const hasFilters = filters.location || filters.job_type || filters.experience_level || filters.category;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-2">Find Your Next Opportunity</h1>
          <p className="text-primary-200 text-center mb-8">Search across thousands of jobs from top companies</p>
          <div className="flex gap-3 bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search size={20} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords, company..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm"
                id="job-search-input"
              />
              {filters.search && (
                <button onClick={() => updateFilter('search', '')} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
            >
              <SlidersHorizontal size={16} />
              Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-secondary-500" />}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Location */}
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-primary-200 border border-white/20 text-sm focus:outline-none focus:border-white/50"
              />
              {/* Job Type */}
              <select
                value={filters.job_type}
                onChange={(e) => updateFilter('job_type', e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/20 text-sm focus:outline-none focus:border-white/50"
              >
                <option value="">Any Type</option>
                {JOB_TYPES.map((t) => <option key={t} value={t} className="text-slate-900">{t}</option>)}
              </select>
              {/* Experience Level */}
              <select
                value={filters.experience_level}
                onChange={(e) => updateFilter('experience_level', e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/20 text-sm focus:outline-none focus:border-white/50"
              >
                <option value="">Any Level</option>
                {EXP_LEVELS.map((l) => <option key={l} value={l} className="text-slate-900">{l}</option>)}
              </select>
              {/* Clear */}
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 text-white border border-white/20 text-sm hover:bg-white/30 transition-colors">
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? 'Searching...' : `${jobs.length} jobs found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No jobs found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {jobs.map((job) => <JobCard key={job.id} job={job} onSaveToggle={fetchJobs} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
              disabled={filters.page <= 1}
              className="btn-secondary py-2 px-4 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Page {filters.page} of {totalPages}
            </span>
            <button
              onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
              disabled={filters.page >= totalPages}
              className="btn-secondary py-2 px-4 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
