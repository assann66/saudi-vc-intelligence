export default function CompareLoading() {
  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      <div className="space-y-2">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="skeleton h-12 rounded-lg" />
        <div className="skeleton h-12 rounded-lg" />
      </div>
      <div className="skeleton h-96 rounded-xl" />
    </div>
  );
}
