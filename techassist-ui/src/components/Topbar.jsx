export default function Topbar({ onMenuClick }) {
  return (
    <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4">
      <button
        onClick={onMenuClick}
        className="md:hidden mr-3 text-xl text-gray-300"
      >
        ☰
      </button>

      <h1 className="text-lg font-semibold text-gray-200">
        {/* TechAssist */}
      </h1>
    </div>
  );
}
