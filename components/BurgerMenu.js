import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function BurgerMenu() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleNavigate = (screen) => {
    closeMenu();
    navigation.navigate(screen);
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="menu"
            size={28}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item onPress={() => handleNavigate('Accueil')} title="Accueil" />
        <Menu.Item onPress={() => handleNavigate('Précipitations')} title="Prévisions de pluie" />
        <Menu.Item onPress={() => handleNavigate('Recherche')} title="Recherche" />
      </Menu>
    </View>
  );
}