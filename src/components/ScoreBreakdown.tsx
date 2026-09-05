interface Breakdown {
  structure: number;
  length: number;
  experience_quality: number;
  impact: number;
  skills: number;
  clarity: number;
}
export default function ScoreBreakdown({
  breakdown,
}: {
  breakdown: Breakdown;
}) {
  const breakdownValue = [
    { label: "Structure", value: breakdown.structure, max: 20 },
    { label: "Length", value: breakdown.length, max: 15 },
    {
      label: "Experience Quality",
      value: breakdown.experience_quality,
      max: 20,
    },
    { label: "Impact", value: breakdown.impact, max: 15 },
    {
      label: "Skills",
      value: breakdown.skills,
      max: 15,
    },
    { label: "Clarity", value: breakdown.clarity, max: 15 },
  ];
  return (
    <>
      {/* 🔹 PREMIUM SCORE BREAKDOWN */}
      {breakdown && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Score Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {breakdownValue.map((item, index) => {
              const percentage = Math.round((item.value / item.max) * 100);

              let statusColor = "text-green-600";
              let badgeBg = "bg-green-50";
              let badgeText = "Excellent";

              if (percentage < 85 && percentage >= 65) {
                statusColor = "text-amber-600";
                badgeBg = "bg-amber-50";
                badgeText = "Good";
              } else if (percentage < 65) {
                statusColor = "text-red-600";
                badgeBg = "bg-red-50";
                badgeText = "Needs Work";
              }

              return (
                <div
                  key={index}
                  className="group relative p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Label */}
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      {item.label}
                    </p>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${badgeBg} ${statusColor}`}
                    >
                      {badgeText}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-semibold text-gray-900">
                      {percentage}
                    </span>
                    <span className="text-sm text-gray-400 mb-1">%</span>
                  </div>

                  {/* Subtle Progress Bar */}
                  <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
