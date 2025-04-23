import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { getCurrentLocation } from '../services/LocationService';
import { API_KEY } from '../services/config';
import BurgerMenu from '../components/BurgerMenu';

export default function RainForecastScreen() {
  const [region, setRegion] = useState(null); // Initialiser à null
  const route = useRoute();

  //TODO: La mise à jours de la position sur la carte en fonction de la dernière position ne fonctionne pas...

  useEffect(() => {
    const updateRegion = async () => {
      if (route.params?.latitude && route.params?.longitude) {
        // Si des coordonnées sont passées via la navigation, les utiliser
        setRegion({
          latitude: route.params.latitude,
          longitude: route.params.longitude,
          latitudeDelta: 10,
          longitudeDelta: 10,
        });
      } else {
        // Sinon, récupérer la position actuelle
        try {
          const position = await getCurrentLocation();
          if (position) {
            const { latitude, longitude } = position.coords;
            setRegion({
              latitude,
              longitude,
              latitudeDelta: 10,
              longitudeDelta: 10,
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la position:', error);
        }
      }
    };

    updateRegion();
  }, [route.params]); // Surveiller les changements dans route.params, ne marche

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7287fd" />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Précipitations</Text>
      <MapView
        style={styles.map}
        region={region} // Utiliser l'état pour définir la région
      >
        <UrlTile
          urlTemplate={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          maximumZ={19}
          flipY={false}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});