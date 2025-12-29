// src/components/Empty.jsx
export default function Empty({ title = "No data found", hint }) {
  return (
    <div className="p-8 text-center text-gray-400 border border-slate-800 rounded-xl bg-slate-900">
      <p className="font-medium">{title}</p>
      {hint && <p className="text-sm mt-1">{hint}</p>}
    </div>
  );
}
