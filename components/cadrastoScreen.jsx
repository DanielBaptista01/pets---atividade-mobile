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
      <View style={styles.card}>
        <Text style={styles.logoEmoji}>✨</Text>
        
        <Text style={styles.welcomeTitle}>Crie sua conta</Text>
        <Text style={styles.welcomeSubtitle}>Comece sua jornada para ajudar e adotar novos amigos</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <TextInput
          placeholder="Nome Completo"
          placeholderTextColor="#8E8E93"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#8E8E93"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Telefone / Whatsapp"
          placeholderTextColor="#8E8E93"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#8E8E93"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Confirmar Senha"
          placeholderTextColor="#8E8E93"
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
      </View>
    </ScrollView>
  );
}

// --- TABELA DE ESTILOS PADRONIZADA E PREMIUM ---
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FAF8F5', // Areia pastel suave para o fundo da tela inteira
    padding: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: '#E6DFD3', // Bege suave delimitando o card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  logoEmoji: {
    fontSize: 44,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1D1E', // Grafite escuro moderno
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  errorText: { 
    color: '#FF4D4D', 
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#FFEBEB',
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#FFC1C1',
  },
  input: { 
    width: '100%', 
    padding: 16, 
    backgroundColor: '#FAF8F5', // Fundo sutil combinando com a identidade visual
    marginBottom: 14, 
    borderRadius: 14, 
    fontSize: 15,
    color: '#1A1D1E',
    borderWidth: 1,
    borderColor: '#E6DFD3',
  },
  actionButton: { 
    backgroundColor: '#1A1D1E', // Botão escuro de alto contraste
    padding: 16, 
    borderRadius: 14, 
    width: '100%', 
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: { 
    color: '#FFF', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: { 
    marginTop: 24,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  linkButtonBold: {
    color: '#A37854', // Destaque na cor terracota principal do novo tema
    fontWeight: 'bold',
  }
});