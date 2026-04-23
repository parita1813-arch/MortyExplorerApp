import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/** Error state with explicit retry action for API failures. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#5A6570', marginBottom: 16 },
  button: { backgroundColor: '#1777F2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
});
