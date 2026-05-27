import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export function PetItem({ pet, onPress }) {
  return (
    <TouchableOpacity style={styles.petCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {pet.images?.length > 0 ? (
          <Image source={{ uri: pet.images[0] }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🐾</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
        <Text style={styles.petBreed} numberOfLines={1}>{pet.breed || 'Sem raça'}</Text>
        
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
    borderRadius: 20, 
    marginBottom: 16, 
    marginHorizontal: 6, 
    flex: 1, 
    maxWidth: '47%', 
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden'
  },
  imageContainer: { width: '100%', height: 130, backgroundColor: '#E0F7F6' },
  image: { width: '100%', height: '100%' },
  placeholderImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 32 },
  infoContainer: { padding: 12 },
  petName: { fontSize: 16, fontWeight: 'bold', color: '#1A1D1E' },
  petBreed: { fontSize: 13, color: '#A0A7B0', marginTop: 2, marginBottom: 8 },
  tag: { backgroundColor: '#E0F7F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  tagText: { fontSize: 11, color: '#00A896', fontWeight: 'bold' }
});