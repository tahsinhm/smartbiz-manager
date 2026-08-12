export const API_URL = 'https://smartbiz-manager.onrender.com'

export const API_ENDPOINTS = {
  CUSTOMERS_LIST: `${API_URL}/api/customers`,
  CUSTOMERS_CREATE: `${API_URL}/api/customers`,
  CUSTOMERS_DELETE: (id) => `${API_URL}/api/customers/${id}`,

  EMPLOYEES_LIST: `${API_URL}/api/employees`,
  EMPLOYEES_CREATE: `${API_URL}/api/employees`,
  EMPLOYEES_DELETE: (id) => `${API_URL}/api/employees/${id}`,

  ATTENDANCE_LIST: `${API_URL}/api/attendance`,
  ATTENDANCE_CREATE: `${API_URL}/api/attendance`,
  ATTENDANCE_DELETE: (id) => `${API_URL}/api/attendance/${id}`,

  LEADS_LIST: `${API_URL}/api/leads`,
LEADS_CREATE: `${API_URL}/api/leads`,
LEADS_DELETE: (id) => `${API_URL}/api/leads/${id}`,

LEAVE_REQUESTS_LIST: `${API_URL}/api/leave-requests`,
LEAVE_REQUESTS_CREATE: `${API_URL}/api/leave-requests`,
LEAVE_REQUESTS_UPDATE_STATUS: (id) =>
  `${API_URL}/api/leave-requests/${id}/status`,
LEAVE_REQUESTS_DELETE: (id) =>
  `${API_URL}/api/leave-requests/${id}`,

  DASHBOARD_STATS: `${API_URL}/api/dashboard-stats`,
  LOGIN: `${API_URL}/api/auth/login`,
}