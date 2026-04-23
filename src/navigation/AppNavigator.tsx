import { Suspense, lazy } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SkeletonList } from '../components/SkeletonList';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveTab } from '../store/slices/uiSlice';

const CharacterListScreen = lazy(() =>
  import('../features/characters/screens/CharacterListScreen').then(module => ({
    default: module.CharacterListScreen,
  })),
);
const CharacterDetailScreen = lazy(() =>
  import('../features/characters/screens/CharacterDetailScreen').then(module => ({
    default: module.CharacterDetailScreen,
  })),
);
const EpisodesScreen = lazy(() =>
  import('../features/episodes/screens/EpisodesScreen').then(module => ({
    default: module.EpisodesScreen,
  })),
);
const LocationsScreen = lazy(() =>
  import('../features/locations/screens/LocationsScreen').then(module => ({
    default: module.LocationsScreen,
  })),
);
const FavouritesScreen = lazy(() =>
  import('../features/favourites/screens/FavouritesScreen').then(module => ({
    default: module.FavouritesScreen,
  })),
);

type RootStackParamList = {
  Home: undefined;
  CharacterDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Root navigator with lazy-loaded screen components. */
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Morty Explorer' }} />
        <Stack.Screen name="CharacterDetail" component={CharacterDetailRoute} options={{ title: 'Character' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }: { navigation: { navigate: (route: 'CharacterDetail', params: { id: number }) => void } }) {
  const dispatch = useAppDispatch();
  const tab = useAppSelector(state => state.ui.activeTab);
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['Characters', 'Episodes', 'Locations', 'Favourites'] as const).map(name => (
          <Pressable key={name} style={[styles.tab, tab === name ? styles.tabActive : undefined]} onPress={() => dispatch(setActiveTab(name))}>
            <Text style={styles.tabText}>{name}</Text>
          </Pressable>
        ))}
      </View>
      <Suspense fallback={<SkeletonList />}>
        {tab === 'Characters' ? <CharacterListScreen onCharacterPress={id => navigation.navigate('CharacterDetail', { id })} /> : null}
        {tab === 'Episodes' ? <EpisodesScreen /> : null}
        {tab === 'Locations' ? <LocationsScreen /> : null}
        {tab === 'Favourites' ? <FavouritesScreen /> : null}
      </Suspense>
    </View>
  );
}

function CharacterDetailRoute({ route }: { route: { params: { id: number } } }) {
  return (
    <Suspense fallback={<SkeletonList />}>
      <CharacterDetailScreen characterId={route.params.id} />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FB' },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#E4EBF3' },
  tabActive: { backgroundColor: '#1777F2' },
  tabText: { color: '#0F172A', fontWeight: '600' },
});
