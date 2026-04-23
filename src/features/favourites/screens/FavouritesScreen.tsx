import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { useAppSelector } from '../../../store';
import { ProgressiveImage } from '../../../components/ProgressiveImage';

/** Offline favourites list rendered only from SQLite-backed Redux data. */
export function FavouritesScreen() {
  const items = useAppSelector(state => state.favourites.items);

  if (items.length === 0) {
    return <EmptyState title="No favourites yet" subtitle="Add characters from detail screen." />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={items}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.imageWrap}>
            <ProgressiveImage uri={item.image} style={styles.image} />
          </View>
          <View style={styles.meta}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.status} • {item.species}</Text>
            <Text numberOfLines={1}>Last known: {item.locationName}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 10, flexDirection: 'row', gap: 10 },
  imageWrap: { width: 72, height: 72, borderRadius: 10, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  meta: { flex: 1 },
  name: { fontWeight: '700', fontSize: 16 },
});
