import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native";
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Cadastro</Text>
      {error && <Text style={{ color: 'red', marginBottom: 15 }}>{error}</Text>}
      
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmpassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Registrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onGoToLogin} style={{ marginTop: 15 }}>
        <Text style={{ color: '#007AFF' }}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { width: '80%', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 15, borderRadius: 5, backgroundColor: '#fff' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, width: '80%', alignItems: 'center' }
});