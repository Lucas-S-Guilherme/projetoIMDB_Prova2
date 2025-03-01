import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';

// Defina o tipo para os filmes
type Movie = {
  id: number;
  title: string;
  poster_path?: string;
};

// Defina o tipo para a navegação
type RootStackParamList = {
  CategoryDetails: { genreId: number; genreName: string };
};

type CategoryDetailsScreenRouteProp = RouteProp<RootStackParamList, 'CategoryDetails'>;

type Props = {
  route: CategoryDetailsScreenRouteProp;
};

const CategoryDetailsScreen: React.FC<Props> = ({ route }) => {
  const { genreId, genreName } = route.params;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
            with_genres: genreId,
          },
        });
        setMovies(response.data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [genreId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{genreName}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  movieItem: {
    marginBottom: 16,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    marginTop: 8,
  },
});

export default CategoryDetailsScreen;