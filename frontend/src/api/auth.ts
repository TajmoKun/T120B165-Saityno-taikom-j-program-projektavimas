export async function login(host: string, email: string, password: string) {
  const response = await fetch(`${host}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function register(host: string, username: string, email: string, password: string) {
  const response = await fetch(`${host}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

export async function logout(host: string, token: string) {
  const response = await fetch(`${host}/api/auth/logout`, {
    method: 'POST',
    headers: { 'x-auth-token': token },
  });
  if (!response.ok) throw new Error('Logout failed');
  return response.json();
}