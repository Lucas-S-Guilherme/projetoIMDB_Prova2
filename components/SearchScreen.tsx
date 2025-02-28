import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 🔹 Definir o tipo do filme baseado na resposta da API do TMDB
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date: string;
};

// 🔹 Definir o tipo da navegação
type RootStackParamList = {
  Search: undefined;
  Details: { movieId: number };
};

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

type Props = {
  navigation: SearchScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchMovies = async (pageNumber: number = 1) => {
    if (!query) {
      setError('Por favor, insira um termo de busca.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ results: Movie[]; total_pages: number }>(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
            query: query,
            page: pageNumber,
          },
        }
      );
      if (pageNumber === 1) {
        setMovies(response.data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      }
      setTotalPages(response.data.total_pages);
      if (response.data.results.length === 0) {
        setError('Nenhum filme encontrado.');
      }
    } catch (error) {
      console.error(error);
      setError('Ocorreu um erro ao buscar os filmes.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchMovies(nextPage);
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
    >
      {item.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
          style={styles.poster}
        />
      )}
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieReleaseDate}>{item.release_date}</Text>
        <Text style={styles.movieOverview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do filme"
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Buscar" onPress={() => searchMovies(1)} />
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : movies.length > 0 ? (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <Text style={styles.noResultsText}>Nenhum filme encontrado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieReleaseDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  movieOverview: {
    fontSize: 14,
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
  noResultsText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default SearchScreen;