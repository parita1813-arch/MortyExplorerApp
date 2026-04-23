import { useMemo, useRef } from 'react';
import { Animated } from 'react-native';

/** Hook to animate header hide/show according to scroll direction. */
export function useHideHeaderOnScroll(headerHeight = 56) {
  const translateY = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);

  const onScroll = useMemo(
    () => (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const delta = currentY - lastOffset.current;
      lastOffset.current = currentY;

      if (Math.abs(delta) < 2) {
        return;
      }

      const toValue = delta > 0 ? -headerHeight : 0;
      Animated.timing(translateY, {
        toValue,
        duration: 180,
        useNativeDriver: true,
      }).start();
    },
    [headerHeight, translateY],
  );

  return { translateY, onScroll };
}
