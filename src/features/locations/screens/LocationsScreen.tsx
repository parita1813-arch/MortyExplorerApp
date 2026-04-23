import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getCharactersByIds, getLocations } from '../../../api/endpoints';
import { ErrorState } from '../../../components/ErrorState';
import { ProgressiveImage } from '../../../components/ProgressiveImage';
import { SkeletonList } from '../../../components/SkeletonList';
import type { Location } from '../../../types/api';

/** Locations screen with resident list expansion on tap. */
export function LocationsScreen() {
  const [selected, setSelected] = useState<Location | null>(null);
  const query = useInfiniteQuery({
    queryKey: ['locations'],
    queryFn: ({ pageParam }) => getLocations(pageParam),
    initialPageParam: 1,
    getNextPageParam: last => (last.info.next ? Number(new URL(last.info.next).searchParams.get('page')) : undefined),
  });

  const locations = query.data?.pages.flatMap(page => page.results) ?? [];

  if (query.isPending) {
    return <SkeletonList />;
  }
  if (query.isError) {
    return <ErrorState message={query.error.message} onRetry={query.refetch} />;
  }

  return (
    <FlatList
      data={locations}
      keyExtractor={item => item.id.toString()}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      }}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Pressable onPress={() => setSelected(selected?.id === item.id ? null : item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.type} • {item.dimension}</Text>
          </Pressable>
          {selected?.id === item.id ? <Residents location={item} /> : null}
        </View>
      )}
    />
  );
}

function Residents({ location }: { location: Location }) {
  const ids = location.residents.map(url => Number(url.split('/').pop())).filter(Boolean);
  const query = useQuery({ queryKey: ['location-residents', location.id], queryFn: () => getCharactersByIds(ids) });
  if (query.isPending) {
    return <Text style={styles.meta}>Loading residents...</Text>;
  }
  if (query.isError) {
    return <Text style={styles.meta}>Failed to load residents</Text>;
  }
  if (!query.data || query.data.length === 0) {
    return <Text style={styles.meta}>No residents found</Text>;
  }

  return (
    <FlatList
      horizontal
      data={query.data}
      keyExtractor={item => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.resident}>
          <View style={styles.thumbWrap}>
            <ProgressiveImage uri={item.image} style={styles.thumb} />
          </View>
          <Text style={styles.residentName} numberOfLines={1}>{item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12 },
  name: { fontWeight: '700', fontSize: 16 },
  meta: { color: '#5A6570', marginTop: 4 },
 resident: {
  width: 90,
  alignItems: 'center',
},

thumbWrap: {
  width: 80,
  height: 80,
  borderRadius: 40,
  overflow: 'hidden',
  backgroundColor: '#eee',
},
  thumb: { width: '100%', height: '100%' },
  residentName: { marginTop: 4, fontSize: 12 },
});
