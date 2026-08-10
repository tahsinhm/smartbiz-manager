import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router'

import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'


function App() {

  const location = useLocation()
  const navigate = useNavigate()


  const navStyle = ({ isActive }) =>
    `block w-full px-6 py-4 rounded-xl text-xl font-medium ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-800 hover:bg-gray-100'
    }`


  // Logout user
  const handleLogout = () => {

    localStorage.removeItem(
      'smartbiz_token'
    )

    localStorage.removeItem(
      'smartbiz_user'
    )

    navigate('/login')
  }


  // Login page has no sidebar/header
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
        <header className="bg-blue-700 text-white px-10 py-7 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              SmartBiz Manager
            </h1>

            <p className="text-xl text-blue-100 mt-2">
              CRM and HR Management Platform
            </p>

          </div>


          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-blue-50"
          >
            Logout
          </button>

        </header>


        <div className="flex">


          {/* Sidebar */}
          <aside className="w-72 min-h-[calc(100vh-120px)] bg-white border-r">

            <nav className="p-6 space-y-5">

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

            </nav>

          </aside>


          {/* Main Content */}
          <main className="flex-1 p-10">

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
                path="/employees"
                element={<Employees />}
              />

              <Route
                path="/attendance"
                element={<Attendance />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </ProtectedRoute>
  )
}

export default App