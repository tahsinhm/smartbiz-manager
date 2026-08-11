import { useState } from 'react'
import { useNavigate } from 'react-router'
import { API_ENDPOINTS } from '../config'
function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await fetch(
  API_ENDPOINTS.LOGIN,
  {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Login failed'
        )
      }

      // Save JWT and basic user information
      localStorage.setItem(
        'smartbiz_token',
        data.token
      )

      localStorage.setItem(
        'smartbiz_user',
        JSON.stringify(data.user)
      )

      // Go to Dashboard
      navigate('/')

    } catch (error) {
      setError(error.message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm p-10">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-blue-700">
            SmartBiz Manager
          </h1>

          <p className="text-gray-500 mt-3">
            CRM and HR Management Platform
          </p>

        </div>


        <div className="mt-10">

          <h2 className="text-2xl font-semibold text-gray-800">
            Sign In
          </h2>

          <p className="text-gray-500 mt-2">
            Enter your account details to continue.
          </p>


          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mt-5">
              {error}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="mt-7"
          >

            {/* Email */}
            <div>

              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                placeholder="admin@smartbiz.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
              />

            </div>


            {/* Password */}
            <div className="mt-5">

              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium mt-7 hover:bg-blue-800 disabled:opacity-50"
            >
              {loading
                ? 'Signing in...'
                : 'Sign In'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default Login