import { StyleSheet, View } from 'react-native';

export function SkeletonList() {
  return (
    <View style={styles.wrapper}>
      {[0, 1, 2, 3, 4].map(index => (
        <View key={index} style={styles.card}>
          
          {/* Title */}
          <View style={styles.title} />

          {/* Subtitle */}
          <View style={styles.subtitle} />

          {/* Avatar row */}
          <View style={styles.avatarRow}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={styles.avatar} />
            ))}
          </View>

        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    gap: 12,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },

  title: {
    width: '60%',
    height: 14,
    borderRadius: 6,
    backgroundColor: '#E0E6ED',
  },

  subtitle: {
    width: '40%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E6ED',
    marginTop: 8,
  },

  avatarRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E6ED',
  },
});