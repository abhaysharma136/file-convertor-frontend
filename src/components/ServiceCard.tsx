import { Link } from "react-router-dom";
import { ArrowRight, Clock, Star } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
  primary?: boolean; // Recommended
  highlighted?: boolean; // Last used
};

export default function ServiceCard({
  title,
  description,
  to,
  icon,
  primary = false,
  highlighted = false,
}: Props) {
  const showLastUsed = highlighted;
  const showRecommended = primary && !highlighted; // hide recommended if last used

  return (
    <Link
      to={to}
      className={`
        group relative w-full rounded-xl border p-6 text-left transition-all
        hover:shadow-md hover:-translate-y-0.5
        ${
          highlighted
            ? "border-blue-400 ring-2 ring-blue-400/40 shadow-blue-100 animate-glow"
            : primary
              ? "border-primary bg-primary/5 hover:bg-primary/10"
              : "border-gray-200 bg-white hover:bg-gray-50"
        }
      `}
    >
      {/* ---------- BADGES ---------- */}

      {/* Last used badge (highest priority) */}
      {showLastUsed && (
        <div className="absolute -top-3 left-4 group/badge">
          <span
            className="
              flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full
              bg-blue-50 text-blue-700 border border-blue-200 shadow-sm
            "
          >
            <Clock className="h-3 w-3" />
            Last used
          </span>

          {/* Tooltip */}
          <div
            className="
              absolute left-0 mt-2 w-max px-3 py-1 text-xs rounded-md
              bg-gray-900 text-white opacity-0 translate-y-1
              group-hover/badge:opacity-100 group-hover/badge:translate-y-0
              transition-all duration-200 pointer-events-none
            "
          >
            You recently used this service
          </div>
        </div>
      )}

      {/* Recommended badge (only if NOT last used) */}
      {showRecommended && (
        <span className="absolute -top-3 right-4 flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground shadow">
          <Star className="h-3 w-3" />
          Recommended
        </span>
      )}
      <div className="flex flex-col items-start justify-between">
        <div className="flex flex-col items-start">
          <div
            className={`
          mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg
          ${
            highlighted
              ? "bg-blue-100 text-blue-700"
              : primary
                ? "bg-primary text-white"
                : "bg-muted text-primary"
          }
        `}
          >
            {icon}
          </div>

          {/* ---------- CONTENT ---------- */}
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground mb-6">{description}</p>
        </div>
        {/* ---------- ICON ---------- */}

        {/* ---------- CTA ---------- */}
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span>Get started</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
