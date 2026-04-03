export default function RankingsLoading() {
  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      <div className="space-y-2">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-80" />
      </div>
      <div className="skeleton h-12 w-full rounded-lg" />
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
