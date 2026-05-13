import React, { useState } from "react"; // Adicionado useState
import { Alert, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { login } from "../services/petService"; // Importe a função de login do seu service

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

            <TouchableOpacity onPress={onGoToRegister} style={{ marginTop: 15 }}>
                    <Text style={{ color: '#007AFF' }}>Não tem uma conta? Cadastre-se</Text>
             </TouchableOpacity>
        </View>
    )

}