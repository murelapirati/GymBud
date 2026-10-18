import { useRef, useCallback, useEffect, useMemo } from 'react';
import {
  FlatList,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export interface AutoScrollZoneConfig {
  zoneSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
}

/**
 * Calculates scroll velocity in pixels per frame based on finger absolute Y relative to list window bounds.
 * Positive = scroll down (finger near bottom).
 * Negative = scroll up (finger near top).
 * 0 = finger in neutral zone or outside bounds.
 */
export function calculateAutoScrollSpeed(
  fingerY: number,
  containerTop: number,
  containerHeight: number,
  config?: AutoScrollZoneConfig
): number {
  if (containerHeight <= 0) return 0;

  const zoneSize = config?.zoneSize ?? 100;
  const minSpeed = config?.minSpeed ?? 2;
  const maxSpeed = config?.maxSpeed ?? 14;

  const effectiveZone = Math.min(zoneSize, containerHeight / 2);
  const containerBottom = containerTop + containerHeight;

  // Top zone: containerTop to containerTop + effectiveZone
  if (fingerY <= containerTop + effectiveZone) {
    if (fingerY <= containerTop) {
      return -maxSpeed;
    }
    const ratio = (containerTop + effectiveZone - fingerY) / effectiveZone;
    return -(minSpeed + ratio * (maxSpeed - minSpeed));
  }

  // Bottom zone: containerBottom - effectiveZone to containerBottom
  if (fingerY >= containerBottom - effectiveZone) {
    if (fingerY >= containerBottom) {
      return maxSpeed;
    }
    const ratio = (fingerY - (containerBottom - effectiveZone)) / effectiveZone;
    return minSpeed + ratio * (maxSpeed - minSpeed);
  }

  return 0;
}

interface UseDragAutoScrollParams {
  listRef: React.RefObject<FlatList<any> | null>;
  containerRef: React.RefObject<View | null>;
  config?: AutoScrollZoneConfig;
}

export function useDragAutoScroll({
  listRef,
  containerRef,
  config,
}: UseDragAutoScrollParams) {
  const isDraggingRef = useRef<boolean>(false);
  const fingerYRef = useRef<number | null>(null);
  const containerTopRef = useRef<number>(0);
  const containerHeightRef = useRef<number>(0);
  const contentHeightRef = useRef<number>(0);
  const scrollOffsetRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const measureContainer = useCallback(() => {
    containerRef.current?.measureInWindow((_x, y, _width, height) => {
      containerTopRef.current = y;
      containerHeightRef.current = height;
    });
  }, [containerRef]);

  const step = useCallback(() => {
    if (!isDraggingRef.current) {
      rafIdRef.current = null;
      return;
    }

    const currentSpeed =
      fingerYRef.current !== null && containerHeightRef.current > 0
        ? calculateAutoScrollSpeed(
            fingerYRef.current,
            containerTopRef.current,
            containerHeightRef.current,
            config
          )
        : 0;

    if (currentSpeed !== 0) {
      const maxScroll = Math.max(0, contentHeightRef.current - containerHeightRef.current);
      const nextOffset = Math.min(maxScroll, Math.max(0, scrollOffsetRef.current + currentSpeed));
      if (nextOffset !== scrollOffsetRef.current) {
        scrollOffsetRef.current = nextOffset;
        listRef.current?.scrollToOffset({ offset: nextOffset, animated: false });
      }
    }

    rafIdRef.current = requestAnimationFrame(step);
  }, [listRef, config]);

  const onDragStart = useCallback(() => {
    isDraggingRef.current = true;
    measureContainer();
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(step);
    }
  }, [measureContainer, step]);

  const onDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    fingerYRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
  }, []);

  const onLayout = useCallback(
    (_e: LayoutChangeEvent) => {
      measureContainer();
    },
    [measureContainer]
  );

  const onContentSizeChange = useCallback((_w: number, h: number) => {
    contentHeightRef.current = h;
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const setFingerY = useCallback((y: number | null) => {
    fingerYRef.current = y;
  }, []);

  const onTouchStart = useCallback((e: GestureResponderEvent) => {
    fingerYRef.current = e.nativeEvent.pageY;
  }, []);

  const onTouchMove = useCallback((e: GestureResponderEvent) => {
    fingerYRef.current = e.nativeEvent.pageY;
  }, []);

  const onTouchEnd = useCallback(() => {
    fingerYRef.current = null;
  }, []);

  const onTouchCancel = useCallback(() => {
    fingerYRef.current = null;
  }, []);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onTouchesDown((e) => {
        'worklet';
        if (e.allTouches && e.allTouches.length > 0) {
          runOnJS(setFingerY)(e.allTouches[0].absoluteY);
        }
      })
      .onTouchesMove((e) => {
        'worklet';
        if (e.allTouches && e.allTouches.length > 0) {
          runOnJS(setFingerY)(e.allTouches[0].absoluteY);
        }
      })
      .onTouchesUp(() => {
        'worklet';
        runOnJS(setFingerY)(null);
      });
  }, [setFingerY]);

  return {
    panGesture,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    isDraggingRef,
    scrollOffsetRef,
    onDragStart,
    onDragEnd,
    onScroll,
    onLayout,
    onContentSizeChange,
  };
}
