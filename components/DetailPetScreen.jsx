import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export function DetailPetScreen({ pet, onGoBack }) {
  return (
    <SafeAreaView style={styles.container}>
      
      <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
        <Text style={styles.backButtonText}>‹ Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pet.images?.length > 0 ? (
          <Image source={{ uri: pet.images[0] }} style={styles.bigImage} resizeMode="cover" />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={{ fontSize: 40 }}>🐾</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed || 'Raça não informada'}</Text>
          
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Idade</Text>
              <Text style={styles.value}>{pet.age} {pet.age === 1 ? 'ano' : 'anos'}</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.label}>Peso</Text>
              <Text style={styles.value}>{pet.weight} kg</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.label}>Cor</Text>
              <Text style={styles.value}>{pet.color}</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.label}>Gênero</Text>
              <Text style={styles.value}>{pet.gender === 'female' ? 'Fêmea' : 'Macho'}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>História</Text>
          <Text style={styles.storyText}>{pet.story || 'Sem descrição cadastrada.'}</Text>

          <View style={styles.ownerCard}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>👤</Text>
            </View>
            <View>
              <Text style={styles.ownerTitle}>Cadastrado por</Text>
              <Text style={styles.ownerName}>{pet.user?.name || 'Protetor Anônimo'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.adoptButton} onPress={() => alert('Entrando em contato...')} activeOpacity={0.8}>
            <Text style={styles.adoptButtonText}>Quero Adotar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  content: { 
    paddingBottom: 40 
  },
  bigImage: { 
    width: '100%', 
    height: 300 
  },
  noImagePlaceholder: { 
    width: '100%', 
    height: 300, 
    backgroundColor: '#E0F7F6', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    zIndex: 10,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
  },
  backButtonText: { 
    color: '#333', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  infoContainer: { 
    padding: 24, 
    marginTop: -20, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24 
  },
  petName: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1A1D1E' 
  },
  petBreed: { 
    fontSize: 16, 
    color: '#A0A7B0', 
    marginTop: 4, 
    marginBottom: 20 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  gridItem: { 
    width: '48%', 
    backgroundColor: '#F6FAFA', 
    padding: 14, 
    borderRadius: 16, 
    marginBottom: 12 
  },
  label: { 
    fontSize: 11, 
    color: '#A0A7B0', 
    fontWeight: 'bold', 
    textTransform: 'uppercase' 
  },
  value: { 
    fontSize: 15, 
    color: '#1A1D1E', 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1A1D1E', 
    marginBottom: 8, 
    marginTop: 10 
  },
  storyText: { 
    fontSize: 15, 
    color: '#666', 
    lineHeight: 22, 
    marginBottom: 24 
  },
  ownerCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F6FAFA', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 24 
  },
  ownerAvatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#E0F7F6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  ownerAvatarText: { 
    fontSize: 20 
  },
  ownerTitle: { 
    fontSize: 12, 
    color: '#A0A7B0' 
  },
  ownerName: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#1A1D1E' 
  },
  adoptButton: {
    backgroundColor: '#00A896',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 168, 156, 0.25)',
  },
  adoptButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});