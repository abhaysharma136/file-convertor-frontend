interface ATSScoreCardProps {
  score: number;
}
export default function ATSScoreCard({ score }: ATSScoreCardProps) {
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Poor";
  };

  const getScoreBg = () => {
    if (score >= 80) return "bg-green-600/10";
    if (score >= 60) return "bg-orange-600/10";
    return "bg-red-600/10";
  };

  const getProgressBarColor = () => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-orange-600";
    return "bg-red-600";
  };
  return (
    <div className="w-full text-center p-6 rounded-lg bg-white border border-gray-100">
      <p className="text-sm font-medium text-muted-foreground mb-3">
        ATS Compatibility Score
      </p>
      <div
        className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg()}`}
      >
        <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}</span>
      </div>
      <p className={`mt-3 text-sm font-medium ${getScoreColor()}`}>
        {getScoreLabel()}
      </p>
      <div className="mt-4 w-full bg-gray-50 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
