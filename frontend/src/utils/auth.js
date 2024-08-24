export async function login(email, contrasena) {
  // Lógica para hacer una petición de login al backend
  const response = await fetch('https://vltdnxfz-5000.brs.devtunnels.ms/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contrasena }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function signup(nombre, email, contrasena, rol) {
  // Lógica para hacer una petición de registro al backend
  const response = await fetch('https://vltdnxfz-5000.brs.devtunnels.ms/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, email, contrasena, rol }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  return data;
}
