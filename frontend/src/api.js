// Single place to change the backend URL — all components import from here
export const API_URL = 'http://localhost:5000';

// Reads the JWT token from storage and injects it into every request's headers
export function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// Wrapper around fetch that auto-redirects to /login on 401 (expired/invalid token)
export async function authFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });
  if (res.status === 401) {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
    return null;
  }
  return res;
}
