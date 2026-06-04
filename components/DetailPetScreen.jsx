import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking, Alert, Modal, TextInput, useWindowDimensions } from 'react-native';
import { useUserRegister } from '../context/userContext';
import { deletePet, updatePet } from '../services/petService';
import { usePets } from '../context/petContext';

export function DetailPetScreen({ pet, onGoBack, fromMyPets }) {
  const { user } = useUserRegister();
  const { fetchPets } = usePets();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed || '');
  const [age, setAge] = useState(String(pet.age));
  const [weight, setWeight] = useState(String(pet.weight));
  const [color, setColor] = useState(pet.color || '');
  const [story, setStory] = useState(pet.story || '');

  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const userToken = user?.token || user?.user?.token;
  const loggedUserId = user?._id || user?.user?._id;
  const isOwner = pet.userId === loggedUserId || pet.user?._id === loggedUserId || pet.user === loggedUserId;
  const [loading, setLoading] = useState(false);

  const handleAdoptContact = () => {
    const phoneNumber = pet.user?.phone;
    if (!phoneNumber) {
      Alert.alert('Aviso', 'Este protetor não disponibilizou número de contato.');
      return;
    }
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const message = `Olá! Vi o pet ${pet.name} no app Adotei e tenho interesse em adotá-lo!`;
    Linking.openURL(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    });
  };

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
      {/* BOTÃO VOLTAR FLUTUANTE */}
      <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
        <Text style={styles.backButtonText}>‹ Voltar para o Mural</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
          
          {/* PAINEL DA ESQUERDA: FOTO DO PET */}
          <View style={[styles.imageWrapper, isDesktop && styles.imageWrapperDesktop]}>
            {pet.images?.length > 0 ? (
              <Image source={{ uri: pet.images[0] }} style={styles.bigImage} resizeMode="cover" />
            ) : (
              <View style={styles.noImagePlaceholder}><Text style={{ fontSize: 50 }}>🐾</Text></View>
            )}
          </View>

          {/* PAINEL DA DIREITA: INFORMAÇÕES DO PET */}
          <View style={[styles.infoContainer, isDesktop && styles.infoContainerDesktop]}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed || 'Raça não informada'}</Text>
            
            {/* GRID DE DETALHES TÉCNICOS */}
            <View style={styles.grid}>
              <View style={styles.gridItem}><Text style={styles.label}>Idade</Text><Text style={styles.value}>{pet.age} anos</Text></View>
              <View style={styles.gridItem}><Text style={styles.label}>Peso</Text><Text style={styles.value}>{pet.weight} kg</Text></View>
              <View style={styles.gridItem}><Text style={styles.label}>Cor</Text><Text style={styles.value}>{pet.color}</Text></View>
              <View style={styles.gridItem}><Text style={styles.label}>Gênero</Text><Text style={styles.value}>{pet.gender === 'female' ? 'Fêmea' : 'Macho'}</Text></View>
            </View>

            <Text style={styles.sectionTitle}>Conheça a história de {pet.name}</Text>
            <Text style={styles.storyText}>{pet.story || 'Sem descrição cadastrada.'}</Text>

            {/* BOTÕES DE AÇÃO DINÂMICOS */}
            {fromMyPets && (
          <View style={styles.ownerActions}>
           <Text style={styles.ownerNotice}>⭐ Esse pet foi cadastrado por você</Text>
    
           <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalOpen(true)} activeOpacity={0.8}>
          <Text style={styles.editButtonText}>📝 Editar Informações</Text>
          </TouchableOpacity>

      </View>
     )}
          </View>

        </View>
      </ScrollView>

      {/* MODAL DE EDIÇÃO INTEGRADO */}
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

