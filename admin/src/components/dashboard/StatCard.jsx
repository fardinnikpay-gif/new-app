import Skeleton from "../ui/Skeleton";

export default function StatCard({ title, value, icon: Icon, hint, loading = false }) {
  return (
    <div aria-busy={loading || undefined} className="rounded-lg bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && (
          <span className="rounded-lg bg-primary/10 p-2 text-primary-dark">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-24" />
      ) : (
        <>
          <p className="mt-3 truncate text-2xl font-bold text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </>
      )}
    </div>
  );
}