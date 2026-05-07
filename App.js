import React, { useState } from 'react'; 
import { SafeAreaView, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { PetProvider, usePets } from './context/petContext';
import { UserProvider } from './context/userContext'; 
import { PetItem } from './components/petItem';
import LoginScreen from './components/loginScreen'; // Use letra maiúscula
import {CadastroScreen} from './components/cadrastoScreen'; // Você precisa desta tela

function ListaDePets() {
  const { pets, loading, error } = usePets();
  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text>;
  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <PetItem pet={item} />}
      contentContainerStyle={{ padding: 15 }}
    />
  );
}

export default function App() {
  const [user, setUser] = useState(null); 
  const [isRegistering, setIsRegistering] = useState(true);

  // Renderização condicional das telas
  return (
    <UserProvider> 
      {/* Se não tem usuário, decide entre Cadastro ou Login */}
      {!user ? (
        isRegistering ? (
          <CadastroScreen 
            onRegisterSuccess={(userData) => setUser(userData)} 
            onGoToLogin={() => setIsRegistering(false)} 
          />
        ) : (
          <LoginScreen 
            onLoginSuccess={(userData) => setUser(userData)} 
            onGoToRegister={() => setIsRegistering(true)}
          />
        )
      ) : (
        // Se tem usuário, mostra a lista de pets
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
          <PetProvider>
            <View style={{ padding: 20, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Pets para Adoção</Text>
            </View>
            <ListaDePets />
          </PetProvider>
        </SafeAreaView>
      )}
    </UserProvider>
  );
}