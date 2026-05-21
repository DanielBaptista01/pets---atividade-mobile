import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useUserRegister } from "../context/userContext";

export function CadastroScreen({ onRegisterSuccess, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { fetchuserRegister } = useUserRegister();

  async function handleRegister() {
    if (!name || !email || !password || !phone || !confirmpassword) {
      setError('Preencha todos os campos');
      return;
    }
    if (password !== confirmpassword) {
      setError('As senhas não coincidem');
      return;
    }
    try {
      const response = await fetchuserRegister(name, email, password, phone, confirmpassword);
      if (onRegisterSuccess) {
        onRegisterSuccess(response);
      }
    } catch (err) {
      setError(err.message || 'Erro ao registrar usuário');
    }
  }

  return (
    // Usamos ScrollView para garantir que o teclado não cubra os campos em telas menores
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.logoEmoji}>✨</Text>
      
      <Text style={styles.welcomeTitle}>Crie sua conta</Text>
      <Text style={styles.welcomeSubtitle}>Comece sua jornada para ajudar e adotar novos amigos</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <TextInput
        placeholder="Nome Completo"
        placeholderTextColor="#A0A7B0"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#A0A7B0"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Telefone / Whatsapp"
        placeholderTextColor="#A0A7B0"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#A0A7B0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmar Senha"
        placeholderTextColor="#A0A7B0"
        value={confirmpassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleRegister} style={styles.actionButton} activeOpacity={0.8}>
        <Text style={styles.actionButtonText}>Cadastrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onGoToLogin} style={styles.linkButton}>
        <Text style={styles.linkButtonText}>Já tem uma conta? <Text style={styles.linkButtonBold}>Faça login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- TABELA DE ESTILOS PADRONIZADA ---
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    justifyContent: 'center', 
    backgroundColor: '#FFF',
    padding: 24,
  },
  logoEmoji: {
    fontSize: 44,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1D1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#A0A7B0',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 15,
  },
  errorText: { 
    color: '#FF4D4D', 
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#FFEBEB',
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
  },
  input: { 
    width: '100%', 
    padding: 16, 
    backgroundColor: '#F6FAFA', // Fundo pastel idêntico ao login e criação de pet
    marginBottom: 14, 
    borderRadius: 14, 
    fontSize: 15,
    color: '#1A1D1E',
  },
  actionButton: { 
    backgroundColor: '#1A1D1E', // Botão preto premium sólido
    padding: 16, 
    borderRadius: 16, 
    width: '100%', 
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: { 
    color: '#FFF', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: { 
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 20,
  },
  linkButtonText: {
    color: '#666',
    fontSize: 14,
  },
  linkButtonBold: {
    color: '#00A896', // Verde-água de destaque combinando com as abas e botões do app
    fontWeight: 'bold',
  }
});