import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../components/HomeScreen';
import SearchScreen from '../components/SearchScreen';
import CategoriesScreen from '../components/CategoriesScreen';
import DetailScreen from '../components/DetailScreen';
import { RouteProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type RootStackParamList = {
  Home: undefined;
  Details: { movieId: number };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen 
      name="Details" 
      component={DetailScreen} 
      options={{ title: 'Detalhes do Filme' }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Início') {
          iconName = 'home';
        } else if (route.name === 'Buscar') {
          iconName = 'search';
        } else if (route.name === 'Categorias') {
          iconName = 'list';
        } else {
          iconName = 'help';
        }
        return {
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        };
      }}>
      <Tab.Screen name="Início" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Categorias" component={CategoriesScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
