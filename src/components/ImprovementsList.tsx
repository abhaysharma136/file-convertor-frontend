import {
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Copy,
  Check,
  Tag,
} from "lucide-react";
import { useState } from "react";

export interface Suggestion {
  title: string;
  description: string;
  severity: "critical" | "moderate" | "minor";
  category: string;
}

interface ImprovementsListProps {
  suggestions: Suggestion[];
  rewrittenBullets?: string[];
  missingKeywords?: string[];
  optimizationTips?: string[];
}

export default function ImprovementsList({
  suggestions,
  rewrittenBullets = [],
  missingKeywords = [],
  optimizationTips = [],
}: ImprovementsListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getSeverityIcon = (severity: Suggestion["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "moderate":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "minor":
        return <Info className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getSeverityBorder = (severity: Suggestion["severity"]) => {
    switch (severity) {
      case "critical":
        return "border-l-red-600";
      case "moderate":
        return "border-l-orange-600";
      case "minor":
        return "border-l-yellow-600";
    }
  };

  const getSeverityLabel = (severity: Suggestion["severity"]) => {
    switch (severity) {
      case "critical":
        return { text: "Critical", className: "bg-red-600/10 text-red-600" };
      case "moderate":
        return {
          text: "Moderate",
          className: "bg-orange-600/10 text-orange-600",
        };
      case "minor":
        return { text: "Minor", className: "bg-yellow-600/10 text-yellow-600" };
    }
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Suggestions */}
      <div className="space-y-3">
        {suggestions.length !== 0 && optimizationTips.length === 0 ? (
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium">Suggested Improvements</h3>
          </div>
        ) : null}

        {suggestions.map((item, index) => {
          const label = getSeverityLabel(item.severity);
          return (
            <div
              key={index}
              className={`p-4 rounded-lg bg-card border border-gray-100 border-l-4 ${getSeverityBorder(
                item.severity,
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(item.severity)}</div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{item.title}</p>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${label.className}`}
                    >
                      {label.text}
                    </span>

                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 text-left">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Missing Keywords */}
      {missingKeywords.length > 0 && (
        <div className="rounded-lg border bg-card border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-orange-600" />
            <h3 className="text-sm font-medium">Missing Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((k, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rewritten Bullets */}
      {rewrittenBullets.length > 0 && (
        <div className="rounded-lg border border-gray-100 p-4 bg-card">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium">Suggested Rewrites</h3>
          </div>

          <div className="space-y-2">
            {rewrittenBullets.map((bullet, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-md bg-green-50 border border-green-200"
              >
                <span className="text-green-600 mt-0.5">•</span>
                <p className="flex-1 text-sm text-left">{bullet}</p>
                <button
                  onClick={() => handleCopy(bullet, i)}
                  className="p-1 rounded hover:bg-green-100"
                >
                  {copiedIndex === i ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Optimization Suggestions */}
      {optimizationTips.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium">Optimization Suggestions</h3>
          </div>

          {optimizationTips.map((tip, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-card border border-gray-100 border-l-4 border-l-blue-600"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">Advanced Refinement</p>

                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-600">
                      Optimization
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 text-left">{tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Perfect Resume */}
      {suggestions.length === 0 && optimizationTips.length === 0 && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-100 border border-green-300">
          <Check className="h-5 w-5 text-green-600" />
          <p className="text-sm">Your resume is well optimized for ATS.</p>
        </div>
      )}
    </div>
  );
}
