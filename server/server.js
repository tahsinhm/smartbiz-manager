console.log('Current working directory:', process.cwd())
console.log('Node environment:', process.env.NODE_ENV || 'not set')

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('./supabaseClient')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'SmartBiz Manager API is working',
  })
})


// ===========================
// CUSTOMER ROUTES
// ===========================

// GET all customers
app.get('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})


// POST customer
app.post('/api/customers', async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone
    } = req.body

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required',
      })
    }

    const { data, error } = await supabase
      .from('customers')
      .insert({
        name,
        company,
        email,
        phone,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})


// DELETE customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.json({
      message: 'Customer deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})


// ===========================
// EMPLOYEE ROUTES
// ===========================

// GET all employees
app.get('/api/employees', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})


// POST employee
app.post('/api/employees', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      role,
      department,
      status
    } = req.body

    if (
      !firstName ||
      !lastName ||
      !email ||
      !role ||
      !department
    ) {
      return res.status(400).json({
        error: 'Please complete all required fields',
      })
    }

    const { data, error } = await supabase
      .from('employees')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        role,
        department,
        status,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})


// DELETE employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.json({
      message: 'Employee deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})


// Start server

// ===========================
// ATTENDANCE ROUTES
// ===========================

// GET all attendance records
console.log('Attendance routes are being registered')
app.get('/api/attendance', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.json(data)

  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})


// POST attendance record
app.post('/api/attendance', async (req, res) => {
  try {
    const {
      employeeId,
      date,
      status,
      notes
    } = req.body

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        error: 'Employee, date and status are required',
      })
    }

    const { data, error } = await supabase
      .from('attendance')
      .insert({
        employee_id: employeeId,
        date,
        status,
        notes,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.status(201).json(data)

  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})


// DELETE attendance record
app.delete('/api/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.json({
      message: 'Attendance record deleted successfully',
    })

  } catch (error) {
    res.status(500).json({
      error: 'Server error',
    })
  }
})
console.log('Attendance routes loaded')

// ===========================
// DASHBOARD ROUTE
// ===========================

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    // Get today's date as YYYY-MM-DD
    const now = new Date()

    const today =
      `${now.getFullYear()}-` +
      `${String(now.getMonth() + 1).padStart(2, '0')}-` +
      `${String(now.getDate()).padStart(2, '0')}`

    const [
      customersResult,
      employeesResult,
      activeEmployeesResult,
      attendanceResult
    ] = await Promise.all([

      // Total customers
      supabase
        .from('customers')
        .select('*', {
          count: 'exact',
          head: true,
        }),

      // Total employees
      supabase
        .from('employees')
        .select('*', {
          count: 'exact',
          head: true,
        }),

      // Active employees
      supabase
        .from('employees')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'Active'),

      // Attendance records for today
      supabase
        .from('attendance')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('date', today),
    ])

    // Check for database errors
    const errors = [
      customersResult.error,
      employeesResult.error,
      activeEmployeesResult.error,
      attendanceResult.error,
    ].filter(Boolean)

    if (errors.length > 0) {
      return res.status(500).json({
        error: errors[0].message,
      })
    }

    res.json({
      customers: customersResult.count || 0,
      employees: employeesResult.count || 0,
      activeEmployees: activeEmployeesResult.count || 0,
      attendanceToday: attendanceResult.count || 0,
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Server error',
    })
  }
})

// ===========================
// AUTHENTICATION ROUTES
// ===========================


// Create the first administrator account
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate form
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters',
      })
    }

    // Check whether a user already exists
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', {
        count: 'exact',
        head: true,
      })

    if (countError) {
      return res.status(500).json({
        error: countError.message,
      })
    }

    // Only allow this route to create the first admin
    if (count > 0) {
      return res.status(403).json({
        error: 'Administrator account already exists',
      })
    }

    const cleanEmail = email.trim().toLowerCase()

    // Hash password
    const passwordHash = await bcrypt.hash(
      password,
      10
    )

    // Save administrator
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email: cleanEmail,
        password_hash: passwordHash,
        role: 'Admin',
      })
      .select('id, name, email, role, created_at')
      .single()

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.status(201).json({
      message: 'Administrator created successfully',
      user: data,
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Server error',
    })
  }
})


// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      })
    }

    const cleanEmail = email.trim().toLowerCase()

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      })
    }

    // Compare entered password with stored hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password',
      })
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      }
    )

    res.json({
      message: 'Login successful',

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

  } catch (error) {
    console.error('Login error:', error.message || error)
    console.error('Stack:', error.stack)

    res.status(500).json({
      error: 'Server error',
    })
  }
})

app.listen(PORT, () => {
  console.log(`SmartBiz Manager API running on port ${PORT}`)
  console.log('Customer and employee routes loaded')
})