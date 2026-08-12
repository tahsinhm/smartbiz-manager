import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../config'

function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  })


  // Load leave requests and employees
  useEffect(() => {
    loadPageData()
  }, [])


  const loadPageData = async () => {
    try {
      setLoading(true)
      setError('')

      // Load leave requests
      const leaveResponse = await fetch(
        API_ENDPOINTS.LEAVE_REQUESTS_LIST
      )

      if (!leaveResponse.ok) {
        throw new Error('Could not load leave requests')
      }

      const leaveData = await leaveResponse.json()


      // Load employees for dropdown
      const employeeResponse = await fetch(
        API_ENDPOINTS.EMPLOYEES_LIST
      )

      if (!employeeResponse.ok) {
        throw new Error('Could not load employees')
      }

      const employeeData = await employeeResponse.json()

      setLeaveRequests(leaveData)
      setEmployees(employeeData)

    } catch (error) {
      console.error(error)

      setError(
        'Unable to load leave requests.'
      )

    } finally {
      setLoading(false)
    }
  }


  // Update form
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }


  // Create leave request
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError('')

      if (formData.endDate < formData.startDate) {
        throw new Error(
          'End date cannot be before start date'
        )
      }

      const response = await fetch(
        API_ENDPOINTS.LEAVE_REQUESTS_CREATE,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Unable to create leave request'
        )
      }

      setLeaveRequests([
        data,
        ...leaveRequests,
      ])

      setFormData({
        employeeId: '',
        startDate: '',
        endDate: '',
        reason: '',
      })

      setShowForm(false)

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }


  // Approve or reject leave
  const updateStatus = async (id, status) => {
    try {
      setError('')

      const response = await fetch(
        API_ENDPOINTS.LEAVE_REQUESTS_UPDATE_STATUS(id),
        {
          method: 'PATCH',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            status,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Unable to update leave request'
        )
      }

      setLeaveRequests(
        leaveRequests.map((request) =>
          request.id === id
            ? data
            : request
        )
      )

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }


  // Delete leave request
  const deleteLeaveRequest = async (id) => {
    try {
      setError('')

      const response = await fetch(
        API_ENDPOINTS.LEAVE_REQUESTS_DELETE(id),
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Unable to delete leave request'
        )
      }

      setLeaveRequests(
        leaveRequests.filter(
          (request) => request.id !== id
        )
      )

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }


  // Find employee name from employee_id
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

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-4xl font-bold text-gray-800">
            Leave Requests
          </h2>

          <p className="text-gray-500 mt-2 text-xl">
            Review and manage employee leave requests.
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800"
        >
          {showForm
            ? 'Cancel'
            : '+ New Leave Request'}
        </button>

      </div>


      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 px-5 py-4 rounded-lg mt-6">
          {error}
        </div>
      )}


      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">

          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Create Leave Request
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Employee */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Employee
                </label>

                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="">
                    Select employee
                  </option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.first_name}{' '}
                      {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>


              {/* Start Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>


              {/* End Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>


              {/* Reason */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Reason
                </label>

                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  placeholder="Enter reason for leave"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

            </div>


            <button
              type="submit"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium mt-6 hover:bg-blue-800"
            >
              Submit Leave Request
            </button>

          </form>

        </div>
      )}


      {/* Leave Request Table */}
      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">

        <div className="p-6 border-b">

          <h3 className="text-2xl font-semibold text-gray-800">
            Leave Request List
          </h3>

          <p className="text-gray-500 mt-1">
            {leaveRequests.length} request
            {leaveRequests.length !== 1 ? 's' : ''}
          </p>

        </div>


        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading leave requests...
          </div>

        ) : leaveRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No leave requests have been submitted yet.
          </div>

        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">
                <tr>

                  <th className="text-left px-6 py-4">
                    Employee
                  </th>

                  <th className="text-left px-6 py-4">
                    Dates
                  </th>

                  <th className="text-left px-6 py-4">
                    Reason
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>

                  <th className="text-left px-6 py-4">
                    Actions
                  </th>

                </tr>
              </thead>


              <tbody>

                {leaveRequests.map((request) => (

                  <tr
                    key={request.id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* Employee */}
                    <td className="px-6 py-4 font-medium">
                      {getEmployeeName(
                        request.employee_id
                      )}
                    </td>


                    {/* Dates */}
                    <td className="px-6 py-4">
                      <div>
                        {request.start_date}
                      </div>

                      <div className="text-sm text-gray-500">
                        to {request.end_date}
                      </div>
                    </td>


                    {/* Reason */}
                    <td className="px-6 py-4">
                      {request.reason}
                    </td>


                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {request.status}
                      </span>

                    </td>


                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex gap-3">

                        {request.status === 'Pending' && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(
                                  request.id,
                                  'Approved'
                                )
                              }
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  request.id,
                                  'Rejected'
                                )
                              }
                              className="text-orange-600 hover:text-orange-800 font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() =>
                            deleteLeaveRequest(
                              request.id
                            )
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default LeaveRequests