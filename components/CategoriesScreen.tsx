import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Genre = {
  id: number;
  name: string;
};

type RootStackParamList = {
  Categories: undefined;
  CategoryDetails: { genreId: number; genreName: string };
};

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;

type Props = {
  navigation: CategoriesScreenNavigationProp;
};

// Mapeamento de ícones para categorias
const genreIcons: { [key: string]: string } = {
  Action: 'movie-filter',
  Adventure: 'terrain',
  Animation: 'animation',
  Comedy: 'sentiment-very-satisfied',
  Crime: 'security',
  Documentary: 'description',
  Drama: 'theaters',
  Family: 'family-restroom',
  Fantasy: 'auto-awesome',
  History: 'history',
  Horror: 'mood-bad',
  Music: 'music-note',
  Mystery: 'visibility-off',
  Romance: 'favorite',
  'Science Fiction': 'science',
  'TV Movie': 'live-tv',
  Thriller: 'whatshot',
  War: 'public',
  Western: 'landscape',
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
            <Icon
              name={genreIcons[item.name] || 'movie'} // Ícone padrão para categorias sem ícone específico
              size={32}
              color="#e50914"
              style={styles.genreIcon}
            />
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
    backgroundColor: '#1c1c1c',
  },
  genreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  genreIcon: {
    marginRight: 16,
  },
  genreName: {
    fontSize: 18,
    color: '#fff',
  },
});

export default CategoriesScreen;