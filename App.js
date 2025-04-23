import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { getCurrentLocation } from './services/LocationService';
import CurrentWeather from './components/CurrentWeather';
import ForecastWeather from './components/ForecastWeather';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import NavigationBar from './components/NavigationBar';

import { API_KEY } from './services/config';

export default function App() {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  

  const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

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
          appid: API_KEY,
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


  return (
    <PaperProvider>
      <NavigationContainer theme={MyTheme}>
        <ImageBackground 
          source={require('./assets/Backgrounds/base.jpg')}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <NavigationBar />
          <StatusBar style="auto" />
        </ImageBackground>
      </NavigationContainer>
    </PaperProvider>
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