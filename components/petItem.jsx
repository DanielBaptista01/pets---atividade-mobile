import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const InfoItem = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}: </Text>
    <Text style={styles.info}>{value || 'Não informado'}</Text>
  </View>
);

export function PetItem({ pet }) {
  return (
    <View style={styles.petCard}>
      {pet.images?.length > 0 && (
        <Image source={{ uri: pet.images[0] }} style={styles.image} />
      )}
      <Text style={styles.petName}>{pet.name}</Text>
      <View style={styles.divider} />
      <InfoItem label="Idade" value={`${pet.age} anos`} />
      <InfoItem label="Peso" value={`${pet.weight} kg`} />
      <InfoItem label="Cor" value={pet.color} />
      <InfoItem label="Características" value={pet.story} />
    </View>
  );
}

const styles = StyleSheet.create({
  petCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, marginHorizontal: 5, elevation: 3 , flex: 1, maxWidth: '48%' },
  petName: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' , resizeMode: 'cover'},
  image: { width: '100%', height: 120, borderRadius: 10, marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  label: { fontWeight: 'bold', width: 70 },
  info: { flex: 1, color: '#666' }
});