export default function JDMatchScoreCard({ score }: { score: number }) {
  const getProgressBarColor = () => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-orange-600";
    return "bg-red-600";
  };
  return (
    <div className="bg-card border border-gray-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">Match Score</h3>
        <span className="text-3xl font-bold">{score}%</span>
      </div>
      <div className="mt-4 w-full bg-gray-50 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
