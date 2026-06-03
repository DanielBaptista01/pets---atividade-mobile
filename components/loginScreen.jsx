import React, { useState } from "react"; 
import { Alert, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Image, useWindowDimensions, ScrollView } from "react-native";
import { login } from "../services/petService"; 

export default function LoginScreen({ onLoginSuccess, onGoToRegister }) {
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
    <View style={styles.mainWrapper}>
      {/* 🏙️ A IMAGEM COMO FUNDO ABSOLUTO DA TELA INTEIRA */}
      <Image 
        source={require('../assets/fundo_login.png')} 
        style={styles.backgroundImage}
      />
      {/* Película escura sutil marrom para dar contraste nos textos */}
      <View style={styles.imageOverlay} />

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.contentLayout}>
          
          {/* TEXTO DE BOAS-VINDAS (Sempre posicionado no topo, acima dos animais) */}
          <View style={styles.welcomeTextArea}>
            <Image 
                        source={require('../assets/slogan_pet.png')} 
                        style={styles.logoSlogan}
            />
            <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
            <Text style={styles.welcomeSubtitle}>Mais um dia para conectar corações e transformar vidas de pequenos amigos.</Text>
          </View>

          {/* CARD DE LOGIN (Sempre centralizado embaixo, sobre o cobertor/pata dos pets) */}
          <View style={styles.formPanel}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Acessar Conta</Text>
              <Text style={styles.formInstructions}>Insira suas credenciais para entrar no painel</Text>

              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                placeholder="exemplo@email.com"
                placeholderTextColor="#8E8E93"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                style={styles.input}
              />
              
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                placeholder="Digite sua senha"
                placeholderTextColor="#8E8E93"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
              />

              <TouchableOpacity onPress={handleLogin} style={styles.actionButton} disabled={loading} activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.actionButtonText}>Entrar no Sistema</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={onGoToRegister} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Novo por aqui? <Text style={styles.linkButtonBold}>Crie uma conta gratuita</Text></Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// --- TABELA DE ESTILOS PREMIUM UNIFICADA (RESPONSIVIDADE SIMPLIFICADA) ---
const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FAF8F5',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(54, 38, 25, 0.4)', // Camada marrom transparente para elegância e leitura
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentLayout: {
    flex: 1,
    flexDirection: 'column', // Força o fluxo vertical (Cima -> Baixo) em qualquer dispositivo
    padding: 24,
    justifyContent: 'space-between', // Garante o distanciamento máximo (Texto no topo, Card na base)
    minHeight: '100vh', // Trava na altura total do monitor no PC
    width: '100%',
    maxWidth: 600, // Limita a largura máxima do conteúdo para não esticar demais no PC
    alignSelf: 'center',
  },

  // Área de Boas-Vindas (Topo)
  welcomeTextArea: {
    marginTop: -30,
    marginBottom: 10,
    alignItems: 'flex-start',
  },

  logoSlogan: {
    width: 320,           // Largura ideal para o computador e telas menores
    height: 140,          // Altura proporcional para não distorcer o desenho
    resizeMode: 'contain', // Garante que o texto e o símbolo fiquem nítidos e inteiros
    alignSelf: 'left', 
    transform: [{ scale: 0.7 }],
    marginLeft: -90,     // Pequena folga abaixo do logotipo para separar do título
  },

  brandEmoji: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#d0892c',
    letterSpacing: -0.5,
    marginBottom: -2,
    marginTop: -15,
    textAlign: 'center',
    textShadowColor: 'rgba(26, 25, 25, 0.3)', // Sombra leve para garantir leitura perfeita sobre a foto
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontWeight:'bold',
    color: '#13120f',
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Área do Card de Login (Base)
  formPanel: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16, // Empurra ligeiramente para cima do limite final da tela, caindo na área do cobertor
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Card com efeito fosco premium
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 600,
    maxHeight: 402,
    borderWidth: 1,
    borderColor: 'rgba(230, 223, 211, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#b87926',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  formInstructions: {
    fontSize: 14,
    color: '#151516',
    marginTop: -20,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A3322', // Marrom conceitual nos títulos internos
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#dad9d7',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 15,
    color: '#1A1D1E',
    borderWidth: 1,
    borderColor: '#E6DFD3',
  },
  actionButton: {
    backgroundColor: '#c67b3d', // Terracota oficial do PetAdopt
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#c67b3d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#151516',
    fontSize: 14,
  },
  linkButtonBold: {
    color: '#c67b3d',
    fontWeight: 'bold',
  },
});