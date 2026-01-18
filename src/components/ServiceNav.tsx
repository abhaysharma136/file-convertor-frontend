import { NavLink } from "react-router-dom";
import { FileText, FileSearch, GitCompare } from "lucide-react";

const navItems = [
  {
    to: "/convert",
    label: "Convert",
    icon: FileText,
  },
  {
    to: "/resume",
    label: "ATS Analyzer",
    icon: FileSearch,
  },
  {
    to: "/match",
    label: "JD Match",
    icon: GitCompare,
  },
];

export default function ServiceNav() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-6 h-14">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                transition-colors
                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                }
                `
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
