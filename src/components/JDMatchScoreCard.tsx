export default function JDMatchScoreCard({
  score,
  pillars,
}: {
  score: number;
  pillars?: {
    technical_skills: number;
    experience_alignment: number;
    seniority_fit: number;
  };
}) {
  const getProgressBarColor = (val: number) => {
    if (val >= 80) return "bg-green-600";
    if (val >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            Overall Match Score
          </h3>
          <p className="text-xs text-muted-foreground">
            Based on structural alignment
          </p>
        </div>
        <span
          className={`text-4xl font-bold ${score >= 60 ? "text-green-600" : "text-red-500"}`}
        >
          {score}%
        </span>
      </div>

      {/* Main Score Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 mb-8">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${getProgressBarColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>

      {/* Pillar Breakdown */}
      {pillars && (
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <PillarRow
            label="Technical Skills"
            value={pillars.technical_skills}
            color="bg-blue-500"
          />
          <PillarRow
            label="Experience Alignment"
            value={pillars.experience_alignment}
            color="bg-purple-500"
          />
          <PillarRow
            label="Seniority Fit"
            value={pillars.seniority_fit}
            color="bg-amber-500"
          />
        </div>
      )}
    </div>
  );
}

function PillarRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-50 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${color} opacity-80`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
