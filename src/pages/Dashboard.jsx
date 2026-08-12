import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../config'

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    employees: 0,
    activeEmployees: 0,
    attendanceToday: 0,
  })

  const [upcomingLeads, setUpcomingLeads] = useState([])
  const [pendingLeave, setPendingLeave] = useState([])
  const [employees, setEmployees] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          statsResponse,
          leadsResponse,
          leaveResponse,
          employeesResponse,
        ] = await Promise.all([
          fetch(API_ENDPOINTS.DASHBOARD_STATS),
          fetch(API_ENDPOINTS.LEADS_LIST),
          fetch(API_ENDPOINTS.LEAVE_REQUESTS_LIST),
          fetch(API_ENDPOINTS.EMPLOYEES_LIST),
        ])

        if (
          !statsResponse.ok ||
          !leadsResponse.ok ||
          !leaveResponse.ok ||
          !employeesResponse.ok
        ) {
          throw new Error(
            'Could not load dashboard information'
          )
        }

        const statsData = await statsResponse.json()
        const leadsData = await leadsResponse.json()
        const leaveData = await leaveResponse.json()
        const employeesData = await employeesResponse.json()

        setStats(statsData)
        setEmployees(employeesData)

        // Get today's local date
        const today = new Date()

        const todayString =
          `${today.getFullYear()}-` +
          `${String(today.getMonth() + 1).padStart(2, '0')}-` +
          `${String(today.getDate()).padStart(2, '0')}`

        // Upcoming lead follow-ups
        const upcoming = leadsData
          .filter(
            (lead) =>
              lead.follow_up_date &&
              lead.follow_up_date >= todayString &&
              lead.status !== 'Converted'
          )
          .sort((a, b) =>
            a.follow_up_date.localeCompare(
              b.follow_up_date
            )
          )
          .slice(0, 5)

        setUpcomingLeads(upcoming)

        // Pending leave requests
        const pending = leaveData
          .filter(
            (request) =>
              request.status === 'Pending'
          )
          .slice(0, 5)

        setPendingLeave(pending)

      } catch (error) {
        console.error(error)

        setError(
          'Unable to load dashboard information.'
        )

      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (employee) =>
        String(employee.id) ===
        String(employeeId)
    )

    if (!employee) {
      return 'Unknown Employee'
    }

    return `${employee.first_name} ${employee.last_name}`
  }

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

        <div className="bg-white rounded-xl shadow-sm p-7">
          <p className="text-gray-500 text-lg">
            Customers
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">
            {loading ? '...' : stats.customers}
          </p>

          <p className="text-gray-400 mt-2">
            Total CRM records
          </p>
        </div>


        <div className="bg-white rounded-xl shadow-sm p-7">
          <p className="text-gray-500 text-lg">
            Employees
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">
            {loading ? '...' : stats.employees}
          </p>

          <p className="text-gray-400 mt-2">
            Total employee records
          </p>
        </div>


        <div className="bg-white rounded-xl shadow-sm p-7">
          <p className="text-gray-500 text-lg">
            Active Employees
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">
            {loading ? '...' : stats.activeEmployees}
          </p>

          <p className="text-gray-400 mt-2">
            Currently active
          </p>
        </div>


        <div className="bg-white rounded-xl shadow-sm p-7">
          <p className="text-gray-500 text-lg">
            Attendance Today
          </p>

          <p className="text-4xl font-bold text-gray-800 mt-3">
            {loading ? '...' : stats.attendanceToday}
          </p>

          <p className="text-gray-400 mt-2">
            Records entered today
          </p>
        </div>

      </div>


      {/* CRM + HR Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Lead Follow-ups */}
        <div className="bg-white rounded-xl shadow-sm p-7">

          <div className="flex justify-between items-center">

            <h3 className="text-2xl font-semibold text-gray-800">
              Upcoming Follow-ups
            </h3>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {upcomingLeads.length}
            </span>

          </div>

          {loading ? (
            <p className="text-gray-500 mt-6">
              Loading...
            </p>

          ) : upcomingLeads.length === 0 ? (
            <p className="text-gray-500 mt-6">
              No upcoming customer follow-ups.
            </p>

          ) : (
            <div className="mt-5 space-y-4">

              {upcomingLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="border-b pb-4 last:border-b-0"
                >

                  <div className="font-medium text-gray-800">
                    {lead.client_name}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {lead.company || 'No company'}
                  </div>

                  <div className="text-sm text-blue-700 mt-2">
                    Follow-up: {lead.follow_up_date}
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>


        {/* Pending Leave */}
        <div className="bg-white rounded-xl shadow-sm p-7">

          <div className="flex justify-between items-center">

            <h3 className="text-2xl font-semibold text-gray-800">
              Pending Leave Requests
            </h3>

            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              {pendingLeave.length}
            </span>

          </div>

          {loading ? (
            <p className="text-gray-500 mt-6">
              Loading...
            </p>

          ) : pendingLeave.length === 0 ? (
            <p className="text-gray-500 mt-6">
              No pending leave requests.
            </p>

          ) : (
            <div className="mt-5 space-y-4">

              {pendingLeave.map((request) => (
                <div
                  key={request.id}
                  className="border-b pb-4 last:border-b-0"
                >

                  <div className="font-medium text-gray-800">
                    {getEmployeeName(
                      request.employee_id
                    )}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {request.start_date}
                    {' to '}
                    {request.end_date}
                  </div>

                  <div className="text-sm text-gray-600 mt-2">
                    Reason: {request.reason}
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>


      {/* System Summary */}
      <div className="bg-white rounded-xl shadow-sm p-8 mt-8">

        <h3 className="text-2xl font-semibold text-gray-800">
          SmartBiz Manager
        </h3>

        <p className="text-gray-500 mt-3 text-lg">
          Customer, employee, lead, attendance and leave
          information is managed through one integrated
          CRM and HR platform.
        </p>

      </div>

    </div>
  )
}

export default Dashboard