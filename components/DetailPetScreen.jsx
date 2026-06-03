import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking, Alert, Modal, TextInput } from 'react-native';
import { useUserRegister } from '../context/userContext';
import { deletePet, updatePet } from '../services/petService';
import { usePets } from '../context/petContext';

export function DetailPetScreen({ pet, onGoBack }) {
  const { user } = useUserRegister();
  const { fetchPets } = usePets();

  // Estados originais para o Modal de Edição mantidos idênticos
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
  const [loading, setLoading] = useState(false);

  // Lógica original de contato mantida intacta
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

  // Função mantida internamente para segurança lógica
  const handleDelete = async () => {
    const mensagem = "Deseja apagar este cadastro de pet permanentemente?";

    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm(mensagem)) {
        try {
          setLoading(true);
          await deletePet(pet._id, userToken);
          alert("Pet removido com sucesso.");
          if (fetchPets) await fetchPets(); 
          onGoBack(); 
        } catch (err) {
          alert(err.message);
        } finally {
          setLoading(false);
        }
      }
    } else {
      Alert.alert("Excluir Pet", mensagem, [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              setLoading(true);
              await deletePet(pet._id, userToken); 
              Alert.alert("Sucesso", "Pet removido com sucesso.");
              if (fetchPets) await fetchPets();
              onGoBack();
            } catch (err) {
              Alert.alert("Erro", err.message);
            } finally {
              setLoading(false);
            }
          } 
        }
      ]);
    }
  };

  // Lógica original de salvar alterações mantida intacta
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
      await fetchPets(); 
      onGoBack(); 
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

          {!isOwner && (
            <TouchableOpacity style={styles.adoptButton} onPress={handleAdoptContact} activeOpacity={0.8}>
              <Text style={styles.adoptButtonText}>Quero Adotar (WhatsApp)</Text>
            </TouchableOpacity>
          )}

          {isOwner && (
            <View style={styles.ownerActions}>
              <Text style={styles.ownerNotice}>⭐ Esse pet foi cadastrado por você</Text>
              
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalOpen(true)}>
                <Text style={styles.editButtonText}>📝 Editar Informações</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* MODAL DE EDIÇÃO INTEGRADO COM SUAS PROPRIEDADES ORIGINAIS */}
      <Modal visible={isEditModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Informações do Pet</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nome do Pet</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#8E8E93" />

              <Text style={styles.inputLabel}>Raça</Text>
              <TextInput style={styles.input} value={breed} onChangeText={setBreed} placeholderTextColor="#8E8E93" />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%' }}>
                  <Text style={styles.inputLabel}>Idade</Text>
                  <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor="#8E8E93" />
                </View>
                <View style={{ width: '48%' }}>
                  <Text style={styles.inputLabel}>Peso (kg)</Text>
                  <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholderTextColor="#8E8E93" />
                </View>
              </View>

              <Text style={styles.inputLabel}>Cor</Text>
              <TextInput style={styles.input} value={color} onChangeText={setColor} placeholderTextColor="#8E8E93" />

              <Text style={styles.inputLabel}>História/Descrição</Text>
              <TextInput style={[styles.input, { height: 90 }]} value={story} onChangeText={setStory} multiline placeholderTextColor="#8E8E93" />

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

// 🎨 ESTILIZAÇÃO COMPATÍVEL COM O SEU NOVO DESIGN SYSTEM
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  content: { paddingBottom: 40 },
  bigImage: { width: '100%', height: 320 },
  noImagePlaceholder: { width: '100%', height: 320, backgroundColor: '#E6DFD3', justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 45, left: 20, backgroundColor: 'rgba(255,255,255,0.95)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  backButtonText: { color: '#1A1D1E', fontWeight: 'bold', fontSize: 15 },
  infoContainer: { padding: 24, marginTop: -24, backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: '#E6DFD3', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.02, shadowRadius: 8 },
  petName: { fontSize: 30, fontWeight: 'bold', color: '#1A1D1E', letterSpacing: -0.5 },
  petBreed: { fontSize: 16, color: '#A37854', fontWeight: '600', marginTop: 4, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  gridItem: { width: '48%', backgroundColor: '#FAF8F5', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E6DFD3' },
  label: { fontSize: 11, color: '#8E8E93', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 16, color: '#1A1D1E', fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1D1E', marginBottom: 10, marginTop: 10 },
  storyText: { fontSize: 15, color: '#666', lineHeight: 24, marginBottom: 28 },
  adoptButton: { backgroundColor: '#1A1D1E', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  adoptButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  // Estilos de dono adequados ao tema
  ownerActions: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#E6DFD3', paddingTop: 20 },
  ownerNotice: { fontSize: 14, color: '#A37854', fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  editButton: { backgroundColor: '#FAF8F5', borderWidth: 1.5, borderColor: '#A37854', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  editButtonText: { color: '#A37854', fontSize: 15, fontWeight: 'bold' },

  // Estilos do Modal de Edição Premium
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26, 29, 30, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '85%', borderWidth: 1, borderColor: '#E6DFD3' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1D1E', marginBottom: 20, textAlign: 'center' },
  inputLabel: { fontSize: 13, color: '#8E8E93', fontWeight: 'bold', marginBottom: 6, marginTop: 12, marginLeft: 2 },
  input: { backgroundColor: '#FAF8F5', borderRadius: 14, padding: 14, fontSize: 15, color: '#1A1D1E', borderWidth: 1, borderColor: '#E6DFD3' },
  saveButton: { backgroundColor: '#1A1D1E', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  cancelButtonText: { color: '#8E8E93', fontSize: 15, fontWeight: '600' }
});