import { useState } from 'react';
import { Image, StyleSheet, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';

interface ProgressiveImageProps {
  uri?: string;
  style?: StyleProp<ImageStyle>;
}

/** Progressive image that fades from tiny placeholder to full source. */
export function ProgressiveImage({ uri, style }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const hasSource = typeof uri === 'string' && uri.trim().length > 0;

  return (
    <View style={[styles.container, style as StyleProp<ViewStyle>]}>
      {hasSource ? (
        <>
          <Image
            source={{ uri }}
            blurRadius={2}
            style={styles.layer}
            resizeMode="cover"
          />
          <Image
            source={{ uri }}
            style={[styles.layer, loaded ? styles.visible : styles.hidden]}
            resizeMode="cover"
            onLoadEnd={() => setLoaded(true)}
          />
        </>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E7EB',
  },
});
