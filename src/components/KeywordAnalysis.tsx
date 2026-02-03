import { AlertCircle, CheckCircle } from "lucide-react";

export default function KeywordAnalysis({ matchResult }) {
  return (
    <div>
      {/* Keywords Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Matched Keywords */}
        <div className="bg-card border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-foreground">Matched Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchResult.matched_keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-green-600/10 text-green-600 text-sm rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        {/* Missing Keywords */}
        <div className="bg-card border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <h3 className="font-medium text-foreground">Missing Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchResult.missing_keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-orange-600/10 text-orange-600 text-sm rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