// 🎨 DESIGN SYSTEM RESPONSIVO DE ALTO PADRÃO PARA "ADOTEI"
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#c3914f' 
  },
  scrollContainer: { 
    flexGrow: 1,
    paddingBottom: 40 
  },
  backButton: { 
    position: 'absolute', 
    top: 30, 
    left: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    zIndex: 10, 
    borderWidth: 1,
    borderColor: '#E6DFD3',
    shadowColor: '#e48108', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 6 
  },
  backButtonText: { 
    color: '#4A3322', 
    fontWeight: '700', 
    fontSize: 14 
  },

  // Layout Inteligente Duplo (Igual ao do Login)
  mainLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
    gap: 40,
  },

  // Painel da Foto
  imageWrapper: {
    width: '100%',
    height: 380,
  },
  imageWrapperDesktop: {
    flex: 1.1,
    height: 520,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#181716',
    shadowColor: '#e48108',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  bigImage: { 
    width: '100%', 
    height: '100%' 
  },
  noImagePlaceholder: { 
    width: '100%', 
    height: '100%', 
    backgroundColor: '#E6DFD3', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // Painel de Informações
  infoContainer: { 
    padding: 32, 
    marginTop: -30, 
    backgroundColor: '#e6e6e6', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    borderWidth: 1, 
    borderColor: '#E6DFD3',
  },
  infoContainerDesktop: {
    flex: 1,
    marginTop: 0,
    borderRadius: 28,
    shadowColor: '#e48108',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
  },
  petName: { 
    fontSize: 34, 
    fontWeight: '800', 
    fontFamily: 'Georgia',
    color: '#1A1D1E', 
    letterSpacing: -0.8 
  },
  petBreed: { 
    fontSize: 16, 
    color: '#A37854', 
    fontWeight: '700', 
    marginTop: 4, 
    marginBottom: 28 
  },

  // Grid de Cards Técnicos
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 24 
  },
  gridItem: { 
    width: '48%', 
    backgroundColor: '#FAF8F5', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#E6DFD3' 
  },
  label: { 
    fontSize: 11, 
    color: '#8E8E93', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: 0.8 
  },
  value: { 
    fontSize: 16, 
    color: '#1A1D1E', 
    fontWeight: '700', 
    marginTop: 4 
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    fontFamily: 'Georgia',
    color: '#1A1D1E', 
    marginBottom: 12, 
    marginTop: 8,
    letterSpacing: -0.3
  },
  storyText: { 
    fontSize: 15, 
    color: '#181717', 
    fontFamily: 'Georgia',
    lineHeight: 24, 
    marginBottom: 32 
  },

  // Estilização dos Botões de Ação
  adoptButton: { 
    backgroundColor: '#A37854', 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    shadowColor: '#A37854', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 6,
    elevation: 3
  },
  adoptButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  
  ownerActions: { 
    marginTop: 8, 
    borderTopWidth: 1, 
    borderColor: '#FAF8F5', 
    paddingTop: 20 
  },
  ownerNotice: { 
    fontSize: 14, 
    color: '#A37854', 
    fontWeight: '700', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  editButton: { 
    backgroundColor: '#1A1D1E', 
    paddingVertical: 15, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginBottom: 12,
    shadowColor: '#e48108',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  editButtonText: { 
    color: '#FFF', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  deleteButton: { 
    backgroundColor: '#FFF', 
    borderWidth: 1.5, 
    borderColor: '#FF4D4D', 
    paddingVertical: 14, 
    borderRadius: 14, 
    alignItems: 'center' 
  },
  deleteButtonText: { 
    color: '#FF4D4D', 
    fontSize: 15, 
    fontWeight: '700' 
  },

  // Modal de Edição Conceitual
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(26, 29, 30, 0.5)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28, 
    padding: 24, 
    maxHeight: '85%', 
    borderWidth: 1, 
    borderColor: '#E6DFD3' 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#1A1D1E', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  inputLabel: { 
    fontSize: 12, 
    color: '#4A3322', 
    fontWeight: '700', 
    marginBottom: 6, 
    marginTop: 12, 
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: { 
    backgroundColor: '#FAF8F5', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 15, 
    color: '#1A1D1E', 
    borderWidth: 1, 
    borderColor: '#E6DFD3' 
  },
  saveButton: { 
    backgroundColor: '#A37854', 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 28 
  },
  saveButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  cancelButton: { 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginTop: 8 
  },
  cancelButtonText: { 
    color: '#8E8E93', 
    fontSize: 15, 
    fontWeight: '700' 
  }
});