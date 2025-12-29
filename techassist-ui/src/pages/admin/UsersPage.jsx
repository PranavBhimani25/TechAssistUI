import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { fetchAllUsers } from "../../services/adminService";
import toast from "react-hot-toast";

const DEFAULT_PAGE_SIZE = 10;
const ROLES = ["All", "Admin", "Engineer", "User"];

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState([]); // raw API array
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Sorting state
  const [sortBy, setSortBy] = useState("fullName"); // fullName | email | role | isActive | createdAt
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  // fetch once
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAllUsers();
        setAllUsers(Array.isArray(data) ? data : (data.items ?? []));
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // filter by search + role
  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      const name = (u.fullName || u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const matchesSearch =
        !debouncedSearch || name.includes(debouncedSearch) || email.includes(debouncedSearch);

      const roleStr = typeof u.role === "number" ? mapRoleEnum(u.role) : String(u.role || "");
      const matchesRole = role === "All" || roleStr === role;

      return matchesSearch && matchesRole;
    });
  }, [allUsers, debouncedSearch, role]);

  // sort
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = getField(a, sortBy);
      const bv = getField(b, sortBy);

      // handle nullish
      if (av == null && bv == null) return 0;
      if (av == null) return sortDir === "asc" ? 1 : -1;
      if (bv == null) return sortDir === "asc" ? -1 : 1;

      // dates
      if (sortBy === "createdAt") {
        const ad = new Date(av).getTime();
        const bd = new Date(bv).getTime();
        return sortDir === "asc" ? ad - bd : bd - ad;
      }

      // booleans
      if (sortBy === "isActive") {
        const ai = av ? 1 : 0;
        const bi = bv ? 1 : 0;
        return sortDir === "asc" ? ai - bi : bi - ai;
      }

      // role (normalize to string)
      if (sortBy === "role") {
        const ar = (typeof av === "number" ? mapRoleEnum(av) : String(av)).toLowerCase();
        const br = (typeof bv === "number" ? mapRoleEnum(bv) : String(bv)).toLowerCase();
        return sortDir === "asc" ? ar.localeCompare(br) : br.localeCompare(ar);
      }

      // string compare
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  // pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = useMemo(() => sorted.slice(startIndex, endIndex), [sorted, startIndex, endIndex]);

  // reset to page 1 when pageSize changes
  useEffect(() => { setPage(1); }, [pageSize]);

  // header click
  const onHeaderClick = (key) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  // CSV export
  const exportCsv = (scope = "filtered") => {
    const rows = scope === "page" ? pageItems : sorted;
    const csv = buildCsv(rows);
    downloadCsv(csv, `users_${scope}_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-400">Users</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportCsv("page")}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"
          >
            Export Current Page (CSV)
          </button>
          <button
            onClick={() => exportCsv("filtered")}
            className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Export All (Filtered) CSV
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Role</label>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setPage(1); }}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-200"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-gray-200"
          />

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Page size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-200"
            >
              {[5, 10, 20, 50, 100].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-gray-300">
              <tr>
                <Th label="Full Name" sortKey="fullName" sortBy={sortBy} sortDir={sortDir} onClick={onHeaderClick} />
                <Th label="Email" sortKey="email" sortBy={sortBy} sortDir={sortDir} onClick={onHeaderClick} />
                <Th label="Role" sortKey="role" sortBy={sortBy} sortDir={sortDir} onClick={onHeaderClick} />
                <Th label="Status" sortKey="isActive" sortBy={sortBy} sortDir={sortDir} onClick={onHeaderClick} />
                <Th label="Created" sortKey="createdAt" sortBy={sortBy} sortDir={sortDir} onClick={onHeaderClick} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6" colSpan={5}>Loading…</td></tr>
              ) : pageItems.length ? (
                pageItems.map((u) => (
                  <tr key={u.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{u.fullName || u.name}</td>
                    <td className="px-4 py-3 text-gray-300">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs border border-slate-600 bg-slate-800">
                        {typeof u.role === "number" ? mapRoleEnum(u.role) : u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs border ${
                        u.isActive ? "bg-emerald-500/15 text-emerald-300 border-emerald-600/40"
                                   : "bg-rose-500/15 text-rose-300 border-rose-600/40"
                      }`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-4 py-6" colSpan={5}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-t border-slate-800">
          <p className="text-xs text-gray-400">
            Showing <span className="text-gray-200">{total ? startIndex + 1 : 0}</span>–
            <span className="text-gray-200">{endIndex}</span> of{" "}
            <span className="text-gray-200">{total}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2 py-1 text-sm text-gray-300">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------- helpers ---------- */

function Th({ label, sortKey, sortBy, sortDir, onClick }) {
  const active = sortBy === sortKey;
  return (
    <th
      className="text-left px-4 py-3 select-none cursor-pointer"
      onClick={() => onClick(sortKey)}
      title="Click to sort"
    >
      <span className={`inline-flex items-center gap-1 ${active ? "text-white" : ""}`}>
        {label}
        <span className={`transition ${active ? "opacity-100" : "opacity-30"}`}>
          {sortDir === "asc" && sortKey === sortBy ? "▲" : sortKey === sortBy ? "▼" : "◇"}
        </span>
      </span>
    </th>
  );
}

function getField(obj, key) {
  switch (key) {
    case "fullName": return obj.fullName ?? obj.name ?? "";
    case "email": return obj.email ?? "";
    case "role": return obj.role;
    case "isActive": return !!obj.isActive;
    case "createdAt": return obj.createdAt ?? null;
    default: return obj[key];
  }
}

function mapRoleEnum(value) {
  const map = { 0: "User", 1: "Engineer", 2: "Admin" };
  return map[value] ?? String(value);
}

function buildCsv(rows) {
  const headers = ["Id", "Full Name", "Email", "Role", "Active", "Created At"];
  const lines = rows.map((u) =>
    [
      safe(u.id),
      safe(u.fullName || u.name),
      safe(u.email),
      safe(typeof u.role === "number" ? mapRoleEnum(u.role) : u.role),
      safe(u.isActive ? "Active" : "Inactive"),
      safe(u.createdAt ? new Date(u.createdAt).toISOString() : ""),
    ]
      .map(csvEscape)
      .join(",")
  );
  const bom = "\uFEFF";
  return bom + [headers.join(","), ...lines].join("\r\n");
}

function safe(v) { return v ?? ""; }

function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
