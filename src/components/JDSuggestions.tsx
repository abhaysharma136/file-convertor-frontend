import { Info } from "lucide-react";
export interface Suggestion {
  title?: string;
  description?: string;
  severity?: string;
  category?: string;
}

interface Props {
  suggestions: Suggestion[];
}

export default function JDSuggestions({ suggestions }: Props) {
  return (
    <div className="bg-card border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-foreground">Suggestions</h3>
      </div>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
            <div>
              {suggestion.title && (
                <p className="font-medium text-foreground">
                  {suggestion.title}
                </p>
              )}
              {suggestion.description && <p>{suggestion.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
