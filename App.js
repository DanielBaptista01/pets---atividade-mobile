import React, { useState, useEffect } from 'react'; 
import { SafeAreaView, Text, View, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { PetProvider, usePets } from './context/petContext';
import { UserProvider, useUserRegister } from './context/userContext'; 
import { PetItem } from './components/petItem';
import LoginScreen from './components/loginScreen'; 
import { CadastroScreen } from './components/cadrastoScreen'; 
import { CreatePetScreen } from './components/CreatePetScreen'; 
import { DetailPetScreen } from './components/DetailPetScreen'; 
import { fetchMyPets } from './services/petService';

function ListaDePets({ onSelectPet }) {
  const { pets, loading, error } = usePets();
  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text>;
  
  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item._id}
      numColumns={2}
      key={2}
      renderItem={({ item }) => (
        <PetItem pet={item} onPress={() => onSelectPet(item)} />
      )}
      contentContainerStyle={{ padding: 15 }}
    />
  );
}

function AbasMeusPets({ onSelectPet, user, isCreating, setIsCreating }) {
  const [meusPets, setMeusPets] = useState([]);
  const [loadingMeus, setLoadingMeus] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoadingMeus(true);
        const data = await fetchMyPets(user.token);
        setMeusPets(data.pets || data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoadingMeus(false);
      }
    }
    load();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Cadastros</Text>
        <TouchableOpacity onPress={() => setIsCreating(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>
      
      {loadingMeus ? (
        <ActivityIndicator size="large" color="#00A896" style={{ marginTop: 50 }} />
      ) : meusPets.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#666', fontSize: 16 }}>Você ainda não cadastrou nenhum pet.</Text>
        </View>
      ) : (
        <FlatList
          data={meusPets}
          keyExtractor={(item) => item._id}
          numColumns={2}
          key={2}
          renderItem={({ item }) => (
            <PetItem pet={item} onPress={() => onSelectPet(item)} />
          )}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
}

function AppContent() {
  const { user, setUser, loading: userLoading } = useUserRegister(); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [currentTab, setCurrentTab] = useState('inicio');
  const [selectedPet, setSelectedPet] = useState(null);
  const { fetchPets } = usePets(); 

  if (userLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (!user) {
    return !isRegistering ? (
      <LoginScreen onLoginSuccess={(userData) => setUser(userData)} onGoToRegister={() => setIsRegistering(true)} />
    ) : (
      <CadastroScreen onRegisterSuccess={(userData) => setUser(userData)} onGoToLogin={() => setIsRegistering(false)} />
    );
  }

  if (selectedPet) {
    return <DetailPetScreen pet={selectedPet} onGoBack={() => setSelectedPet(null)} />;
  }

  if (isCreatingPet) {
    return (
      <CreatePetScreen 
        onGoBack={async () => {
          setIsCreatingPet(false);
          await fetchPets(); 
        }} 
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        {currentTab === 'inicio' && (
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Pets para Adoção</Text>
              <TouchableOpacity onPress={() => setIsCreatingPet(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Novo</Text>
              </TouchableOpacity>
            </View>
            <ListaDePets onSelectPet={(pet) => setSelectedPet(pet)} />
          </View>
        )}

        {currentTab === 'meus_pets' && (
          <AbasMeusPets user={user} onSelectPet={(pet) => setSelectedPet(pet)} isCreating={isCreatingPet} setIsCreating={setIsCreatingPet} />
        )}

        {currentTab === 'perfil' && (
          <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={styles.header}><Text style={styles.headerTitle}>Minha Conta</Text></View>
            <View style={styles.profileContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{user.user?.name ? user.user.name[0].toUpperCase() : 'U'}</Text>
              </View>
              <Text style={styles.profileName}>{user.user?.name || 'Usuário'}</Text>
              <Text style={styles.profileEmail}>{user.user?.email || user.email}</Text>
              <View style={styles.divider} />
              <Text style={styles.infoTitle}>Informações de Contato</Text>
              <Text style={styles.infoBody}>Telefone: {user.user?.phone || 'Não informado'}</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={() => setUser(null)}>
                <Text style={styles.logoutButtonText}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabItem, currentTab === 'inicio' && styles.tabItemActive]} onPress={() => setCurrentTab('inicio')}>
          <Text style={[styles.tabText, currentTab === 'inicio' && styles.tabTextActive]}>🐾 Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, currentTab === 'meus_pets' && styles.tabItemActive]} onPress={() => setCurrentTab('meus_pets')}>
          <Text style={[styles.tabText, currentTab === 'meus_pets' && styles.tabTextActive]}>⭐ Meus Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, currentTab === 'perfil' && styles.tabItemActive]} onPress={() => setCurrentTab('perfil')}>
          <Text style={[styles.tabText, currentTab === 'perfil' && styles.tabTextActive]}>👤 Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <UserProvider>
      <PetProvider> 
        <AppContent />
      </PetProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 50, paddingHorizontal: 24, paddingBottom: 20, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A1D1E' },
  addButton: { backgroundColor: '#00A896', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, boxShadow: '0px 4px 6px rgba(0, 168, 150, 0.15)' },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  tabBar: { flexDirection: 'row', height: 65, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F3F3', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 5 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  tabItemActive: { borderTopWidth: 3, borderTopColor: '#00A896' },
  tabText: { fontSize: 12, color: '#A0A7B0', fontWeight: '500', marginTop: 2 },
  tabTextActive: { color: '#00A896', fontWeight: 'bold' },
  profileContainer: { alignItems: 'center', padding: 24 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E0F7F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, color: '#00A896', fontWeight: 'bold' },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#1A1D1E' },
  profileEmail: { fontSize: 14, color: '#A0A7B0', marginTop: 4 },
  divider: { width: '100%', height: 1, backgroundColor: '#F0F3F3', marginVertical: 24 },
  infoTitle: { alignSelf: 'flex-start', fontSize: 16, fontWeight: 'bold', color: '#1A1D1E', marginBottom: 8 },
  infoBody: { alignSelf: 'flex-start', fontSize: 15, color: '#666', marginBottom: 32 },
  logoutButton: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#FF4D4D', paddingVertical: 14, borderRadius: 14, width: '100%', alignItems: 'center' },
  logoutButtonText: { color: '#FF4D4D', fontSize: 15, fontWeight: 'bold' }
});