import { Info, Zap } from "lucide-react";
export interface Suggestion {
  title?: string;
  description?: string;
  severity?: string;
  category?: string;
}
export default function JDSuggestions({
  suggestions,
  actionItem,
}: {
  suggestions: Suggestion[];
  actionItem?: string;
}) {
  return (
    <div className="space-y-4">
      {/* Top Action Item Banner */}
      {actionItem && (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
          <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary text-left">
              Top Action Item
            </p>
            <p className="text-sm text-primary/80">{actionItem}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-foreground">Strategic Suggestions</h3>
        </div>
        <ul className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={`h-2 w-2 rounded-full mt-2 shrink-0 ${
                  suggestion.severity === "critical"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              />
              <div>
                {suggestion.title && (
                  <p className="font-semibold text-sm text-foreground text-left">
                    {suggestion.title}
                  </p>
                )}
                {suggestion.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {suggestion.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
