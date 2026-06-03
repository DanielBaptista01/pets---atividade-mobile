import React, { useState } from "react"; 
import { Alert, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { login } from "../services/petService"; 

export default function LoginScreen({onLoginSuccess, onGoToRegister}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if(!email || !password){
        Alert.alert("Aviso", "Preencha e-mail e senha");
        return;
    }

    try {
        setLoading(true);
        console.log("Tentando logar com:", email);
        const userData = await login(email, password);
        
        console.log("Login sucesso:", userData);
        if(onLoginSuccess) {
            onLoginSuccess(userData); 
        }
    } catch(err) {
        console.log("Erro capturado:", err.message);
        Alert.alert("Erro", err.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logoEmoji}>🐾</Text>
        <Text style={styles.welcomeTitle}>Bem-vindo ao PetAdopt</Text>
        <Text style={styles.welcomeSubtitle}>Encontre o seu novo melhor amigo ou gerencie suas postagens com facilidade.</Text>
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="#8E8E93"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          style={styles.input}
        />
        
        <TextInput
          placeholder="Password"
          placeholderTextColor="#8E8E93"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.actionButton} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.actionButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToRegister} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Não tem uma conta? <Text style={styles.linkButtonBold}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- TABELA DE ESTILOS PREMIUM TOTALMENTE ATUALIZADA ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5', // Areia pastel suave para o fundo da tela inteira
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: '#E6DFD3', // Bege suave delimitando o card de login
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  logoEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1D1E', // Grafite escuro moderno
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#8E8E93', 
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  input: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FAF8F5', // Fundo sutil combinando com a identidade visual
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 15,
    color: '#1A1D1E',
    borderWidth: 1,
    borderColor: '#E6DFD3',
  },
  actionButton: {
    backgroundColor: '#1A1D1E', // Destaque em contraste escuro elegante
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
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#A37854', // Destaque na cor terracota principal do novo cabeçalho
    fontWeight: 'bold',
  },
});