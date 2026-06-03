import React, { useState, useEffect } from 'react'; 
import { SafeAreaView, Text, View, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { PetProvider, usePets } from './context/petContext';
import { UserProvider, useUserRegister } from './context/userContext'; 
import { PetItem } from './components/petItem';
import LoginScreen from './components/loginScreen'; 
import { CadastroScreen } from './components/cadrastoScreen'; 
import { CreatePetScreen } from './components/CreatePetScreen'; 
import { DetailPetScreen } from './components/DetailPetScreen'; 
import { fetchMyPets } from './services/petService';

function VitrinePets({ onSelectPet, filtroAtivo, user, isDesktop }) {
  const { pets, loading, error, fetchPets } = usePets();
  const [meusPets, setMeusPets] = useState([]);
  const [loadingMeus, setLoadingMeus] = useState(false);

  const PROFESSOR_USER_ID = "640f63b4f13e33bdeb2858fd"; 

  useEffect(() => {
    async function loadMeusPets() {
      if (filtroAtivo === 'meus') {
        try {
          setLoadingMeus(true);
          const userToken = user?.token || user?.user?.token;
          if (userToken) {
            const data = await fetchMyPets(userToken);
            setMeusPets(data.pets || data);
          }
        } catch (err) {
          console.log(err.message);
        } finally {
          setLoadingMeus(false);
        }
      } else if (filtroAtivo === 'todos') {
        if (fetchPets) fetchPets();
      }
    }
    loadMeusPets();
  }, [filtroAtivo, user]);

  if (loading || loadingMeus) {
    return <ActivityIndicator size="small" color="#A37854" style={{ marginTop: 30 }} />;
  }

  let petsExibidos = [];
  if (filtroAtivo === 'todos') {
    petsExibidos = pets;
  } else if (filtroAtivo === 'meus') {
    petsExibidos = meusPets;
  } else if (filtroAtivo === 'professor') {
    petsExibidos = pets.filter(p => p.userId === PROFESSOR_USER_ID || p.user === PROFESSOR_USER_ID || p.user?._id === PROFESSOR_USER_ID);
  }

  return (
    <FlatList
      data={petsExibidos}
      keyExtractor={(item) => item._id || String(Math.random())}
      numColumns={isDesktop ? 4 : 2}
      key={isDesktop ? 4 : 2}
      scrollEnabled={false} 
      renderItem={({ item }) => (
        <PetItem pet={item} onPress={() => onSelectPet(item)} />
      )}
      contentContainerStyle={[styles.vitrineContainer, isDesktop && styles.vitrineDesktop]}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum pet cadastrado nesta categoria.</Text>
        </View>
      }
    />
  );
}

