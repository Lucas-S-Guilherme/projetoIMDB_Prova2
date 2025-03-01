import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

// Defina o tipo para os gêneros
type Genre = {
  id: number;
  name: string;
};

// Defina o tipo para a navegação
type RootStackParamList = {
  Categories: undefined;
  CategoryDetails: { genreId: number; genreName: string };
};

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;

type Props = {
  navigation: CategoriesScreenNavigationProp;
};

const CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
          },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={genres}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.genreItem}
            onPress={() => navigation.navigate('CategoryDetails', { genreId: item.id, genreName: item.name })}
          >
            <Text style={styles.genreName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  genreItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  genreName: {
    fontSize: 18,
  },
});

export default CategoriesScreen;