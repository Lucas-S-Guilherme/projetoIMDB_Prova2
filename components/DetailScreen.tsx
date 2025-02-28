import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 🔹 Definição dos tipos para a navegação
type RootStackParamList = {
  Details: { movieId: number };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type Props = {
  route: DetailsScreenRouteProp;
};

// 🔹 Definição do tipo do estado `movie`
type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path?: string;
  backdrop_path?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
};

const { width } = Dimensions.get('window');

const DetailsScreen: React.FC<Props> = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get<MovieDetails>(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
            },
          }
        );
        setMovie(response.data);
      } catch (error) {
        console.error(error);
        setError('Erro ao carregar detalhes do filme.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!movie) {
    return <View> <Text style={styles.errorText}>Filme não encontrado.</Text>
    </View>;
  }

  return (
    <ScrollView style={styles.container}>
      {movie.backdrop_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
          style={styles.backdrop}
        />
      )}
      <View style={styles.details}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.releaseDate}>{movie.release_date}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <Text style={styles.rating}>Avaliação: {movie.vote_average}</Text>
        {movie.runtime && (
          <Text style={styles.runtime}>Duração: {movie.runtime} minutos</Text>
        )}
        {movie.genres && (
          <Text style={styles.genres}>
            Gêneros: {movie.genres.map((genre) => genre.name).join(', ')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backdrop: {
    width: '100%',
    height: 200,
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  releaseDate: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  overview: {
    fontSize: 16,
    color: '#444',
    marginTop: 16,
  },
  rating: {
    fontSize: 16,
    color: '#444',
    marginTop: 16,
  },
  runtime: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
  },
  genres: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default DetailsScreen;