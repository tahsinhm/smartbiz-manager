import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../config'
function Dashboard() {

  const [stats, setStats] = useState({
    customers: 0,
    employees: 0,
    activeEmployees: 0,
    attendanceToday: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // Load dashboard statistics
  useEffect(() => {

    const fetchDashboardStats = async () => {

      try {

        const response = await fetch(
  API_ENDPOINTS.DASHBOARD_STATS
)

        if (!response.ok) {
          throw new Error(
            'Could not load dashboard statistics'
          )
        }

        const data = await response.json()

        setStats(data)

      } catch (error) {

        console.error(error)

        setError(
          'Unable to load dashboard information.'
        )

      } finally {

        setLoading(false)

      }
    }

    fetchDashboardStats()

  }, [])


  return (
    <div>

      {/* Heading */}
      <div>

        <h2 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h2>

        <p className="text-gray-500 mt-2 text-xl">
          Overview of your CRM and HR system.
        </p>

      </div>


      {/* Error */}
      {error && (

        <div className="bg-red-100 text-red-700 px-5 py-4 rounded-lg mt-6">
          {error}
        </div>

      )}


      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">


        {/* Customers */}
        <div className="bg-white rounded-xl shadow-sm p-7">

          <p className="text-gray-500 text-lg">
            Customers
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">

            {loading
              ? '...'
              : stats.customers}

          </p>

          <p className="text-gray-400 mt-2">
            Total CRM records
          </p>

        </div>


        {/* Employees */}
        <div className="bg-white rounded-xl shadow-sm p-7">

          <p className="text-gray-500 text-lg">
            Employees
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">

            {loading
              ? '...'
              : stats.employees}

          </p>

          <p className="text-gray-400 mt-2">
            Total employee records
          </p>

        </div>


        {/* Active Employees */}
        <div className="bg-white rounded-xl shadow-sm p-7">

          <p className="text-gray-500 text-lg">
            Active Employees
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">

            {loading
              ? '...'
              : stats.activeEmployees}

          </p>

          <p className="text-gray-400 mt-2">
            Currently active
          </p>

        </div>


        {/* Attendance Today */}
        <div className="bg-white rounded-xl shadow-sm p-7">

          <p className="text-gray-500 text-lg">
            Attendance Today
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">

            {loading
              ? '...'
              : stats.attendanceToday}

          </p>

          <p className="text-gray-400 mt-2">
            Records entered today
          </p>

        </div>

      </div>


      {/* System Summary */}
      <div className="bg-white rounded-xl shadow-sm p-8 mt-8">

        <h3 className="text-2xl font-semibold text-gray-800">
          SmartBiz Manager
        </h3>

        <p className="text-gray-500 mt-3 text-lg">
          Customer, employee and attendance information
          is stored securely through the SmartBiz Manager
          backend and PostgreSQL database.
        </p>

      </div>

    </div>
  )
}

export default Dashboard