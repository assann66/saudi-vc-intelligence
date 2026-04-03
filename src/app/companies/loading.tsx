export default function CompaniesLoading() {
  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      <div className="space-y-2">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-80" />
      </div>
      <div className="flex gap-3 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-10 w-24 rounded-lg" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
