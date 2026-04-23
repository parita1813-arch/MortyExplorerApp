import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getCharacter, getEpisodesByIds } from '../../../api/endpoints';
import { ErrorState } from '../../../components/ErrorState';
import { SkeletonList } from '../../../components/SkeletonList';
import { ProgressiveImage } from '../../../components/ProgressiveImage';
import { addFavourite, removeFavourite } from '../../../store/slices/favouritesSlice';
import { useAppDispatch, useAppSelector } from '../../../store';
import type { Character } from '../../../types/api';

interface Props {
  characterId: number;
}

/** Character detail view with episode strip and favorite toggle. */
export function CharacterDetailScreen({ characterId }: Props) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favourites.items);
  const characterQuery = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => getCharacter(characterId),
  });
  const episodeIds = characterQuery.data?.episode.map(url => Number(url.split('/').pop())).filter(Boolean) ?? [];
  const episodesQuery = useQuery({
    queryKey: ['character-episodes', characterId, episodeIds.join(',')],
    queryFn: () => getEpisodesByIds(episodeIds),
    enabled: episodeIds.length > 0,
  });

  if (characterQuery.isPending) {
    return <SkeletonList />;
  }
  if (characterQuery.isError || !characterQuery.data) {
    return <ErrorState message={characterQuery.error?.message ?? 'Failed to load'} onRetry={characterQuery.refetch} />;
  }

  const character = characterQuery.data;
  const isFav = favorites.some(item => item.id === character.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageWrap}>
        <ProgressiveImage uri={character.image} style={styles.image} />
      </View>
      <Text style={styles.name}>{character.name}</Text>
      <Text style={styles.meta}>{character.status} • {character.species} • {character.gender}</Text>
      <Pressable
        style={[styles.favButton, isFav ? styles.activeButton : undefined]}
        onPress={() => {
          if (isFav) {
            dispatch(removeFavourite(character.id));
            return;
          }
          dispatch(addFavourite(character));
        }}>
        <Text style={styles.favText}>{isFav ? 'Remove Favourite' : 'Add Favourite'}</Text>
      </Pressable>

      <Text style={styles.section}>Details</Text>
      <DetailRow label="ID" value={String(character.id)} />
      <DetailRow label="Type" value={character.type || '-'} />
      <DetailRow label="Status" value={character.status} />
      <DetailRow label="Species" value={character.species} />
      <DetailRow label="Gender" value={character.gender} />
      <DetailRow label="Origin" value={character.origin.name} />
      <DetailRow label="Origin URL" value={character.origin.url || '-'} />
      <DetailRow label="Location" value={character.location.name} />
      <DetailRow label="Location URL" value={character.location.url || '-'} />
      <DetailRow label="Profile URL" value={character.url} />
      <DetailRow label="Created" value={formatDate(character.created)} />

      <Text style={styles.section}>Episodes</Text>
      <CharacterEpisodes
        character={character}
        isLoading={episodesQuery.isPending}
        isError={episodesQuery.isError}
        episodes={episodesQuery.data ?? []}
      />
    </ScrollView>
  );
}

function CharacterEpisodes(props: {
  character: Character;
  isLoading: boolean;
  isError: boolean;
  episodes: { id: number; episode: string; name: string; air_date: string }[];
}) {
  if (props.isLoading) {
    return <Text style={styles.meta}>Loading episodes...</Text>;
  }
  if (props.isError) {
    return <Text style={styles.meta}>Failed to load episode details</Text>;
  }
  if (props.episodes.length === 0) {
    return <Text style={styles.meta}>No episodes found</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {props.episodes.map(episode => (
        <View key={episode.id} style={styles.episodePill}>
          <Text style={styles.episodeCode}>{episode.episode}</Text>
          <Text numberOfLines={1} style={styles.episodeName}>{episode.name}</Text>
          <Text style={styles.episodeDate}>{episode.air_date}</Text>
        </View>
      ))}
      <View style={styles.countPill}>
        <Text style={styles.countText}>{props.character.episode.length} total</Text>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8, paddingBottom: 20 },
  imageWrap: { width: '100%', aspectRatio: 1, borderRadius: 16, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  name: { fontSize: 28, fontWeight: '800' },
  meta: { fontSize: 14, color: '#4B5560' },
  favButton: { marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: '#DDE3E9' },
  activeButton: { backgroundColor: '#1777F2' },
  favText: { color: '#111827', fontWeight: '700' },
  section: { marginTop: 8, fontWeight: '700', fontSize: 17 },
  detailRow: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10, gap: 2 },
  detailLabel: { color: '#5A6570', fontSize: 12, fontWeight: '600' },
  detailValue: { color: '#0F172A', fontSize: 14, fontWeight: '500' },
  episodePill: { width: 180, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: '#E4EBF3', marginRight: 8 },
  episodeCode: { fontWeight: '700', fontSize: 13 },
  episodeName: { marginTop: 4, fontWeight: '600', fontSize: 13 },
  episodeDate: { marginTop: 2, fontSize: 12, color: '#5A6570' },
  countPill: { justifyContent: 'center', paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#DCE7F8' },
  countText: { fontWeight: '700', color: '#1E3A8A' },
});
