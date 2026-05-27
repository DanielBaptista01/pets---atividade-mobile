const API_URL = "https://petadopt.onrender.com";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao fazer login");
  }
  return await response.json();
}

export async function register(name, email, phone, password, confirmPassword) { 
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name, 
      email, 
      phone, 
      password, 
      confirmPassword 
    })
  });
  if (!response.ok) throw new Error("Erro ao criar conta. Verifique os dados.");
  return await response.json();
}

export async function fetchPets() {
  const response = await fetch(`${API_URL}/pet/pets`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) throw new Error("Erro ao carregar os pets");
  return await response.json();
}

export async function fetchMyPets(token) {
  const response = await fetch(`${API_URL}/pet/mypets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    }
  });
  if (!response.ok) throw new Error("Erro ao carregar seus pets");
  return await response.json();
}

export async function createPet(petData, token) {
  const response = await fetch(`${API_URL}/pet/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    },
    body: JSON.stringify(petData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao cadastrar pet");
  }
  return await response.json();
}

export async function deletePet(petId, token) {
  const response = await fetch(`${API_URL}/pet/${petId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    }
  });
  if (!response.ok) throw new Error("Não foi possível excluir este pet");
  return await response.json();
}