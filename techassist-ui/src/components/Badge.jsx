// src/components/Badge.jsx
export default function Badge({ children, kind = "neutral" }) {
  const map = {
    admin: "bg-purple-500/15 text-purple-300 border-purple-600/40",
    engineer: "bg-emerald-500/15 text-emerald-300 border-emerald-600/40",
    user: "bg-blue-500/15 text-blue-300 border-blue-600/40",
    active: "bg-emerald-500/15 text-emerald-300 border-emerald-600/40",
    inactive: "bg-rose-500/15 text-rose-300 border-rose-600/40",
    neutral: "bg-slate-500/15 text-slate-300 border-slate-600/40",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs border ${map[kind] || map.neutral}`}>
      {children}
    </span>
  );
}
