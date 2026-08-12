import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../config'

function Leads() {
  const [leads, setLeads] = useState([])
  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    email: '',
    phone: '',
    enquiry: '',
    status: 'New',
    assignedEmployeeId: '',
    followUpDate: '',
  })

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    try {
      setLoading(true)

      const leadsResponse = await fetch(
        API_ENDPOINTS.LEADS_LIST
      )

      if (!leadsResponse.ok) {
        throw new Error('Could not load leads')
      }

      const leadsData = await leadsResponse.json()

      const employeeResponse = await fetch(
        API_ENDPOINTS.EMPLOYEES_LIST
      )

      if (!employeeResponse.ok) {
        throw new Error('Could not load employees')
      }

      const employeeData = await employeeResponse.json()

      setLeads(leadsData)
      setEmployees(employeeData)

    } catch (error) {
      console.error(error)
      setError('Unable to load lead records.')

    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch(
        API_ENDPOINTS.LEADS_CREATE,
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
          data.error || 'Unable to save lead'
        )
      }

      setLeads([
        data,
        ...leads
      ])

      setFormData({
        clientName: '',
        company: '',
        email: '',
        phone: '',
        enquiry: '',
        status: 'New',
        assignedEmployeeId: '',
        followUpDate: '',
      })

      setShowForm(false)

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const deleteLead = async (id) => {
    try {
      const response = await fetch(
        API_ENDPOINTS.LEADS_DELETE(id),
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to delete lead'
        )
      }

      setLeads(
        leads.filter(
          (lead) => lead.id !== id
        )
      )

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const getEmployeeName = (employeeId) => {
    if (!employeeId) {
      return 'Unassigned'
    }

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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Leads
          </h2>

          <p className="text-gray-500 mt-2 text-base sm:text-xl">
            Manage customer enquiries and follow-ups.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-700 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-800 w-full sm:w-auto"
        >
          {showForm ? 'Cancel' : '+ Add Lead'}
        </button>

      </div>


      {error && (
        <div className="bg-red-100 text-red-700 px-5 py-4 rounded-lg mt-6">
          {error}
        </div>
      )}


      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">

          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Lead
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Client Name
                </label>

                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Assigned Employee
                </label>

                <select
                  name="assignedEmployeeId"
                  value={formData.assignedEmployeeId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="">
                    Unassigned
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

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="New">
                    New
                  </option>

                  <option value="Contacted">
                    Contacted
                  </option>

                  <option value="Converted">
                    Converted
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Follow-up Date
                </label>

                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Enquiry
                </label>

                <textarea
                  name="enquiry"
                  value={formData.enquiry}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

            </div>

            <button
              type="submit"
              className="bg-blue-700 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-800 w-full sm:w-auto"
            >
              Save Lead
            </button>

          </form>

        </div>
      )}


      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">

        <div className="p-6 border-b">
          <h3 className="text-2xl font-semibold text-gray-800">
            Lead List
          </h3>

          <p className="text-gray-500 mt-1">
            {leads.length} lead
            {leads.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading leads...
          </div>

        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No leads have been added yet.
          </div>

        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4">
                    Client
                  </th>

                  <th className="text-left px-6 py-4">
                    Company
                  </th>

                  <th className="text-left px-6 py-4">
                    Assigned To
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>

                  <th className="text-left px-6 py-4">
                    Follow-up
                  </th>

                  <th className="text-left px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

{leads.map((lead) => (
  <>
    <tr
      key={lead.id}
      className="border-t hover:bg-gray-50"
    >

      <td className="px-6 py-4">
        <div className="font-medium">
          {lead.client_name}
        </div>

        <div className="text-sm text-gray-500">
          {lead.email}
        </div>
      </td>

      <td className="px-6 py-4">
        {lead.company || '—'}
      </td>

      <td className="px-6 py-4">
        {getEmployeeName(
          lead.assigned_employee_id
        )}
      </td>

      <td className="px-6 py-4">
        {lead.status}
      </td>

      <td className="px-6 py-4">
        {lead.follow_up_date || '—'}
      </td>

      <td className="px-6 py-4">
        <button
          onClick={() =>
            deleteLead(lead.id)
          }
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Delete
        </button>
      </td>

    </tr>

    <tr className="bg-gray-50">
      <td
        colSpan="6"
        className="px-6 py-4"
      >
        <span className="font-semibold text-gray-700">
          Enquiry:
        </span>

        <span className="text-gray-600 ml-2">
          {lead.enquiry || '—'}
        </span>
      </td>
    </tr>
  </>
))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default Leads