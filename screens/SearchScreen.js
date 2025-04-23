import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_KEY } from '../services/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BurgerMenu from '../components/BurgerMenu';
import SearchHistory from '../components/SearchHistory';

export default function SearchScreen() {
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigation = useNavigation();

  // Charger l'historique au montage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('searchHistory');
        if (history) setSearchHistory(JSON.parse(history));
      } catch (e) {
        console.error('Erreur lors du chargement de l\'historique :', e);
      }
    };
    loadHistory();
  }, []);

  // Sauvegarder l'historique à chaque modification
  const saveHistory = async (history) => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de l\'historique :', e);
    }
  };

  const handleSearch = async (selectedCity = null) => {
    const cityToSearch = selectedCity || city;

    if (cityToSearch.trim() === '') {
      setErrorMsg('Veuillez entrer une ville.');
      return;
    }

    try {
      const geoResponse = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: cityToSearch,
          limit: 1,
          appid: API_KEY,
        },
      });

      if (geoResponse.data && geoResponse.data.length > 0) {
        const { lat, lon } = geoResponse.data[0];

        // Mise à jour et sauvegarde de l'historique
        setSearchHistory((prevHistory) => {
          let updatedHistory = prevHistory.filter(item => item !== cityToSearch);
          updatedHistory.unshift(cityToSearch);
          updatedHistory = updatedHistory.slice(0, 5);
          saveHistory(updatedHistory);
          return updatedHistory;
        });

        setErrorMsg(null);
        setCity('');
        navigation.navigate('Accueil', { latitude: lat, longitude: lon });
      } else {
        setErrorMsg('Ville non trouvée.');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de la ville :', error);
      setErrorMsg('Erreur lors de la recherche de la ville.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BurgerMenu />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Entrez le nom d'une ville..."
        value={city}
        onChangeText={setCity}
      />
      <TouchableOpacity style={styles.button} onPress={() => handleSearch()}>
        <Text style={styles.buttonText}>Rechercher</Text>
      </TouchableOpacity>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Dernières recherches :</Text>
        <SearchHistory history={searchHistory} onSelect={handleSearch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#04a5e5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#7287fd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  historyContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  placeholder: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
});
