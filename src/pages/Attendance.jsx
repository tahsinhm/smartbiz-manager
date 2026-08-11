import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../config'
function Attendance() {

  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    status: 'Present',
    notes: '',
  })


  // Load attendance and employees when page opens
  useEffect(() => {
    loadPageData()
  }, [])


  const loadPageData = async () => {
    try {
      setLoading(true)

      // Load attendance records
      const attendanceResponse = await fetch(
  API_ENDPOINTS.ATTENDANCE_LIST
)

      if (!attendanceResponse.ok) {
        throw new Error('Could not load attendance')
      }

      const attendanceData =
        await attendanceResponse.json()


      // Load employees for dropdown
      const employeeResponse = await fetch(
  API_ENDPOINTS.EMPLOYEES_LIST
)

      if (!employeeResponse.ok) {
        throw new Error('Could not load employees')
      }

      const employeeData =
        await employeeResponse.json()


      setAttendance(attendanceData)
      setEmployees(employeeData)

    } catch (error) {
      console.error(error)

      setError(
        'Unable to load attendance records.'
      )

    } finally {
      setLoading(false)
    }
  }


  // Update form values
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }


  // Save attendance
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch(
  API_ENDPOINTS.ATTENDANCE_CREATE,
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
          'Unable to save attendance'
        )
      }

      setAttendance([
        data,
        ...attendance
      ])

      setFormData({
        employeeId: '',
        date: '',
        status: 'Present',
        notes: '',
      })

      setShowForm(false)

    } catch (error) {
      console.error(error)

      setError(error.message)
    }
  }


  // Delete attendance
  const deleteAttendance = async (id) => {
  try {
    const response = await fetch(
      API_ENDPOINTS.ATTENDANCE_DELETE(id),
      {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Unable to delete attendance'
        )
      }

      setAttendance(
        attendance.filter(
          (record) => record.id !== id
        )
      )

    } catch (error) {
      console.error(error)

      setError(error.message)
    }
  }


  // Find employee name using employee_id
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
            Attendance
          </h2>

          <p className="text-gray-500 mt-2 text-xl">
            Manage employee attendance records.
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
            : '+ Add Attendance'}

        </button>

      </div>


      {/* Error */}
      {error && (

        <div className="bg-red-100 text-red-700 px-5 py-4 rounded-lg mt-6">
          {error}
        </div>

      )}


      {/* Attendance Form */}
      {showForm && (

        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">

          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Attendance Record
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                >

                  <option value="">
                    Select employee
                  </option>

                  {employees.map(
                    (employee) => (

                      <option
                        key={employee.id}
                        value={employee.id}
                      >

                        {employee.first_name}{' '}
                        {employee.last_name}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* Date */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* Status */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                >

                  <option value="Present">
                    Present
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                  <option value="Late">
                    Late
                  </option>

                  <option value="On Leave">
                    On Leave
                  </option>

                </select>

              </div>


              {/* Notes */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Notes
                </label>

                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>

            </div>


            <div className="mt-6">

              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800"
              >
                Save Attendance
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">

        <div className="p-6 border-b">

          <h3 className="text-2xl font-semibold text-gray-800">
            Attendance Records
          </h3>

          <p className="text-gray-500 mt-1">

            {attendance.length} record
            {attendance.length !== 1 ? 's' : ''}

          </p>

        </div>


        {loading ? (

          <div className="p-12 text-center text-gray-500">
            Loading attendance...
          </div>

        ) : attendance.length === 0 ? (

          <div className="p-12 text-center">

            <p className="text-gray-500 text-lg">
              No attendance records have been added yet.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Employee
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Date
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Notes
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {attendance.map(
                  (record) => (

                    <tr
                      key={record.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium">

                        {getEmployeeName(
                          record.employee_id
                        )}

                      </td>

                      <td className="px-6 py-4">
                        {record.date}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === 'Present'
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'Absent'
                              ? 'bg-red-100 text-red-700'
                              : record.status === 'Late'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {record.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">
                        {record.notes || '—'}
                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            deleteAttendance(record.id)
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default Attendance