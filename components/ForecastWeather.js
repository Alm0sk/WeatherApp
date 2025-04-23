import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Weather from './Weather';

export default function ForecastWeather({ data }) {
  const [forecastsGrouped, setForecastsGrouped] = useState([]);

  useEffect(() => {
    if (data && data.list) {
      //liste avec les données nécessaires à l'affichage des prévisions
      const forecastsData = data.list.map(forecast => {
        let forecastDate = new Date(forecast.dt_txt);
        return {
          date: forecastDate,
          hour: forecastDate.getHours(),
          day: forecastDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }),
          temp: forecast.main.temp,
          icon: forecast.weather[0].icon,
        };
      });

      // liste contenant uniquement les jours de prévisions
      let daysGrouped = forecastsData.map(forecast => { 
            return (forecast.day); 
        }).filter((day, index, tableau) => { 
            return tableau.indexOf(day) === index; 
        }); 


      // liste contenant les prévisions regroupées par jours 
        let forecastsGrouped = daysGrouped.map(day => { 
            const forecasts = forecastsData.filter(forecast => forecast.day === day);             
 
            return ({ 
                day: day, 
                data: forecasts 
            }); 
        }); 
 
        forecastsGrouped[0].day = "Aujourd'hui"; 
 
 

      setForecastsGrouped(forecastsGrouped);
    }
  }, [data]);

  if (forecastsGrouped.length === 0) {
    return <Text>Chargement des prévisions...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {forecastsGrouped.map((group, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.date}>{group.day.toUpperCase()}</Text>
            <View style={styles.hourlyContainer}>
              {group.data.map((item, idx) => (
                <View key={idx} style={styles.weatherItem}>
                  <Weather forecast={item} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    marginVertical: 20,
  },
  dayContainer: {
    marginRight: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },
  hourlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  weatherItem: {
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 50,
    paddingVertical: 10,
  },
});