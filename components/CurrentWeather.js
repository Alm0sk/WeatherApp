import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowIcon from './ShowIcon';
import { icon } from '@fortawesome/fontawesome-svg-core';


/* Récupération des données météo */
export default function CurrentWeather({ data }) {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (data && data.list && data.list.length > 0) {
      setCurrent(data.list[0]); // Première météo
    }
  }, [data]);

  if (!current) {
    return <Text>Chargement de la météo actuelle...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{data.city?.name || 'Ville inconnue'}</Text>
      <Text style={styles.date}>
        Aujourd'hui à {new Date(current.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <View style={styles.icon}>
        <ShowIcon icon={current.weather[0].icon} resolution="2x" size={125} />
      </View>
      <Text style={styles.temperature}>{Math.round(current.main.temp)}°C</Text>
      <Text style={styles.description}>{current.weather[0].description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignItems: 'center',
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    marginVertical: 5,
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 35,
    
  },
  temperature: {
    fontSize: 80,
    marginLeft: 10,
  },
  description: {
    fontSize: 18,
    fontStyle: 'italic',
  },
});