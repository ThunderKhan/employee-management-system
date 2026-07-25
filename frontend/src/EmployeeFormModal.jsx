import { useEffect, useState } from "react"
import { X, AlertCircle, ChevronDown } from "lucide-react"

const EMPTY_FORM = {
  name: "",
  email: "",
  mobile: "",
  department: "",
  designation: "",
  salary: "",
  status: "Active",
}

const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "Finance", "Human Resources", "Support"]

export default function EmployeeFormModal({ open, onClose, onSubmit, initialData = null }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM)
    setErrors({})
  }, [open, initialData])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.()
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  const isEdit = Boolean(initialData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = "Name is required"
    if (!form.email.trim()) next.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address"
    if (!String(form.mobile).trim()) next.mobile = "Mobile number is required"
    else if (!/^\d{10}$/.test(String(form.mobile).trim())) next.mobile = "Enter a valid 10-digit mobile number"
    if (!form.department.trim()) next.department = "Department is required"
    if (!form.designation.trim()) next.designation = "Designation is required"
    if (String(form.salary).trim() === "") next.salary = "Salary is required"
    else if (Number.isNaN(Number(form.salary)) || Number(form.salary) < 0) next.salary = "Enter a valid salary amount"
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit?.({ ...form, salary: Number(form.salary) })
  }

  const fieldClass = (name) => `input ${errors[name] ? "input-error" : ""}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/40 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-form-title"
        className="w-full max-w-2xl rounded-t-2xl border border-slate-200 bg-white shadow-xl animate-scale-in sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 id="employee-form-title" className="text-lg font-semibold tracking-tight text-slate-900">
              {isEdit ? "Edit Employee" : "Add Employee"}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {isEdit ? "Update the employee's details below." : "Fill in the details to add a new team member."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="icon-btn -mr-1.5 -mt-0.5">
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close dialog</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Cooper"
                aria-invalid={Boolean(errors.name)}
                className={fieldClass("name")}
              />
              {errors.name && (
                <p className="field-error">
                  <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                aria-invalid={Boolean(errors.email)}
                className={fieldClass("email")}
              />
              {errors.email && (
                <p className="field-error">
                  <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="mobile" className="label">
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                aria-invalid={Boolean(errors.mobile)}
                className={fieldClass("mobile")}
              />
              {errors.mobile && (
                <p className="field-error">
                  <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.mobile}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="department" className="label">
                Department
              </label>
              <div className="relative">
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.department)}
                  className={`select ${errors.department ? "input-error" : ""}`}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept) => (
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
              {errors.department && (
                <p className="field-error">
                  <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.department}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="designation" className="label">
                Designation
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                value={form.designation}
                onChange={handleChange}
                placeholder="Senior Engineer"
                aria-invalid={Boolean(errors.designation)}
                className={fieldClass("designation")}
              />
              {errors.designation && (
                <p className="field-error">
                  <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.designation}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="salary" className="label">
                Salary
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ₹
                </span>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  step="1000"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="90000"
                  aria-invalid={Boolean(errors.salary)}
                  className={`${fieldClass("salary")} pl-7`}
                />
              </div>
              {errors.salary && (
                <p className="field-error">
                  <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors.salary}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <span className="label">Status</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                {["Active", "Inactive"].map((option) => {
                  const selected = form.status === option
                  const activeTone = option === "Active" ? "text-emerald-700" : "text-red-700"
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setForm((prev) => ({ ...prev, status: option }))}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                        selected ? `bg-white shadow-sm ${activeTone}` : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:rounded-b-xl">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
