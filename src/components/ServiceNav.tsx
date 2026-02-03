import { Link, NavLink } from "react-router-dom";
import { FileText, FileSearch, GitCompare } from "lucide-react";

const navItems = [
  {
    to: "/convert",
    label: "Convert",
    icon: FileText,
  },
  {
    to: "/resume-analyzer",
    label: "ATS Analyzer",
    icon: FileSearch,
  },
  {
    to: "/match",
    label: "JD Match",
    icon: GitCompare,
  },
];

const handleAddCredit = async () => {
  const res = await fetch("http://localhost:8000/admin/add-credits?amount=10", {
    method: "POST",
  });
  const data = await res.json();
  alert(data?.message);
};
export default function ServiceNav() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white/10 sticky top-0 backdrop-blur-sm z-50">
      <div className="mx-auto px-4 flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileSearch className="h-4 w-4 text-primary-foreground" />
            </div> */}
            <span className="font-semibold text-primary">Applyra</span>
          </div>
        </Link>
        <button
          className="bg-blue-700 text-white cursor-pointer"
          onClick={() => handleAddCredit()}
        >
          Add Credit +10
        </button>
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
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
