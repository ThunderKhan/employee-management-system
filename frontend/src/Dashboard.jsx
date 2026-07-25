import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ChevronDown,
  Inbox,
  Mail,
  Phone,
} from "lucide-react"

const COLUMNS = ["Name", "Email", "Mobile", "Department", "Designation", "Salary", "Status"]

function formatSalary(salary) {
  const value = Number(salary)
  if (Number.isNaN(value)) return salary ?? "—"
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  })
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function StatusBadge({ status }) {
  const isActive = String(status).toLowerCase() === "active"
  return (
    <span className={isActive ? "badge-active" : "badge-inactive"}>
      <span className="badge-dot" aria-hidden="true" />
      {isActive ? "Active" : "Inactive"}
    </span>
  )
}

function StatCard({ label, value, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  }
  return (
    <div className="stat-card">
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value ?? 0}</p>
      </div>
      <span className={`stat-icon ${tones[tone]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Inbox className="h-6 w-6 text-slate-400" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-slate-900">No employees found</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        Try adjusting your search or filters, or add a new employee.
      </p>
    </div>
  )
}

export default function Dashboard({
  stats = { total: 0, active: 0, inactive: 0 },
  employees = [],
  search = "",
  department = "",
  departments = [],
  onSearchChange,
  onDepartmentChange,
  onAdd,
  onEdit,
  onDelete,
  onLogout,
}) {
  const isEmpty = employees.length === 0

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
              <Users className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <span className="truncate text-base font-semibold tracking-tight text-slate-900">
              Employee Management System
            </span>
          </div>
          <button type="button" onClick={onLogout} className="btn-ghost shrink-0 px-3 py-2">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sr-only sm:hidden">Logout</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Employees" value={stats.total} icon={Users} tone="blue" />
          <StatCard label="Active" value={stats.active} icon={UserCheck} tone="green" />
          <StatCard label="Inactive" value={stats.inactive} icon={UserX} tone="red" />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search employees..."
              aria-label="Search employees"
              className="input pl-10"
            />
          </div>

          <div className="relative w-full sm:w-52">
            <select
              value={department}
              onChange={(e) => onDepartmentChange?.(e.target.value)}
              aria-label="Filter by department"
              className="select"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </div>

          <button type="button" onClick={onAdd} className="btn-primary w-full sm:ml-auto sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Employee
          </button>
        </div>

        {/* Desktop / tablet: data table */}
        <section className="card mt-5 hidden overflow-hidden md:block">
          <table className="w-full border-collapse">
            <caption className="sr-only">List of employees</caption>
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col} scope="col" className="th">
                    {col}
                  </th>
                ))}
                <th scope="col" className="th text-right">
                  Actions
                </th>
              </tr>
            </thead>
            {!isEmpty && (
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp, index) => (
                  <tr
                    key={emp.id ?? index}
                    className={`transition-colors hover:bg-blue-50/50 ${index % 2 === 1 ? "bg-slate-50/60" : "bg-white"}`}
                  >
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                          {initials(emp.name)}
                        </span>
                        <span className="font-medium text-slate-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="td">{emp.email}</td>
                    <td className="td">{emp.mobile}</td>
                    <td className="td">{emp.department}</td>
                    <td className="td">{emp.designation}</td>
                    <td className="td font-medium text-slate-900">{formatSalary(emp.salary)}</td>
                    <td className="td">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="td">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => onEdit?.(emp)} className="icon-btn">
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">Edit {emp.name}</span>
                        </button>
                        <button type="button" onClick={() => onDelete?.(emp.id)} className="icon-btn-danger">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">Delete {emp.name}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {isEmpty && <EmptyState />}
        </section>

        {/* Mobile: stacked cards */}
        <section className="mt-5 md:hidden">
          {isEmpty ? (
            <div className="card">
              <EmptyState />
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {employees.map((emp, index) => (
                <li key={emp.id ?? index} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                        {initials(emp.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{emp.name}</p>
                        <p className="truncate text-xs text-slate-500">{emp.designation}</p>
                      </div>
                    </div>
                    <StatusBadge status={emp.status} />
                  </div>

                  <dl className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <dt className="sr-only">Email</dt>
                      <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                      <dd className="truncate text-slate-600">{emp.email}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <dt className="sr-only">Mobile</dt>
                      <Phone className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                      <dd className="text-slate-600">{emp.mobile}</dd>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div>
                        <dt className="text-xs font-medium text-slate-500">Department</dt>
                        <dd className="text-slate-900">{emp.department}</dd>
                      </div>
                      <div className="text-right">
                        <dt className="text-xs font-medium text-slate-500">Salary</dt>
                        <dd className="font-medium text-slate-900">{formatSalary(emp.salary)}</dd>
                      </div>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => onEdit?.(emp)}
                      className="btn-outline flex-1 px-3 py-2 text-xs"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(emp.id)}
                      className="btn-ghost flex-1 px-3 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
