import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import RainForecastScreen from '../screens/RainForecastScreen';
import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();

export default function NavigationBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderTopWidth: 0,
            elevation: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Accueil') {
            iconName = 'home-outline';
          } else if (route.name === 'Précipitations') {
            iconName = 'cloud-outline';
          } else if (route.name === 'Recherche') {
            iconName = 'search-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Accueil" 
        component={HomeScreen}
        options={{
          tabBarItemStyle: { 
            flex: 1, 
            alignItems: 'flex-start', 
            justifyContent: 'center',
            paddingLeft: 20,
          },
        }}
      />
      <Tab.Screen 
        name="Précipitations" 
        component={RainForecastScreen}
        options={{
          tabBarItemStyle: { 
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center' 
          },
        }}
      />
      <Tab.Screen 
        name="Recherche" 
        component={SearchScreen}
        options={{
          tabBarItemStyle: { 
            flex: 1, 
            alignItems: 'flex-end', 
            justifyContent: 'center',
            paddingRight: 20,
          },
        }}
      />
    </Tab.Navigator>
  );
}