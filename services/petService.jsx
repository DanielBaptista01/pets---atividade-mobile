const BASE_URL = "https://petadopt.onrender.com"; 

export async function login(email, password) {
  // Rota de login direto na raiz do servidor
  const response = await fetch(`${BASE_URL}/user/login`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error("E-mail ou senha incorretos.");
  return await response.json();
}

export async function register(name, email, phone, password, confirmpassword) {
  // Rota de registro direto na raiz do servidor
  const response = await fetch(`${BASE_URL}/user/register`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password, confirmpassword })
  });
  if (!response.ok) throw new Error("Erro ao criar conta. Verifique os dados.");
  return await response.json();
}

export async function fetchPets() {
  // A rota global de listagem mantendo o prefixo /pet/pets conforme o comportamento anterior
  const response = await fetch(`${BASE_URL}/pet/pets`, { method: "GET" });
  if (!response.ok) throw new Error("Erro ao carregar a lista de pets.");
  return await response.json();
}

export async function fetchMyPets(token) {
  const response = await fetch(`${BASE_URL}/pet/mypets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    }
  });
  if (!response.ok) throw new Error("Erro ao carregar seus pets cadastrados.");
  return await response.json();
}

export async function createPet(petData, token) {
  const response = await fetch(`${BASE_URL}/pet/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    },
    body: JSON.stringify(petData)
  });
  if (!response.ok) throw new Error("Erro ao cadastrar o pet. Verifique os campos.");
  return await response.json();
}

export async function deletePet(petId, token) {
  const response = await fetch(`${BASE_URL}/pet/${petId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    }
  });
  if (!response.ok) throw new Error("Não foi possível excluir este pet.");
  return await response.json();
}