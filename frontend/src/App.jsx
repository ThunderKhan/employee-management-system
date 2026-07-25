import { useEffect, useMemo, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Login from "./Login"
import Dashboard from "./Dashboard"
import EmployeeFormModal from "./EmployeeFormModal"
import api from "./api/axios"
import { AuthProvider, useAuth } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function AppRoutes() {
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { login: setAuthToken, logout: clearAuthToken, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get("/employees")
      // Backend returns Mongo's _id — normalize to id for the v0 UI components
      setEmployees(data.employees.map((e) => ({ ...e, id: e._id })))
    } catch (err) {
      toast.error("Failed to load employees")
    }
  }

  useEffect(() => {
    if (isAuthenticated) fetchEmployees()
  }, [isAuthenticated])

  const departments = useMemo(() => [...new Set(employees.map((e) => e.department))].sort(), [employees])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return employees.filter((emp) => {
      const matchesDept = !department || emp.department === department
      const matchesQuery =
        !q ||
        [emp.name, emp.email, emp.mobile, emp.designation].some((field) => String(field).toLowerCase().includes(q))
      return matchesDept && matchesQuery
    })
  }, [employees, search, department])

  const stats = useMemo(
    () => ({
      total: employees.length,
      active: employees.filter((e) => e.status === "Active").length,
      inactive: employees.filter((e) => e.status !== "Active").length,
    }),
    [employees],
  )

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      toast.error("Please enter your email and password.")
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post("/login", { email, password })
      setAuthToken(data.token, data.user)
      toast.success("Welcome back!")
      navigate("/dashboard")
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    toast.info("You have been signed out.")
    navigate("/login")
  }

  const handleSubmitEmployee = async (data) => {
    try {
      if (editing) {
        await api.put(`/employees/${editing.id}`, data)
        toast.success(`${data.name} updated.`)
      } else {
        await api.post("/employees", data)
        toast.success(`${data.name} added.`)
      }
      setModalOpen(false)
      setEditing(null)
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed")
    }
  }

  const handleDelete = async (id) => {
    const target = employees.find((e) => e.id === id)
    try {
      await api.delete(`/employees/${id}`)
      toast.success(`${target?.name ?? "Employee"} removed.`)
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed")
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onSubmit={handleLogin} loading={loading} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <>
              <Dashboard
                stats={stats}
                employees={filtered}
                search={search}
                department={department}
                departments={departments}
                onSearchChange={setSearch}
                onDepartmentChange={setDepartment}
                onAdd={() => {
                  setEditing(null)
                  setModalOpen(true)
                }}
                onEdit={(emp) => {
                  setEditing(emp)
                  setModalOpen(true)
                }}
                onDelete={handleDelete}
                onLogout={handleLogout}
              />
              <EmployeeFormModal
                open={modalOpen}
                onClose={() => {
                  setModalOpen(false)
                  setEditing(null)
                }}
                onSubmit={handleSubmitEmployee}
                initialData={editing}
              />
            </>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
