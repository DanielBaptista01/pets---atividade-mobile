import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useUserRegister } from "../context/userContext";
import { Image } from "react-native"; // Adicionada a importação de Image para o fundo

export function CadastroScreen({ onRegisterSuccess, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Adicionado indicador visual de loading para o botão
  
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
      setLoading(true);
      setError(null);
      const response = await fetchuserRegister(name, email, password, phone, confirmpassword);
      if (onRegisterSuccess) {
        onRegisterSuccess(response);
      }
    } catch (err) {
      setError(err.message || 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.mainWrapper}>
      {/* 🏙️ MESMA IMAGEM DE FUNDO DO LOGIN ADAPTADA PARA O CADASTRO */}
      <Image 
        source={require('../assets/fundo_cadastro.png')} 
        style={styles.backgroundImage}
      />
      {/* Mesma película marrom elegante para manter o padrão */}
      <View style={styles.imageOverlay} />

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.contentLayout}>
          
          {/* TEXTO DE TEXTO SUPERIOR (Acima dos pets) */}
          <View style={styles.welcomeTextArea}>
            <Image 
            source={require('../assets/slogan_pet.png')} 
            style={styles.logoSlogan}
            />
            <Text style={styles.welcomeTitle}>Crie sua conta</Text>
            <Text style={styles.welcomeSubtitle}>Comece sua jornada para ajudar e adotar novos amigos.</Text>
          </View>
          
          {/* CARD DE INPUTS FLUTUANTE (Centralizado embaixo, sobre o cobertor) */}
          <View style={styles.formPanel}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Cadastro</Text>
              <Text style={styles.formInstructions}>Preencha as informações para criar seu acesso</Text>

              {error && <Text style={styles.errorText}>{error}</Text>}
              
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <TextInput
                placeholder="Seu nome aqui"
                placeholderTextColor="#8E8E93"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#8E8E93"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>Telefone / Whatsapp</Text>
              <TextInput
                placeholder="(00) 00000-0000"
                placeholderTextColor="#8E8E93"
                value={phone}
                keyboardType="phone-pad"
                onChangeText={setPhone}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#8E8E93"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
              />

              <Text style={styles.inputLabel}>Confirmar Senha</Text>
              <TextInput
                placeholder="Repita a senha criada"
                placeholderTextColor="#8E8E93"
                value={confirmpassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
              />

              <TouchableOpacity onPress={handleRegister} style={styles.actionButton} activeOpacity={0.8} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.actionButtonText}>Finalizar Cadastro</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onGoToLogin} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Já tem uma conta? <Text style={styles.linkButtonBold}>Faça login</Text></Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// --- TABELA DE ESTILOS PREMIUM TOTALMENTE PADRONIZADA COM O SEU LOGIN ---
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
    backgroundColor: 'rgba(54, 38, 25, 0.4)', // Mantém o filtro marrom para coerência de telas
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentLayout: {
    flex: 1,
    flexDirection: 'row',
    padding: 24,
    justifyContent: 'space-between',
    minHeight: '100vh',
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },

  // Área do Título (Topo)
  welcomeTextArea: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },

  logoSlogan: {
    width: 320,           // Largura ideal para o computador e telas menores
    height: 140,          // Altura proporcional para não distorcer o desenho
    resizeMode: 'contain', // Garante que o texto e o símbolo fiquem nítidos e inteiros
    alignSelf: 'left', 
    marginLeft: -56,     // Pequena folga abaixo do logotipo para separar do título
  },

  brandEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e5a123',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#151514',
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Mensagem de Erro Estilizada
  errorText: { 
    color: '#FF4D4D', 
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#FFEBEB',
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#FFC1C1',
  },

  // Card do Formulário (Base)
  formPanel: {
    width: '100%',
    maxWidth: 450,
    alignItems: 'flex-start', // Alinha o card à direita para criar um layout mais dinâmico
    marginBottom: 20,
    marginTop: 10, // Pequena folga caso a tela seja muito baixa
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 40,
    width: '100%',
    borderWidth: 4,
    borderColor: 'rgba(211, 141, 21, 0.83)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#c67c40',
    letterSpacing: -0.5,
  },
  formInstructions: {
    fontSize: 14,
    color: '#0e0e10',
    marginTop: 4,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A3322',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#e5e4e3',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 15,
    color: '#1A1D1E',
    borderWidth: 1,
    borderColor: '#e59a19',
  },
  actionButton: {
    backgroundColor: '#c67c40', // O marrom terracota lindo do seu sistema
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#A37854',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonText: {
    color: '#131111',
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
    color: '#c67c40',
    fontWeight: 'bold',
  },
});