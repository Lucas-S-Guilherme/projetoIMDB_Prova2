import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const ThemeSwitcher: React.FC = () => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(colorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    // Aqui você pode implementar a lógica para mudar o tema globalmente
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Modo Escuro</Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});

export default ThemeSwitcher;
