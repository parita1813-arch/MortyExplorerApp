import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface ProgressiveImageProps {
  uri?: string;
  style?: StyleProp<ImageStyle>;
}

/** Progressive image that fades from tiny placeholder to full source. */
export function ProgressiveImage({ uri, style }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const hasSource = typeof uri === 'string' && uri.trim().length > 0;
  const normalizedUri = hasSource ? uri.trim() : '';

  useEffect(() => {
    setLoaded(false);
  }, [normalizedUri]);

  return (
    <View style={[styles.container, style as StyleProp<ViewStyle>]}>
      {hasSource ? (
        <>
          <Image
            source={{ uri: normalizedUri }}
            blurRadius={2}
            style={styles.layer}
            resizeMode="cover"
          />
          <Image
            source={{ uri: normalizedUri }}
            style={[styles.layer, loaded ? styles.visible : styles.hidden]}
            resizeMode="cover"
            onLoadStart={() => setLoaded(false)}
            onLoadEnd={() => setLoaded(true)}
          />
          {!loaded ? (
            <View style={styles.loadingOverlay} pointerEvents="none">
              <ActivityIndicator color="#1777F2" />
            </View>
          ) : null}
        </>
      ) : (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color="#1777F2" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 231, 235, 0.65)',
    zIndex: 2,
    elevation: 2,
  },
});
