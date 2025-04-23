/*
-  Cette page affiche la météo du jour détaillée (température, humidité, vent, etc.) en fonction de la localisation actuelle. 
-  Utilisez l’API OpenWeather pour récupérer les données météo.
-  Affichez les informations dans un composant structuré avec des icônes et des textes.
*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import CurrentWeather from '../components/CurrentWeather';
import ForecastWeather from '../components/ForecastWeather';
import { getCurrentLocation } from '../services/LocationService';

import { API_KEY } from '../services/config';

export default function HomeScreen() {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  

  // Récupération initiale de la position
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
        setErrorMsg('Erreur de géolocalisation');
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
      console.error("Erreur lors de la récupération des données météo:", error);
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
      console.error("Erreur lors de la recherche de la ville:", error);
      setErrorMsg("Erreur lors de la recherche de la ville");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accueil</Text>
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: '#04a5e5',
    backgroundColor: '#04a5e5',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#7287fd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});