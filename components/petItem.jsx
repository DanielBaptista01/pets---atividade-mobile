import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'; //

export function PetItem({ pet, onPress }) { //
  return (
    <TouchableOpacity style={styles.petCard} onPress={onPress} activeOpacity={0.8}> {/* */}
      {/* Imagem com cantos arredondados cobrindo bem o espaço */}
      <View style={styles.imageContainer}>
        {pet.images?.length > 0 ? (
          <Image source={{ uri: pet.images[0] }} style={styles.image} resizeMode="cover" /> 
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🐾</Text>
          </View>
        )}
      </View>
      
      {/* Textos minimalistas abaixo da foto */}
      <View style={styles.infoContainer}>
        <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
        <Text style={styles.petBreed} numberOfLines={1}>{pet.breed || 'Sem raça'}</Text>
        
        {/* Uma tag discreta com a idade */}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{pet.age} {pet.age === 1 ? 'ano' : 'anos'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  petCard: { 
    backgroundColor: '#fff', 
    borderRadius: 20, // Cantos bem arredondados como na imagem
    marginBottom: 16, 
    marginHorizontal: 6, 
    flex: 1, 
    maxWidth: '47%', 
    // Sombra bem suave (suavizada em relação ao elevation bruto)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, 
    overflow: 'hidden'
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#E0F7F6', // Fundo leve verde/azul pastel
  },
  image: { 
    width: '100%', 
    height: '100%' 
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 32 },
  infoContainer: { 
    padding: 12,
  },
  petName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1A1D1E' 
  },
  petBreed: { 
    fontSize: 13, 
    color: '#A0A7B0', 
    marginTop: 2,
    marginBottom: 8 
  },
  tag: {
    backgroundColor: '#E0F7F6', // Fundo azul pastel igual da imagem de ref
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  tagText: {
    fontSize: 11,
    color: '#00A896', // Texto verde-água escuro contratando com o fundo
    fontWeight: 'bold'
  }
});