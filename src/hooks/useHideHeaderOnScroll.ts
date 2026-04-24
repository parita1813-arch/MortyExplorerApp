import { useMemo, useRef } from 'react';
import { Animated } from 'react-native';

/** Hook to animate header hide/show according to scroll direction. */
export function useHideHeaderOnScroll(headerHeight = 56) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const translateY = useMemo(() => {
    const clamped = Animated.diffClamp(scrollY, 0, headerHeight);
    return clamped.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [0, -headerHeight],
      extrapolate: 'clamp',
    });
  }, [headerHeight, scrollY]);

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY],
  );

  return { translateY, onScroll };
}
