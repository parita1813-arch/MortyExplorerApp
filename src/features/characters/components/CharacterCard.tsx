import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Character } from '../../../types/api';
import { ProgressiveImage } from '../../../components/ProgressiveImage';

interface CharacterCardProps {
  character: Character;
  onPress: (id: number) => void;
}

/** Card used across lists to render compact character summary. */
export function CharacterCard({ character, onPress }: CharacterCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(character.id)}>
      <View style={styles.imageWrapper}>
        <ProgressiveImage uri={character.image} style={styles.image} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.badge}>{character.status}</Text>
        <Text style={styles.detail}>{character.species}</Text>
        <Text style={styles.detail}>Last known: {character.location.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  meta: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '700' },
  badge: { fontSize: 13, fontWeight: '600', color: '#1777F2' },
  detail: { color: '#4B5560', fontSize: 13 },
});
