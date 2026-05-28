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

// Componente utilizando a função FETCHPET que JÁ EXISTIA no teu contexto global
// Componente de Listagem com Rodagem de Páginas Integrada
import { fetchPets as fetchPetsAPI } from './services/petService'; // Certifique-se de que a importação está no topo do App.js

function ListaDePets({ onSelectPet }) {
  // Puxa as funções de estado do contexto global
  const { pets, setPets, loading, setLoading, error, setError } = usePets();
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function carregarPaginaServidor() {
      try {
        setLoading(true);
        setError(null);
        
        // Faz a chamada real com a página atual diretamente no service
        const data = await fetchPetsAPI(page, 6);
        const novaLista = data.pets || data;
        
        if (Array.isArray(novaLista)) {
          setPets(novaLista); // Atualiza a tela limpando os pets antigos
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarPaginaServidor();
  }, [page]); // Roda sempre que a página mudar

  if (loading) return <ActivityIndicator size="large" color="#00A896" style={{ marginTop: 50 }} />;
  if (error) return <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>{error}</Text>;
  
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={pets}
        keyExtractor={(item) => `${item._id}_page_${page}`}
        numColumns={2}
        key={2}
        renderItem={({ item }) => (
          <PetItem pet={item} onPress={() => onSelectPet(item)} />
        )}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#666', marginTop: 40 }}>
            Nenhum pet encontrado nesta página.
          </Text>
        }
      />

      {/* 🧭 CONTROLE DE RODAGEM DE PÁGINAS */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]} 
          onPress={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          <Text style={styles.pageButtonText}>◀ Voltar</Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>Página {page}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.pageButton, pets.length < 6 && styles.pageButtonDisabled]} 
          onPress={() => setPage((p) => p + 1)}
          disabled={pets.length < 6} // Trava se a página atual vier incompleta (fim dos dados)
        >
          <Text style={styles.pageButtonText}>Avançar ▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Componente dos teus pets cadastrados
function AbasMeusPets({ onSelectPet, user }) {
  const [meusPets, setMeusPets] = useState([]);
  const [loadingMeus, setLoadingMeus] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoadingMeus(true);
        const userToken = user?.token || user?.user?.token;
        
        if (userToken) {
          const data = await fetchMyPets(userToken);
          if (Array.isArray(data)) {
            setMeusPets(data);
          } else if (data && Array.isArray(data.pets)) {
            setMeusPets(data.pets);
          } else {
            setMeusPets([]);
          }
        }
      } catch (err) {
        console.log("Erro ao carregar Meus Pets:", err.message);
      } finally {
        setLoadingMeus(false);
      }
    }
    load();
  }, [user]);

  if (loadingMeus) return <ActivityIndicator size="large" color="#00A896" style={{ marginTop: 50 }} />;

  if (!meusPets || meusPets.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>
          Você ainda não cadastrou nenhum pet para adoção.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={meusPets}
      keyExtractor={(item) => item._id || String(Math.random())}
      numColumns={2}
      key={2}
      renderItem={({ item }) => (
        <PetItem pet={item} onPress={() => onSelectPet(item)} />
      )}
      contentContainerStyle={{ padding: 15 }}
    />
  );
}

function AppContent() {
  const { user, setUser, loading: userLoading } = useUserRegister(); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [currentTab, setCurrentTab] = useState('inicio');
  const [subTabInicial, setSubTabInicial] = useState('todos'); 
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
          setSubTabInicial('todos'); 
          await fetchPets(1, 6); // Recarrega a primeira página global usando o contexto
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
              <Text style={styles.headerTitle}>Pet Adopt</Text>
              <TouchableOpacity onPress={() => setIsCreatingPet(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Novo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.subTabBar}>
              <TouchableOpacity 
                style={[styles.subTabItem, subTabInicial === 'todos' && styles.subTabItemActive]} 
                onPress={() => setSubTabInicial('todos')}
              >
                <Text style={[styles.subTabText, subTabInicial === 'todos' && styles.subTabTextActive]}>
                  Todos os Pets
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.subTabItem, subTabInicial === 'meus' && styles.subTabItemActive]} 
                onPress={() => setSubTabInicial('meus')}
              >
                <Text style={[styles.subTabText, subTabInicial === 'meus' && styles.subTabTextActive]}>
                  Meus Pets ⭐
                </Text>
              </TouchableOpacity>
            </View>

            {subTabInicial === 'todos' ? (
              <ListaDePets onSelectPet={(pet) => setSelectedPet(pet)} />
            ) : (
              <AbasMeusPets onSelectPet={(pet) => setSelectedPet(pet)} user={user} />
            )}

          </View>
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
          <Text style={[styles.tabText, currentTab === 'inicio' && styles.tabTextActive]}>🐾 Pets</Text>
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
  header: { paddingTop: 50, paddingHorizontal: 24, paddingBottom: 15, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A1D1E' },
  addButton: { backgroundColor: '#00A896', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  subTabBar: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F3F3' },
  subTabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, marginHorizontal: 4, backgroundColor: '#F6FAFA' },
  subTabItemActive: { backgroundColor: '#E0F7F6' },
  subTabText: { fontSize: 14, color: '#A0A7B0', fontWeight: '500' },
  subTabTextActive: { color: '#00A896', fontWeight: 'bold' },
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
  logoutButtonText: { color: '#FF4D4D', fontSize: 15, fontWeight: 'bold' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F3F3' },
  pageButton: { backgroundColor: '#E0F7F6', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  pageButtonDisabled: { backgroundColor: '#F0F3F3', opacity: 0.5 },
  pageButtonText: { color: '#00A896', fontWeight: 'bold', fontSize: 14 },
  pageIndicator: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#F6FAFA', borderRadius: 8 },
  pageIndicatorText: { color: '#1A1D1E', fontWeight: 'bold', fontSize: 14 }
});