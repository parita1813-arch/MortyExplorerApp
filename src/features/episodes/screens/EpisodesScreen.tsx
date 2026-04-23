import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getCharactersByIds, getEpisodes } from '../../../api/endpoints';
import { ErrorState } from '../../../components/ErrorState';
import { ProgressiveImage } from '../../../components/ProgressiveImage';
import { SkeletonList } from '../../../components/SkeletonList';
import type { Episode } from '../../../types/api';

/** Episodes grouped by season with expandable cast preview. */
export function EpisodesScreen() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const query = useInfiniteQuery({
    queryKey: ['episodes'],
    queryFn: ({ pageParam }) => getEpisodes(pageParam),
    initialPageParam: 1,
    getNextPageParam: last => (last.info.next ? Number(new URL(last.info.next).searchParams.get('page')) : undefined),
  });

  const grouped = useMemo(() => {
    const episodes = query.data?.pages.flatMap(page => page.results) ?? [];
    return groupBySeason(episodes);
  }, [query.data]);
  const totalCount = query.data?.pages[0]?.info.count ?? 0;
  const loadedCount = query.data?.pages.flatMap(page => page.results).length ?? 0;

  if (query.isPending) {
    return <SkeletonList />;
  }
  if (query.isError) {
    return <ErrorState message={query.error.message} onRetry={query.refetch} />;
  }

  return (
    <FlatList
      data={grouped}
      keyExtractor={item => item.season}
      contentContainerStyle={styles.list}
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      }}
      ListHeaderComponent={
        <Text style={styles.counter}>
          Episodes loaded: {loadedCount}/{totalCount || 51}
        </Text>
      }
      ListFooterComponent={
        query.isFetchingNextPage ? <Text style={styles.sub}>Loading more episodes...</Text> : null
      }
      renderItem={({ item }) => (
        <View style={styles.seasonBlock}>
          <Text style={styles.season}>{item.season}</Text>
          {item.items.map(episode => (
            <View key={episode.id}>
              <Pressable
                style={[
                  styles.episodeRow,
                  selectedEpisode?.id === episode.id ? styles.episodeRowActive : undefined,
                ]}
                onPress={() => setSelectedEpisode(prev => (prev?.id === episode.id ? null : episode))}>
                <Text style={styles.title}>{episode.episode} - {episode.name}</Text>
                <Text style={styles.sub}>{episode.air_date}</Text>
              </Pressable>
              {selectedEpisode?.id === episode.id ? <EpisodeCharacters episode={episode} /> : null}
            </View>
          ))}
        </View>
      )}
    />
  );
}

function EpisodeCharacters({ episode }: { episode: Episode }) {
  const ids = episode.characters.map(url => Number(url.split('/').pop())).filter(Boolean);
  const query = useQuery({
    queryKey: ['episode-cast', episode.id],
    queryFn: () => getCharactersByIds(ids),
    enabled: ids.length > 0,
  });

  if (query.isPending) {
    return <Text style={styles.sub}>Loading cast...</Text>;
  }
  if (query.isError) {
    return <Text style={styles.sub}>Failed to load cast</Text>;
  }
  if (!query.data || query.data.length === 0) {
    return <Text style={styles.sub}>No cast found for this episode</Text>;
  }
  return (
    <FlatList
      horizontal
      data={query.data}
      keyExtractor={item => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.cast}>
          <View style={styles.castImageWrap}>
            <ProgressiveImage uri={item.image} style={styles.castImage} />
          </View>
          <Text numberOfLines={1} style={styles.castName}>{item.name}</Text>
        </View>
      )}
    />
  );
}

function groupBySeason(episodes: Episode[]) {
  const map = new Map<string, Episode[]>();
  episodes.forEach(episode => {
    const season = episode.episode.slice(0, 3);
    const list = map.get(season) ?? [];
    list.push(episode);
    map.set(season, list);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([season, items]) => ({
      season,
      items: items.sort((a, b) => a.episode.localeCompare(b.episode)),
    }));
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 10 },
  counter: { marginBottom: 8, color: '#334155', fontWeight: '600' },
  seasonBlock: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 10 },
  season: { fontWeight: '800', fontSize: 18, marginBottom: 6 },
  episodeRow: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#E4EBF3' },
  episodeRowActive: { backgroundColor: '#EEF4FF', borderRadius: 8, paddingHorizontal: 8 },
  title: { fontWeight: '600' },
  sub: { color: '#5A6570', marginTop: 4 },
  cast: { width: 90, marginRight: 8 },
  castImageWrap: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden' },
  castImage: { width: '100%', height: '100%' },
  castName: { fontSize: 12, marginTop: 4 },
});
