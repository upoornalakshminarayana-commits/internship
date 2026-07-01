// We define our base URL here. If we are running locally, it uses localhost.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * A beginner-friendly fetch wrapper.
 * Instead of using an advanced library like 'axios', we use standard JavaScript fetch().
 * This function automatically adds the authentication token to every request.
 */
async function fetchWithAuth(endpoint, options = {}) {
  // 1. Get the logged-in user's token from local storage
  const token = localStorage.getItem('access_token');
  
  // 2. Set up headers
  const headers = { ...options.headers };
  
  // If we are NOT uploading a file (FormData), we tell the server we are sending JSON data
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // 3. If the user is logged in (token exists), attach it to the request
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 4. Make the network request to the backend server
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 5. If the server says "401 Unauthorized" (token expired or invalid)
  if (response.status === 401) {
    // For simplicity, we just clear the storage and redirect to the login page.
    // Advanced apps use "refresh tokens" here, but logging out is easier to understand!
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  // 6. Handle errors from the server (like 400 Bad Request)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // We throw an error that mimics what our components expect so they can show the message
    throw { response: { data: errorData } }; 
  }

  // 7. If it's a 204 No Content response (like when we delete something), return empty
  if (response.status === 204) return { data: null };

  // 8. Otherwise, parse the JSON response and return it
  const data = await response.json();
  
  // We wrap it in a { data } object because our components were built to expect Axios-style responses
  return { data };
}

// ── Auth Services ──────────────────────────────────────────────
export const authService = {
  // We use standard fetch for login/register since they don't need tokens yet
  register: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw { response: { data: await res.json() } };
    return { data: await res.json() };
  },
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw { response: { data: await res.json() } };
    return { data: await res.json() };
  }
};

// ── Jobs Services ──────────────────────────────────────────────
export const jobService = {
  // Notice how we use our fetchWithAuth helper to automatically include the token!
  getAll: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/jobs/?${queryString}`, { method: 'GET' });
  },
  getById: (id) => fetchWithAuth(`/jobs/${id}/`, { method: 'GET' }),
  create: (data) => fetchWithAuth('/jobs/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`/jobs/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => fetchWithAuth(`/jobs/${id}/`, { method: 'DELETE' }),
  saveJob: (id) => fetchWithAuth(`/jobs/${id}/save_job/`, { method: 'POST' }),
  unsaveJob: (id) => fetchWithAuth(`/jobs/${id}/unsave_job/`, { method: 'POST' }),
  getSaved: () => fetchWithAuth('/jobs/saved/', { method: 'GET' }),
};

// ── Applications Services ──────────────────────────────────────
export const applicationService = {
  getAll: () => fetchWithAuth('/applications/', { method: 'GET' }),
  apply: (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) form.append(k, v); });
    // When sending FormData, our helper won't set Content-Type to JSON (which is correct for files!)
    return fetchWithAuth('/applications/', { method: 'POST', body: form });
  },
  updateStatus: (id, status) => fetchWithAuth(`/applications/${id}/`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Profile Services ───────────────────────────────────────────
export const profileService = {
  get: () => fetchWithAuth('/profile/', { method: 'GET' }),
  update: (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) form.append(k, v); });
    return fetchWithAuth('/profile/', { method: 'PUT', body: form });
  },
};

// ── Dashboard Services ─────────────────────────────────────────
export const dashboardService = {
  getStats: () => fetchWithAuth('/dashboard/', { method: 'GET' }),
};