function AppContent() {
  const { user, setUser, loading: userLoading } = useUserRegister(); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [currentTab, setCurrentTab] = useState('inicio');
  const [filtroMural, setFiltroMural] = useState('todos'); 
  const [selectedPet, setSelectedPet] = useState(null);

  const { width } = useWindowDimensions();
  const isDesktop = width > 768; 

  if (userLoading) {
    return <ActivityIndicator size="large" color="#A37854" style={{ marginTop: 100 }} />;
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
    return <CreatePetScreen onGoBack={() => { setIsCreatingPet(false); setFiltroMural('meus'); }} />;
  }

  return (
    <SafeAreaView style={styles.containerApp}>
      
      {/* NAVBAR DO TOPO */}
      <View style={[styles.navbarSuperior, isDesktop && styles.navbarSuperiorDesktop]}>
        <View style={styles.navBrandArea}>
          <Image 
             source={require('./assets/slogan_pet.png')} 
             style={styles.logoSlogan}
          />
        </View>

        {isDesktop && (
          <View style={styles.menuLinksDesktop}>
            <TouchableOpacity style={styles.linkDesktopItem} onPress={() => setCurrentTab('inicio')}>
              <Text style={[styles.linkDesktopText, currentTab === 'inicio' && styles.linkDesktopTextActive]}>Explorar Pets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkDesktopItem} onPress={() => setCurrentTab('perfil')}>
              <Text style={[styles.linkDesktopText, currentTab === 'perfil' && styles.linkDesktopTextActive]}>Minha Conta</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity onPress={() => setIsCreatingPet(true)} style={styles.navActionBtn}>
          <Text style={styles.navActionBtnText}>Quero Doar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isDesktop ? 40 : 90 }}>
        
        {currentTab === 'inicio' && (
          <View style={isDesktop && styles.conteudoAlinhadoDesktop}>
            
            {/* HERO BANNER */}
            <View style={[styles.heroBanner, isDesktop && styles.heroBannerDesktop]}>
              <View style={styles.heroTextArea}>
                <Text style={[styles.heroTitleText, isDesktop && styles.heroTitleTextDesktop]}>Encontre seu{"\n"}melhor amigo</Text>
                <TouchableOpacity style={styles.heroButton} onPress={() => setFiltroMural('todos')}>
                  <Text style={styles.heroButtonText}>Ver Pets Disponíveis</Text>
                </TouchableOpacity>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop' }} 
                style={[styles.heroImage, isDesktop && styles.heroImageDesktop]} 
              />
            </View>

            <Text style={styles.muralTitle}>Mural Pet</Text>

            {/* PÍLULAS DE FILTRAGEM */}
            <View style={styles.pillFilterContainer}>
              <TouchableOpacity style={[styles.pillItem, filtroMural === 'todos' && styles.pillItemActive]} onPress={() => setFiltroMural('todos')}>
                <Text style={[styles.pillText, filtroMural === 'todos' && styles.pillTextActive]}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pillItem, filtroMural === 'meus' && styles.pillItemActive]} onPress={() => setFiltroMural('meus')}>
                <Text style={[styles.pillText, filtroMural === 'meus' && styles.pillTextActive]}>Meus Pets</Text>
              </TouchableOpacity>
            </View>

            <VitrinePets onSelectPet={(pet) => setSelectedPet(pet)} filtroAtivo={filtroMural} user={user} isDesktop={isDesktop} />
          </View>
        )}

        {currentTab === 'perfil' && (
          <View style={[styles.profileWrapper, isDesktop && styles.conteudoAlinhadoDesktop]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{user.user?.name ? user.user.name[0].toUpperCase() : 'U'}</Text>
            </View>
            <Text style={styles.profileNameText}>{user.user?.name || 'Usuário'}</Text>
            <Text style={styles.profileEmailText}>{user.user?.email || user.email}</Text>
            
            <View style={styles.dividerLine} />
            
            <TouchableOpacity 
              style={styles.btnDangerOutline} 
              onPress={() => {
                if (typeof window !== 'undefined' && window.confirm) {
                  if (window.confirm("Deseja mesmo sair da sua conta?")) {
                    setUser(null);
                  }
                } else {
                  Alert.alert("Sair", "Deseja mesmo sair da sua conta?", [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Sair", style: "destructive", onPress: () => setUser(null) }
                  ]);
                }
              }}
            >
              <Text style={styles.btnDangerOutlineText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* MENU INFERIOR (Mobile) */}
      {!isDesktop && (
        <View style={styles.tabNavContainer}>
          <TouchableOpacity style={styles.tabNavItem} onPress={() => setCurrentTab('inicio')}>
            <Text style={[styles.tabNavText, currentTab === 'inicio' && styles.tabNavTextActive]}>🐾 Explorar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabNavItem} onPress={() => setCurrentTab('perfil')}>
            <Text style={[styles.tabNavText, currentTab === 'perfil' && styles.tabNavTextActive]}>👤 Perfil</Text>
          </TouchableOpacity>
        </View>
      )}

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
  containerApp: { flex: 1, backgroundColor: '#c3914f' },
  
  navbarSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12, backgroundColor: '#FAF8F5' },
  navbarSuperiorDesktop: { paddingHorizontal: 60, paddingTop: 16, borderBottomWidth: 1, borderBottomColor: '#E6DFD3' },
  navBrandArea: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' },
  navBrandTitle: { fontSize: 22, fontWeight: '800', color: '#1A1D1E', letterSpacing: -0.5 },
  navBrandTagline: { fontSize: 11, color: '#8E8E93', fontWeight: '500', marginTop: -4, marginLeft: 4 },
  navActionBtn: { backgroundColor: '#A37854', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, justifyContent: 'center' },
  navActionBtnText: { color: '#111111', fontSize: 13, fontWeight: 'bold' },

  menuLinksDesktop: { flexDirection: 'row', marginLeft: 40, flex: 1, alignItems: 'center' },
  linkDesktopItem: { marginHorizontal: 16, paddingVertical: 8 },
  linkDesktopText: { fontSize: 15, color: '#8E8E93', fontWeight: '600' },
  linkDesktopTextActive: { color: '#A37854', fontWeight: 'bold' },

  // 🎨 CONFIGURAÇÃO AJUSTADA DO LOGOTIPO NA NAVBAR
  logoSlogan: {
    width: 140,            // Ajustado de 320 para 140 para caber perfeitamente na barra superior
    height: 55,            // Proporção ideal para não cortar o texto do slogan
    resizeMode: 'contain', // Mantém o desenho nítido e sem distorções
    alignSelf: 'flex-start',
    marginLeft: 0,         // Alinhado rente à borda esquerda do container
    marginBottom: 0,
  },

  conteudoAlinhadoDesktop: { width: '100%', maxWidth: 1200, alignSelf: 'center', paddingHorizontal: 40 },

  heroBanner: { flexDirection: 'row', backgroundColor: '#E6DFD3', marginHorizontal: 16, marginTop: 8, borderRadius: 24, height: 160, overflow: 'hidden', alignItems: 'center', borderWidth: 1, borderColor: '#E6DFD3' },
  heroBannerDesktop: { height: 280, marginTop: 32, borderRadius: 32 },
  heroTextArea: { flex: 1, paddingLeft: 24, justifyContent: 'center', zIndex: 2 },
  heroTitleText: { fontSize: 22, fontFamily: 'Comic Sans MS', fontWeight: '800', color: '#1A1D1E', lineHeight: 28 },
  heroTitleTextDesktop: { fontSize: 38, lineHeight: 48, letterSpacing: -0.5 },
  heroButton: { backgroundColor: '#A37854', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, marginTop: 14, alignSelf: 'flex-start' },
  heroButtonText: { color: '#131212', fontSize: 12, fontWeight: '700' },
  heroImage: { width: 140, height: '100%', position: 'absolute', right: 0, bottom: 0, opacity: 0.95, resizeMode: 'cover' },
  heroImageDesktop: { width: 350 },

  muralTitle: { fontSize: 30, fontFamily: 'Comic Sans MS', fontWeight: '800', color: '#1A1D1E', textAlign: 'center', marginTop: 36, marginBottom: 16, letterSpacing: -0.5 },
  vitrineContainer: { paddingHorizontal: 16 },
  vitrineDesktop: { paddingHorizontal: 0, marginTop: 16 },

  pillFilterContainer: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#E6DFD3', paddingHorizontal: 16, marginBottom: 24 },
  pillItem: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: '#E6DFD3', backgroundColor: '#FFF', marginHorizontal: 4 },
  pillItemActive: { backgroundColor: '#A37854', borderColor: '#A37854' },
  pillText: { fontSize: 13, color: '#666', fontWeight: '600' },
  pillTextActive: { color: '#161515', fontWeight: 'bold' },

  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 40, paddingHorizontal: 24 },
  emptyText: { color: '#8E8E93', fontSize: 14, textAlign: 'center' },

  profileWrapper: { alignItems: 'center', padding: 32, marginTop: 20, maxWidth: 440, alignSelf: 'center', width: '100%' },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E6DFD3', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarInitial: { fontSize: 36, color: '#A37854', fontWeight: 'bold' },
  profileNameText: { fontSize: 24, fontFamily: 'Comic Sans MS', fontWeight: 'bold', color: '#1A1D1E' },
  profileEmailText: { fontSize: 15, color: '#151516', marginTop: 4 },
  dividerLine: { width: '100%', height: 1, backgroundColor: '#E6DFD3', marginVertical: 24 },
  
  btnDangerOutline: { backgroundColor: '#d1cec6', borderWidth: 1.5, borderColor: '#FF4D4D', paddingVertical: 14, borderRadius: 14, width: '100%', alignItems: 'center', marginTop: 12 },
  btnDangerOutlineText: { color: '#FF4D4D', fontSize: 15, fontWeight: 'bold' },

  tabNavContainer: { flexDirection: 'row', height: 65, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E6DFD3', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10, position: 'absolute', bottom: 0, left: 0, right: 0 },
  tabNavItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabNavText: { fontSize: 13, color: '#8E8E93', fontWeight: '600' },
  tabNavTextActive: { color: '#A37854', fontWeight: 'bold' }
});