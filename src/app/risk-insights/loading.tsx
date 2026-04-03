export default function RiskInsightsLoading() {
  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      <div className="space-y-2">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-80" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-xl" />
        ))}
      </div>
      <div className="skeleton h-72 rounded-xl" />
      <div className="grid grid-cols-2 gap-6">
        <div className="skeleton h-48 rounded-xl" />
        <div className="skeleton h-48 rounded-xl" />
      </div>
    </div>
  );
}
