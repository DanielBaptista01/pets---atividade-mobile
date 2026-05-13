import React, { useState, useEffect } from 'react'; 
import { SafeAreaView, Text, View, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { PetProvider, usePets } from './context/petContext';
import { UserProvider, useUserRegister } from './context/userContext'; 
import { PetItem } from './components/petItem';
import LoginScreen from './components/loginScreen'; 
import { CadastroScreen } from './components/cadrastoScreen'; 
import { CreatePetScreen } from './components/CreatePetScreen'; 
import { fetchPets } from './context/petContext';

// 1. Componente da Lista (mantido como você já tinha)
function ListaDePets() {
  const { pets, loading, error } = usePets();
  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text>;
  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item._id}
      numColumns={2}
      key={2}
      renderItem={({ item }) => <PetItem pet={item} />}
      contentContainerStyle={{ padding: 15 }}
    />
  );
}

// 2. O NOVO COMPONENTE QUE RESOLVE O SEU PROBLEMA
function AppContent() {
  // Agora este hook funciona porque o AppContent está dentro do UserProvider lá embaixo
  const { user, setUser } = useUserRegister(); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingPet, setIsCreatingPet] = useState(false);

  // Se não tem usuário, mostra Login ou Cadastro
  if (!user) {
    return !isRegistering ? (
      <LoginScreen 
        onLoginSuccess={(userData) => setUser(userData)} 
        onGoToRegister={() => setIsRegistering(true)}
      />
    ) : (
      <CadastroScreen 
        onRegisterSuccess={(userData) => setUser(userData)} 
        onGoToLogin={() => setIsRegistering(false)} 
      />
    );
  }

  // Se tem usuário, mostra a parte principal
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {isCreatingPet ? (
        <CreatePetScreen onGoBack={() => setIsCreatingPet(false)} />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Pets para Adoção</Text>
            <TouchableOpacity 
              onPress={() => setIsCreatingPet(true)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+ Novo</Text>
            </TouchableOpacity>
          </View>
          <ListaDePets />
        </View>
      )}
    </SafeAreaView>
  );
}

// 3. O EXPORT PRINCIPAL (Obrigatório)
export default function App() {
  return (
    <UserProvider>
      <PetProvider> {/* O Provider de Pet tem que estar aqui, bem no topo! */}
        <AppContent />
      </PetProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  header: { 
    padding: 20, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  addButton: { backgroundColor: '#28a745', padding: 8, borderRadius: 5 },
  addButtonText: { color: '#fff', fontWeight: 'bold' }
});