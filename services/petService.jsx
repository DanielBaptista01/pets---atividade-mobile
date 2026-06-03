const BASE_URL = "https://petadopt.onrender.com";

export async function login(email, password) {
  // Voltou para /user/login que é a rota real do servidor
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error("E-mail ou senha incorretos.");
  return await response.json();
}

export async function register(nameOrObj, email, phone, password, confirmPassword) {
  let payload = {};

  // Se a tela passou um objeto único (ex: formData)
  if (typeof nameOrObj === 'object' && nameOrObj !== null) {
    payload = {
      name: nameOrObj.name,
      email: nameOrObj.email,
      phone: nameOrObj.phone,
      password: nameOrObj.password,
      // Envia das duas formas para garantir que o banco do professor aceite
      confirmPassword: nameOrObj.confirmPassword || nameOrObj.confirmpassword,
      confirmpassword: nameOrObj.confirmpassword || nameOrObj.confirmPassword
    };
  } else {
    // Se a tela passou os argumentos soltos
    payload = {
      name: nameOrObj,
      email,
      phone,
      password,
      confirmPassword,
      confirmpassword: confirmPassword
    };
  }

  const response = await fetch(`${BASE_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    // Tenta pegar o motivo exato do erro enviado pelo servidor do professor
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao criar conta. Verifique os dados.");
  }

  return await response.json();
}
export async function fetchPets() {
  const response = await fetch(`${BASE_URL}/pet/pets`, { method: "GET" });
  if (!response.ok) throw new Error("Erro ao carregar a lista de pets.");
  return await response.json();
}

export async function fetchMyPets(token) {
  if (!token) throw new Error("Token não fornecido.");

  // Garante o tratamento do token caso precise ou não do prefixo Bearer
  const cleanToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/pet/mypets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "authorization": cleanToken
    }
  });
  if (!response.ok) throw new Error("Erro ao carregar seus pets cadastrados.");
  return await response.json();
}

export async function createPet(petData, token) {
  if (!token) throw new Error("Token não fornecido.");
  const cleanToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/pet/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": cleanToken
    },
    body: JSON.stringify(petData)
  });
  if (!response.ok) throw new Error("Erro ao cadastrar o pet. Verifique os campos.");
  return await response.json();
}


export async function updatePet(petId, petData, token) {
  if (!token) throw new Error("Token não fornecido.");
  const cleanToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  // CORRIGIDO: URL alterada para /pet/edit/{id} conforme mapeado no Swagger
  const response = await fetch(`${BASE_URL}/pet/${petId}`, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": cleanToken
    },
    body: JSON.stringify(petData)
  });

  if (!response.ok) {
    throw new Error("Não foi possível atualizar os dados do pet no servidor.");
  }
  
  return await response.json();
}

