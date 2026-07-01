export const JobCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 skeleton-bg rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 skeleton-bg rounded w-3/4" />
        <div className="h-4 skeleton-bg rounded w-1/2" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-4 skeleton-bg rounded w-full" />
      <div className="h-4 skeleton-bg rounded w-5/6" />
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-6 w-20 skeleton-bg rounded-full" />
      <div className="h-6 w-24 skeleton-bg rounded-full" />
      <div className="h-6 w-16 skeleton-bg rounded-full" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 w-24 skeleton-bg rounded mb-2" />
        <div className="h-8 w-16 skeleton-bg rounded" />
      </div>
      <div className="w-12 h-12 skeleton-bg rounded-xl" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 skeleton-bg rounded-full" />
      <div className="space-y-2">
        <div className="h-6 w-40 skeleton-bg rounded" />
        <div className="h-4 w-28 skeleton-bg rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 skeleton-bg rounded" />
      <div className="h-4 skeleton-bg rounded w-5/6" />
      <div className="h-4 skeleton-bg rounded w-4/6" />
    </div>
  </div>
);
