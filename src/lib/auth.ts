// Simple admin authentication system (frontend-only)
const ADMIN_PASSWORD = 'admin123'; // Simple password for demo purposes

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function getAuthState(): AuthState {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  return { isAuthenticated, isAdmin };
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isAdmin', 'true');
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminToken'); // Also remove API token
}

export function isAdmin(): boolean {
  return getAuthState().isAdmin;
}
