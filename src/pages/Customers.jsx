import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../config'

function Customers() {

  const [customers, setCustomers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })


  // Load customers when page opens
  useEffect(() => {
    fetchCustomers()
  }, [])


  // Get customers from Express API
  const fetchCustomers = async () => {

    try {

      setLoading(true)

      const response = await fetch(
  API_ENDPOINTS.CUSTOMERS_LIST
)

      if (!response.ok) {
        throw new Error('Could not load customers')
      }

      const data = await response.json()

      setCustomers(data)

    } catch (error) {

      console.error(error)

      setError(
        'Unable to load customer records.'
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


  // Save customer to database
  const handleSubmit = async (event) => {

    event.preventDefault()

    try {

      setError('')

      const response = await fetch(
  API_ENDPOINTS.CUSTOMERS_CREATE,
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
          data.error || 'Unable to save customer'
        )

      }

      // Add returned database record to table
      setCustomers([
        data,
        ...customers
      ])

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
      })

      setShowForm(false)

    } catch (error) {

      console.error(error)

      setError(error.message)

    }
  }


  // Delete customer from database
  const deleteCustomer = async (id) => {

    try {

      const response = await fetch(
  API_ENDPOINTS.CUSTOMERS_DELETE(id),
  {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {

        throw new Error(
          data.error || 'Unable to delete customer'
        )

      }

      setCustomers(
        customers.filter(
          (customer) => customer.id !== id
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
      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-4xl font-bold text-gray-800">
            Customers
          </h2>

          <p className="text-gray-500 mt-2 text-xl">
            Manage customer information and CRM records.
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
            : '+ Add Customer'}

        </button>

      </div>


      {/* Error Message */}
      {error && (

        <div className="bg-red-100 text-red-700 px-5 py-4 rounded-lg mt-6">

          {error}

        </div>

      )}


      {/* Add Customer Form */}
      {showForm && (

        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">

          <h3 className="text-2xl font-semibold text-gray-800 mb-6">

            Add New Customer

          </h3>


          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              {/* Name */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter customer name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* Company */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
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
                  placeholder="customer@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>


              {/* Phone */}
              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>

            </div>


            <div className="mt-6">

              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800"
              >

                Save Customer

              </button>

            </div>

          </form>

        </div>
      )}


      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">

        <div className="p-6 border-b">

          <h3 className="text-2xl font-semibold text-gray-800">
            Customer List
          </h3>

          <p className="text-gray-500 mt-1">

            {customers.length} customer
            {customers.length !== 1 ? 's' : ''}

          </p>

        </div>


        {loading ? (

          <div className="p-12 text-center text-gray-500">

            Loading customers...

          </div>

        ) : customers.length === 0 ? (

          <div className="p-12 text-center">

            <p className="text-gray-500 text-lg">

              No customers have been added yet.

            </p>

            <p className="text-gray-400 mt-2">

              Click Add Customer to create your first CRM record.

            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Company
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Phone
                  </th>

                  <th className="text-left px-6 py-4 text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {customers.map(
                  (customer) => (

                    <tr
                      key={customer.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium">

                        {customer.name}

                      </td>

                      <td className="px-6 py-4">

                        {customer.company || '—'}

                      </td>

                      <td className="px-6 py-4">

                        {customer.email}

                      </td>

                      <td className="px-6 py-4">

                        {customer.phone || '—'}

                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            deleteCustomer(customer.id)
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

export default Customers