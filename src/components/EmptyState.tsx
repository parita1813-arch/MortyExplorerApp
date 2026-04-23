import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

/** Empty state placeholder for zero-result views. */
export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>:)</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 28 },
  emoji: { fontSize: 36, marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#5A6570' },
});
