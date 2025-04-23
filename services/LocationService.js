import * as Location from 'expo-location';

export async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('Accès à la localisation refusé');
        return;
    }
    
    let position = await Location.getCurrentPositionAsync({});
    return position;
    
}