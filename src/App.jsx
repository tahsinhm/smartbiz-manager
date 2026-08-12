import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router'

import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Leads from './pages/Leads'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import LeaveRequests from './pages/LeaveRequests'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const navStyle = ({ isActive }) =>
    `block flex-shrink-0 whitespace-nowrap px-4 py-3 lg:px-6 lg:py-4 rounded-xl text-base lg:text-xl font-medium ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-800 hover:bg-gray-100'
    }`

  const handleLogout = () => {
    localStorage.removeItem('smartbiz_token')
    localStorage.removeItem('smartbiz_user')

    navigate('/login')
  }

  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    )
  }

  return (
    <ProtectedRoute>

      <div className="min-h-screen bg-gray-100">

        {/* Header */}
        <header className="bg-blue-700 text-white px-4 sm:px-6 lg:px-10 py-5 lg:py-7 flex justify-between items-center gap-4">

          <div className="min-w-0">

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              SmartBiz Manager
            </h1>

            <p className="text-sm sm:text-base lg:text-xl text-blue-100 mt-1 lg:mt-2">
              CRM and HR Management Platform
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 px-3 py-2 lg:px-5 rounded-lg text-sm lg:text-base font-medium hover:bg-blue-50 flex-shrink-0"
          >
            Logout
          </button>

        </header>


        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row">

          {/* Navigation */}
          <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r lg:min-h-[calc(100vh-120px)]">

            <nav className="flex lg:block gap-2 p-3 lg:p-6 overflow-x-auto lg:space-y-5">

              <NavLink
                to="/"
                end
                className={navStyle}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/customers"
                className={navStyle}
              >
                Customers
              </NavLink>

              <NavLink
                to="/leads"
                className={navStyle}
              >
                Leads
              </NavLink>

              <NavLink
                to="/employees"
                className={navStyle}
              >
                Employees
              </NavLink>

              <NavLink
                to="/attendance"
                className={navStyle}
              >
                Attendance
              </NavLink>

              <NavLink
                to="/leave-requests"
                className={navStyle}
              >
                Leave Requests
              </NavLink>

            </nav>

          </aside>


          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 overflow-hidden">

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/customers"
                element={<Customers />}
              />

              <Route
                path="/leads"
                element={<Leads />}
              />

              <Route
                path="/employees"
                element={<Employees />}
              />

              <Route
                path="/attendance"
                element={<Attendance />}
              />

              <Route
                path="/leave-requests"
                element={<LeaveRequests />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </ProtectedRoute>
  )
}

export default App