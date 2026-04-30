import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ActivityIndicator, Alert } from 'react-native';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);

  async function carregarPets() {
    try {
      setLoading(true);
      const response = await fetch(`https://petadopt.onrender.com/pet/pets`);
      const data = await response.json();
      
      setPets(Array.isArray(data) ? data : data.pets || []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de pets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarPets();
  }, []);

  const InfoItem = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}: </Text>
      <Text style={styles.info}>{value || 'Não informado'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Pets para Adoção</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={carregarPets}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "CARREGANDO..." : "ATUALIZAR LISTA"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
        )}

        {!loading && pets.length === 0 && (
          <Text style={styles.emptyText}>Nenhum pet encontrado no momento.</Text>
        )}

        {pets.map((item, index) => (
          <View key={item._id || index.toString()} style={styles.petCard}>
            <Text style={styles.petName}>{item.name}</Text>
            <View style={styles.divider} />
            <InfoItem label="Idade" value={`${item.age} anos`} />
            <InfoItem label="Peso" value={`${item.weight} kg`} />
            <InfoItem label="Cor" value={item.color} />
            <InfoItem label="História" value={item.story} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingTop: 20,
    paddingBottom: 15, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E9ECEF',
    alignItems: 'center'
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#212529' },
  scrollContent: { padding: 20 },
  refreshButton: { 
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    elevation: 2,
    marginBottom: 20 
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  petCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  petName: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 5 },
  divider: { height: 1, backgroundColor: '#F1F3F5', marginVertical: 10 },
  infoRow: { flexDirection: 'row', marginBottom: 6 },
  label: { fontWeight: 'bold', color: '#495057', width: 60 },
  info: { color: '#6C757D', flex: 1 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#ADB5BD', fontSize: 16 }
});
