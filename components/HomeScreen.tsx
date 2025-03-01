import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Categories: undefined;
  Details: { movieId: number };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Busca o filme em destaque (o primeiro filme popular)
        const popularResponse = await axios.get('https://api.themoviedb.org/3/movie/popular', {
          params: {
            api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
            language: 'pt-BR',
            page: 1,
          },
        });
        setFeaturedMovie(popularResponse.data.results[0]);

        // Busca os próximos lançamentos
        const upcomingResponse = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
          params: {
            api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
            language: 'pt-BR',
            page: 1,
          },
        });
        setUpcomingMovies(upcomingResponse.data.results);

        // Busca os mais bem avaliados
        const topRatedResponse = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
          params: {
            api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
            language: 'pt-BR',
            page: 1,
          },
        });
        setTopRatedMovies(topRatedResponse.data.results);
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderSection = (title: string, data: Movie[], horizontal: boolean = false) => (
    <View>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{title}</Text>
      <FlatList
        data={data}
        horizontal={horizontal}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Details', { movieId: item.id })}
          >
            <View style={horizontal ? styles.upcomingMovie : styles.topRatedMovie}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                style={horizontal ? styles.upcomingImage : styles.topRatedImage}
              />
              <Text style={[horizontal ? styles.upcomingTitle : styles.topRatedTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                {item.title}
              </Text>
              <Text style={[horizontal ? styles.upcomingRating : styles.topRatedRating, { color: isDarkMode ? '#888' : '#666' }]}>
                ⭐ {item.vote_average.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={horizontal ? styles.upcomingList : styles.topRatedList}
      />
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1c1c1c' : '#f5f5f5' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Botão de mudança de tema */}
      <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
        <Icon name={isDarkMode ? 'wb-sunny' : 'nights-stay'} size={24} color={isDarkMode ? '#fff' : '#000'} />
      </TouchableOpacity>

      <FlatList
        data={[]} // FlatList vazia para gerenciar a rolagem
        keyExtractor={() => 'root'}
        renderItem={null}
        ListHeaderComponent={
          <>
            {/* Seção Em Destaque */}
            {featuredMovie && (
              <View style={styles.featuredContainer}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${featuredMovie.poster_path}` }}
                  style={styles.featuredImage}
                />
                <View style={styles.featuredDetails}>
                  <Text style={[styles.featuredTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{featuredMovie.title}</Text>
                  <Text style={[styles.featuredYear, { color: isDarkMode ? '#888' : '#666' }]}>
                    {featuredMovie.release_date.split('-')[0]}
                  </Text>
                  <Text style={[styles.featuredOverview, { color: isDarkMode ? '#ccc' : '#444' }]} numberOfLines={3}>
                    {featuredMovie.overview}
                  </Text>
                  <TouchableOpacity style={styles.featuredButton}>
                    <Text style={styles.featuredButtonText}>Assistir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Seção Próximos Lançamentos */}
            {renderSection('Próximos Lançamentos', upcomingMovies, true)}

            {/* Seção Mais Bem Avaliados */}
            {renderSection('Mais Bem Avaliados', topRatedMovies, true)}
          </>
        }
      />

      {/* Barra de navegação inferior */}
        <View style={[styles.bottomNav, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={24} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.navText, { color: isDarkMode ? '#fff' : '#000' }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Search')}>
            <Icon name="search" size={24} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.navText, { color: isDarkMode ? '#fff' : '#000' }]}>Pesquisar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
            <Icon name="category" size={24} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.navText, { color: isDarkMode ? '#fff' : '#000' }]}>Categorias</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    marginTop: 20,
  },
  featuredContainer: {
    marginBottom: 24,
  },
  featuredImage: {
    width: '100%',
    height: 200, // Altura reduzida
    borderRadius: 12,
  },
  featuredDetails: {
    marginTop: 16,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  featuredYear: {
    fontSize: 16,
    marginTop: 8,
  },
  featuredOverview: {
    fontSize: 14,
    marginTop: 8,
  },
  featuredButton: {
    backgroundColor: '#e50914',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  featuredButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  upcomingList: {
    paddingBottom: 16,
  },
  upcomingMovie: {
    width: 120,
    marginRight: 16,
  },
  upcomingImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  upcomingTitle: {
    fontSize: 14,
    marginTop: 8,
  },
  upcomingRating: {
    fontSize: 12,
    marginTop: 4,
  },
  topRatedList: {
    paddingBottom: 16,
  },
  topRatedMovie: {
    width: 120,
    marginRight: 16,
  },
  topRatedImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  topRatedTitle: {
    fontSize: 14,
    marginTop: 8,
  },
  topRatedRating: {
    fontSize: 12,
    marginTop: 4,
  },
  themeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default HomeScreen;