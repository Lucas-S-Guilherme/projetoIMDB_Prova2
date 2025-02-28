import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SearchScreen from '../screens/SearchScreen'; // Ajuste o caminho conforme seu projeto

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar Filmes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
