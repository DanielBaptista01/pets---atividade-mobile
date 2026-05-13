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
    const [imageUri, setImageUri] = useState(null); 

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
                category 
            };

            await createPet(petData, user.token);
            await fetchPets(); // Atualiza a lista global

            
           console.log("Forçando fechamento antes do Alerta...");
    
    // TESTE: Chame o onGoBack ANTES do alerta. 
    // Se a tela fechar agora, o problema era o Alert que travava a execução.
    onGoBack(); 

    Alert.alert('Sucesso', 'Pet criado!');
        } catch (err) {
            Alert.alert('Erro', err.message || 'Erro ao criar pet');
        }   
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.label}>Foto do Pet</Text>
            <TouchableOpacity style={styles.imagePlaceholder}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                    <Text>Clique para selecionar uma foto (Simulação)</Text>
                )}
            </TouchableOpacity>

            <TextInput placeholder="Nome do Pet" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Raça (Breed)" value={breed} onChangeText={setBreed} style={styles.input} />
            <TextInput placeholder="Idade" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Gênero (male/female)" value={gender} onChangeText={setGender} style={styles.input} />
            <TextInput placeholder="Peso (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Cor" value={color} onChangeText={setColor} style={styles.input} />
            <TextInput placeholder="História/Descrição" value={story} onChangeText={setStory} multiline style={[styles.input, { height: 80 }]} />
            
            <View style={{ marginTop: 10 }}>
                <Button title="Salvar Pet" onPress={handleCreatePet} color="#007AFF" />
            </View>
            <View style={{ marginTop: 10 }}>
                <Button title="Cancelar" onPress={onGoBack} color="red" />
            </View>
        </ScrollView>
    ); 
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    input: { 
        width: '100%', 
        padding: 12, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        marginBottom: 12, 
        borderRadius: 8 
    },
    imagePlaceholder: { 
        width: '100%', 
        height: 150, 
        backgroundColor: '#EEE', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 10, 
        marginBottom: 20, 
        borderStyle: 'dashed', 
        borderWidth: 1 
    },
    previewImage: { 
        width: '100%', 
        height: '100%', 
        borderRadius: 10 
    }
});