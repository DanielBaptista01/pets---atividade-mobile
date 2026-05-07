const API_URL = 'https://petadopt.onrender.com';

export async function getPets() {
  const response = await fetch(`${API_URL}/pet/pets`);
  if (!response.ok) {
    throw new Error('Erro ao buscar pets');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.pets || [];
}

export async function registerUser(name, email, password, phone, confirmpassword) {
  const response = await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password, phone, confirmpassword })
  });

  if (!response.ok) {
    throw new Error('Erro ao registrar usuário');
  }

  return await response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/user/login`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'E-mail ou senha inválidos');
  return data;
}
