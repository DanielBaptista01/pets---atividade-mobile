const API_URL = "https://petadopt.onrender.com";

export async function getPets() {
  const response = await fetch(`${API_URL}/pet/pets`);
  if (!response.ok) {
    throw new Error("Erro ao buscar pets");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.pets || [];
}

export async function registerUser(
  name,
  email,
  password,
  phone,
  confirmpassword,
) {
  const response = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, phone, confirmpassword }),
  });

  if (!response.ok) {
    throw new Error("Erro ao registrar usuário");
  }

  return await response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "E-mail ou senha inválidos");
  return data;
}

export async function createPet(petData, token) {
  const response = await fetch(`${API_URL}/pet/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(petData),
  });

  // 1. Transforma em JSON apenas uma vez
  const data = await response.json();

  // 2. Agora você pode printar o objeto real no console com segurança
  console.log("Resposta da API:", data);

  if (!response.ok) {
    throw new Error(data.message || "Erro ao criar pet");
  }

  // 3. Retorna os dados já processados
  return data;
}
