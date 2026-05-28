import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking, Alert, Modal, TextInput } from 'react-native';
import { useUserRegister } from '../context/userContext';
import { deletePet, updatePet } from '../services/petService';
import { usePets } from '../context/petContext';

export function DetailPetScreen({ pet, onGoBack }) {
  const { user } = useUserRegister();
  const { fetchPets } = usePets();

  // Estados para o Modal de Edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed || '');
  const [age, setAge] = useState(String(pet.age));
  const [weight, setWeight] = useState(String(pet.weight));
  const [color, setColor] = useState(pet.color || '');
  const [story, setStory] = useState(pet.story || '');

  const userToken = user?.token || user?.user?.token;
  const loggedUserId = user?._id || user?.user?._id;
  const isOwner = pet.userId === loggedUserId || pet.user?._id === loggedUserId || pet.user === loggedUserId;

  const handleAdoptContact = () => {
    const phoneNumber = pet.user?.phone;
    if (!phoneNumber) {
      Alert.alert('Aviso', 'Este protetor não disponibilizou número de contato.');
      return;
    }
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const message = `Olá! Vi o pet ${pet.name} no app Pet Adopt e tenho interesse em adotá-lo!`;
    Linking.openURL(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    });
  };

  // 🗑️ FUNÇÃO DE EXCLUIR CADASTRO
  const handleDelete = async () => {
    Alert.alert("Excluir Pet", "Deseja apagar este cadastro permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deletePet(pet._id, userToken);
            Alert.alert("Sucesso", "Pet removido.");
            await fetchPets(); // Atualiza a lista global
            onGoBack(); // Volta para a Home
          } catch (err) {
            Alert.alert("Erro", err.message);
          }
        } 
      }
    ]);
  };

  // 📝 FUNÇÃO DE SALVAR EDIÇÃO
  const handleSaveChanges = async () => {
    if (!name || !breed || !age || !weight || !color || !story) {
      Alert.alert("Erro", "Preencha todos os campos para atualizar.");
      return;
    }

    try {
      const updatedData = {
        name,
        breed,
        age: Number(age),
        weight: Number(weight),
        color,
        story
      };

      await updatePet(pet._id, updatedData, userToken);
      Alert.alert("Sucesso", "Dados do pet atualizados com sucesso!");
      setIsEditModalOpen(false);
      await fetchPets(); // Atualiza a lista
      onGoBack(); // Volta para atualizar a tela
    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
        <Text style={styles.backButtonText}>‹ Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pet.images?.length > 0 ? (
          <Image source={{ uri: pet.images[0] }} style={styles.bigImage} resizeMode="cover" />
        ) : (
          <View style={styles.noImagePlaceholder}><Text style={{ fontSize: 40 }}>🐾</Text></View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed || 'Raça não informada'}</Text>
          
          <View style={styles.grid}>
            <View style={styles.gridItem}><Text style={styles.label}>Idade</Text><Text style={styles.value}>{pet.age} anos</Text></View>
            <View style={styles.gridItem}><Text style={styles.label}>Peso</Text><Text style={styles.value}>{pet.weight} kg</Text></View>
            <View style={styles.gridItem}><Text style={styles.label}>Cor</Text><Text style={styles.value}>{pet.color}</Text></View>
            <View style={styles.gridItem}><Text style={styles.label}>Gênero</Text><Text style={styles.value}>{pet.gender === 'female' ? 'Fêmea' : 'Macho'}</Text></View>
          </View>

          <Text style={styles.sectionTitle}>História</Text>
          <Text style={styles.storyText}>{pet.story || 'Sem descrição.'}</Text>

          {/* Botão de Contato padrão (desabilitado se for o próprio dono) */}
          {!isOwner && (
            <TouchableOpacity style={styles.adoptButton} onPress={handleAdoptContact} activeOpacity={0.8}>
              <Text style={styles.adoptButtonText}>Quero Adotar (WhatsApp)</Text>
            </TouchableOpacity>
          )}

          {/* 🔐 TRAVA DE SEGURANÇA: Só mostra Editar e Excluir se o pet for SEU */}
          {isOwner && (
            <View style={styles.ownerActions}>
              <Text style={styles.ownerNotice}>⭐ Esse pet foi cadastrado por você</Text>
              
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalOpen(true)}>
                <Text style={styles.editButtonText}>📝 Editar Informações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>🗑️ Excluir Cadastro</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 🏙️ MODAL DE EDIÇÃO INTEGRADO */}
      <Modal visible={isEditModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Informações do Pet</Text>
            
            <ScrollView>
              <Text style={styles.inputLabel}>Nome do Pet</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />

              <Text style={styles.inputLabel}>Raça</Text>
              <TextInput style={styles.input} value={breed} onChangeText={setBreed} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%' }}>
                  <Text style={styles.inputLabel}>Idade</Text>
                  <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
                </View>
                <View style={{ width: '48%' }}>
                  <Text style={styles.inputLabel}>Peso (kg)</Text>
                  <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
                </View>
              </View>

              <Text style={styles.inputLabel}>Cor</Text>
              <TextInput style={styles.input} value={color} onChangeText={setColor} />

              <Text style={styles.inputLabel}>História/Descrição</Text>
              <TextInput style={[styles.input, { height: 80 }]} value={story} onChangeText={setStory} multiline />

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditModalOpen(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { paddingBottom: 40 },
  bigImage: { width: '100%', height: 300 },
  noImagePlaceholder: { width: '100%', height: 300, backgroundColor: '#E0F7F6', justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 45, left: 20, backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, zIndex: 10 },
  backButtonText: { color: '#333', fontWeight: 'bold', fontSize: 14 },
  infoContainer: { padding: 24, marginTop: -20, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  petName: { fontSize: 28, fontWeight: 'bold', color: '#1A1D1E' },
  petBreed: { fontSize: 16, color: '#A0A7B0', marginTop: 4, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  gridItem: { width: '48%', backgroundColor: '#F6FAFA', padding: 14, borderRadius: 16, marginBottom: 12 },
  label: { fontSize: 11, color: '#A0A7B0', fontWeight: 'bold', textTransform: 'uppercase' },
  value: { fontSize: 15, color: '#1A1D1E', fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1D1E', marginBottom: 8 },
  storyText: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 24 },
  adoptButton: { backgroundColor: '#00A896', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  adoptButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  // Estilos de dono
  ownerActions: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F0F3F3', paddingTop: 20 },
  ownerNotice: { fontSize: 14, color: '#00A896', fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  editButton: { backgroundColor: '#E0F7F6', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  editButtonText: { color: '#00A896', fontSize: 15, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#FF4D4D', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  deleteButtonText: { color: '#FF4D4D', fontSize: 15, fontWeight: 'bold' },

  // Estilos do Modal de Edição
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1D1E', marginBottom: 20, textAlign: 'center' },
  inputLabel: { fontSize: 13, color: '#1A1D1E', fontWeight: 'bold', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#F6FAFA', borderRadius: 12, padding: 12, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#E0F7F6' },
  saveButton: { backgroundColor: '#00A896', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  cancelButtonText: { color: '#A0A7B0', fontSize: 15 }
});