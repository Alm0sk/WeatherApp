import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native'; // Importer useRoute
import CurrentWeather from '../components/CurrentWeather';
import ForecastWeather from '../components/ForecastWeather';
import { getCurrentLocation } from '../services/LocationService';
import { API_KEY } from '../services/config';
import BurgerMenu from '../components/BurgerMenu';

export default function HomeScreen() {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const route = useRoute(); // Utiliser useRoute pour accéder aux paramètres

  /****************************************************************
   *** Réccupération de la position en fonction de la situation ***
   ****************************************************************/

  useEffect(() => {
    if (route.params?.latitude && route.params?.longitude) {
      // Si les coordonnées sont déjà fournies, les utiliser
      setCoordinates({
        latitude: route.params.latitude,
        longitude: route.params.longitude,
      });
    } else {
      // Sinon, récupérer la position actuelle du telephone
      getCurrentLocation()
        .then((position) => {
          if (position) {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération de la position:', error);
          setErrorMsg('Erreur de géolocalisation');
        });
    }
  }, [route.params]);

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
          lang: 'fr',
        },
      });
      setWeatherData(response.data);
      setErrorMsg(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo:", error);
      setErrorMsg("Erreur lors de la récupération des données météo");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BurgerMenu />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
