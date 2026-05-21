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
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
                style={{ width: '80%', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 15, borderRadius: 5 }}>
            </TextInput>
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: '80%', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 15, borderRadius: 5 }}>
            </TextInput>

            <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 5 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Entrar</Text>
            </TouchableOpacity>

        {/* Link discreto e moderno para cadastro */}
        <TouchableOpacity onPress={onGoToRegister} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Não tem uma conta? <Text style={styles.linkButtonBold}>Cadastre-se</Text></Text>
        </TouchableOpacity>
    </View>
  );
}

// --- TABELA DE ESTILOS MODERNA ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 24,
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1D1E', // Preto suave mais moderno
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#A0A7B0', // Cinza azulado da referência
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    padding: 16,
    backgroundColor: '#F6FAFA', // Fundo pastel super leve, sem bordas escuras
    borderRadius: 14,          // Cantos suavizados e modernos
    marginBottom: 16,
    fontSize: 15,
    color: '#1A1D1E',
  },
  actionButton: {
    backgroundColor: '#1A1D1E', // Botão escuro de destaque
    padding: 16,
    borderRadius: 16,          // Formato arredondado combinando com o app
    alignItems: 'center',
    marginTop: 12,
    // Efeito de elevação suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    color: '#666',
    fontSize: 14,
  },
  linkButtonBold: {
    color: '#00A896', // Destaque na cor verde-água principal do app
    fontWeight: 'bold',
  },
});