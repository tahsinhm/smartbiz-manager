import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../config'
function Employees() {

  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    status: 'Active',
  })


  // Load employees when the page opens
  useEffect(() => {
    fetchEmployees()
  }, [])


  // Get employees from Express
  const fetchEmployees = async () => {
    try {
      setLoading(true)

      const response = await fetch(
  API_ENDPOINTS.EMPLOYEES_LIST
)

      if (!response.ok) {
        throw new Error('Could not load employees')
      }

      const data = await response.json()

      setEmployees(data)

    } catch (error) {
      console.error(error)

      setError(
        'Unable to load employee records.'
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


  // Save employee to PostgreSQL
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch(
  API_ENDPOINTS.EMPLOYEES_CREATE,
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
          data.error || 'Unable to save employee'
        )
      }

      setEmployees([
        data,
        ...employees
      ])

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        department: '',
        status: 'Active',
      })

      setShowForm(false)

    } catch (error) {
      console.error(error)

      setError(error.message)
    }
  }


  // Delete employee from PostgreSQL
  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(
  API_ENDPOINTS.EMPLOYEES_DELETE(id),
  {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to delete employee'
        )
      }

      setEmployees(
        employees.filter(
          (employee) => employee.id !== id
        )
      )

    } catch (error) {
      console.error(error)

      setError(error.message)
    }
  }


  return (
    <div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        <div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Employees
          </h2>

          <p className="text-gray-500 mt-2 text-base sm:text-xl">
            Manage employee and HR information.
          </p>

        </div>


        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="bg-blue-700 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-800 w-full sm:w-auto"
        >

          {showForm
            ? 'Cancel'
            : '+ Add Employee'}

        </button>

      </div>


      {/* Error */}
      {error && (

        <div className="bg-red-100 text-red-700 px-5 py-4 rounded-lg mt-6">
          {error}
        </div>

      )}


      {/* Add Employee Form */}
      {showForm && (

        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">

          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Employee
          </h3>


          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              {/* First Name */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* Last Name */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* Email */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="employee@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* Role */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Role
                </label>

                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Sales Manager"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* Department */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Department
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                >

                  <option value="">
                    Select department
                  </option>

                  <option value="Management">
                    Management
                  </option>

                  <option value="Sales">
                    Sales
                  </option>

                  <option value="Human Resources">
                    Human Resources
                  </option>

                  <option value="Marketing">
                    Marketing
                  </option>

                  <option value="IT">
                    IT
                  </option>

                  <option value="Operations">
                    Operations
                  </option>

                </select>

              </div>


              {/* Status */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Employment Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="On Leave">
                    On Leave
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>


            <div className="mt-6">

              <button
                type="submit"
                className="bg-blue-700 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-800 w-full sm:w-auto"
              >
                Save Employee
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">

        <div className="p-6 border-b">

          <h3 className="text-2xl font-semibold text-gray-800">
            Employee List
          </h3>

          <p className="text-gray-500 mt-1">

            {employees.length} employee
            {employees.length !== 1 ? 's' : ''}

          </p>

        </div>


        {loading ? (

          <div className="p-12 text-center text-gray-500">
            Loading employees...
          </div>

        ) : employees.length === 0 ? (

          <div className="p-12 text-center">

            <p className="text-gray-500 text-lg">
              No employees have been added yet.
            </p>

            <p className="text-gray-400 mt-2">
              Click Add Employee to create your first HR record.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Role
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Department
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {employees.map(
                  (employee) => (

                    <tr
                      key={employee.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium">

                        {employee.first_name}{' '}
                        {employee.last_name}

                      </td>

                      <td className="px-6 py-4">
                        {employee.email}
                      </td>

                      <td className="px-6 py-4">
                        {employee.role}
                      </td>

                      <td className="px-6 py-4">
                        {employee.department}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            employee.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : employee.status === 'On Leave'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >

                          {employee.status}

                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            deleteEmployee(employee.id)
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

export default Employees