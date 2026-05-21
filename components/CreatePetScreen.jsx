import React, { useState } from 'react'; // Corrigido aqui
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useUserRegister } from '../context/userContext';
import { createPet } from '../services/petService';
import { usePets } from '../context/petContext';

export function CreatePetScreen({onGoBack}) {
    const {user} = useUserRegister();
    const { fetchPets } = usePets(); 
    
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [color, setColor] = useState('');
    const [story, setStory] = useState('');
    const [category, setCategory] = useState('6758971d7203bce5d0315e5f');  
    const [imageUrl, setImageUrl] = useState(''); 

   async function handleCreatePet() {
    if(!user || !user.token) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
    }

    if (!name || !age || !breed || !gender || !weight || !color || !story) {
        Alert.alert('Erro', 'Preencha todos os campos');
        return;
    }

    try {
        const petData = { 
            name, breed, gender, 
            age: Number(age), 
            weight: Number(weight), 
            color, story, 
            available: true, 
            category,
            images: imageUrl ? [imageUrl] : []
        };

        // 1. Envia os dados para o servidor e aguarda a criação
        await createPet(petData, user.token);
        
        // 2. Atualiza o estado GLOBAL de pets no Contexto imediatamente
        await fetchPets(); 

        // 3. Fecha a tela de cadastro e volta para a lista JÁ ATUALIZADA
        onGoBack(); 

    } catch (err) {
        Alert.alert('Erro', err.message || 'Erro ao criar pet');
    }   
}

   return (
    <ScrollView style={styles.container}>
        <Text style={styles.label}>Cadastrar Novo Pet</Text>
        
        <TextInput placeholder="Nome do Pet" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Raça" value={breed} onChangeText={setBreed} style={styles.input} />
        <TextInput placeholder="Gênero (male ou female)" value={gender} onChangeText={setGender} style={styles.input} />
        <TextInput placeholder="Idade (anos)" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Peso (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Cor" value={color} onChangeText={setColor} style={styles.input} />
        <TextInput placeholder="História/Descrição" value={story} onChangeText={setStory} multiline style={[styles.input, { height: 80 }]} />
        
        {/* NOVO CAMPO PARA A URL DA IMAGEM */}
        <TextInput 
            placeholder="Cole a URL da Imagem do Pet aqui" 
            value={imageUrl} 
            onChangeText={setImageUrl} 
            style={styles.input}
            autoCapitalize="none"
            keyboardType="url"
        />

        {/* Pré-visualização da imagem caso o usuário cole o link */}
        {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 12 }} resizeMode='cover' />
        ) : null}
        
        <View style={{ marginTop: 10 }}>
            <Button title="Salvar Pet" onPress={handleCreatePet} color="#007AFF" />
        </View>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
            <Button title="Cancelar" onPress={onGoBack} color="red" />
        </View>
    </ScrollView>
);
}

// Altere o objeto styles no final de CreatePetScreen.jsx
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#FFF' 
  },
  label: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1A1D1E',
    marginBottom: 24,
    marginTop: 20
  },
  input: { 
    width: '100%', 
    padding: 16, 
    backgroundColor: '#F6FAFA', // Fundo pastel leve em vez de borda preta
    marginBottom: 16, 
    borderRadius: 14, 
    fontSize: 15,
    color: '#1A1D1E',
  },
  // Botão customizado caso queira trocar o <Button> nativo por um TouchableOpacity (Recomendado para design)
  saveButton: {
    backgroundColor: '#00A896',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#A0A7B0',
    fontSize: 15,
    fontWeight: '500',
  }
});