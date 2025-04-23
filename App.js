import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { getCurrentLocation } from './services/LocationService';
import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';

import { NavigationContainer } from '@react-navigation/native';
import NavigationBar from './components/NavigationBar';


export default function App() {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  
  const API = 'd6def4924ad5f9a9b59f3ae895b234cb';

  // Récupération de la position au démarrage
  useEffect(() => {
    getCurrentLocation()
      .then((position) => {
        if (position) {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de la position:', error);
        setErrorMsg('Erreur lors de la récupération de la position');
      });
  }, []);

  // Récupération des données météo à partir des coordonnées
  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      fetchWeatherByCoordinates(coordinates.latitude, coordinates.longitude);
    }
  }, [coordinates]);

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API,
          units: 'metric',
          lang: 'fr'
        }
      });
      setWeatherData(response.data);
      setErrorMsg(null);
    } catch (error) {
      console.error("Erreur lors de la récupération du temps:", error);
      setErrorMsg("Erreur lors de la récupération des données météo");
    }
  };

  // Recherche par ville
  const handleSearch = async () => {
    if (city.trim() === '') return;
    try {
      const geoResponse = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: city,
          limit: 1,
          appid: API
        }
      });
      if (geoResponse.data && geoResponse.data.length > 0) {
        const { lat, lon } = geoResponse.data[0];
        setCoordinates({ latitude: lat, longitude: lon });
        setErrorMsg(null);
      } else {
        setErrorMsg("Ville non trouvée");
      }
    } catch (error) {
      console.error("Erreur lors de la géolocalisation de la ville:", error);
      setErrorMsg("Erreur lors de la recherche de la ville");
    }
  };

  return (
    <NavigationContainer>
      <ImageBackground 
        source={require('./assets/Backgrounds/base.jpg')}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.input}
              placeholder="Chercher une ville ..."
              value={city}
              onChangeText={setCity}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="#000" />
            </TouchableOpacity>
          </View>
          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
          {weatherData ? (
            <>
              <CurrentWeather data={weatherData} />
              <ForecastWeather data={weatherData} />
            </>
          ) : (
            <Text>Chargement des données météo...</Text>
          )}
          <NavigationBar />
          <StatusBar style="auto" />
        </View>
      </ImageBackground>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 0,
  },
  searchButton: {
    backgroundColor: '#7287fd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#04a5e5',
    backgroundColor: '#04a5e5',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});