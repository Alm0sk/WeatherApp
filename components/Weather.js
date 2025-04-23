import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowIcon from './ShowIcon';

export default function Weather({ forecast }) {
  // Vérification de présence des données forecast
  if (!forecast) {
    return <Text style={{ color: 'red' }}>Données météo indisponibles</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {forecast.date.toLocaleTimeString([], { hour: '2-digit'})}
      </Text>
      <ShowIcon icon={forecast.icon} resolution="2x" size={40} />
      <Text style={styles.temp}>{Math.round(forecast.temp)}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 5,
  },
  time: {
    fontSize: 14,
  },
  temp: {
    fontSize: 16,
  },
});