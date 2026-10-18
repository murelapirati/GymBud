import React, { Component, ReactNode, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import ReorderableList, {
  ReorderableListReorderEvent,
  useReorderableDrag,
} from 'react-native-reorderable-list';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useDragAutoScroll } from '../../hooks/useDragAutoScroll';

interface ExerciseItem {
  id: string;
  name?: string;
  sets?: any[];
  duration?: number;
  [key: string]: any;
}

interface DraggableExerciseListProps {
  exercises: ExerciseItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  renderItem: (exercise: ExerciseItem, index: number) => ReactNode;
  theme: any;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  contentContainerStyle?: any;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  style?: any;
  autoscrollThreshold?: number;
  autoscrollSpeedScale?: number;
  autoscrollDelay?: number;
  autoscrollActivationDelta?: number;
  autoscrollThresholdOffset?: { start?: number; end?: number; top?: number; bottom?: number };
}

interface DragErrorBoundaryProps {
  onError: () => void;
  children: ReactNode;
  fallback: ReactNode;
}

interface DragErrorBoundaryState {
  hasError: boolean;
}

export class DragErrorBoundary extends Component<DragErrorBoundaryProps, DragErrorBoundaryState> {
  state: DragErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): DragErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    if (__DEV__) {
      console.warn('Drag list caught an error, switching to fallback:', error);
    }
    this.props.onError();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function GripHandle({
  theme,
  onLongPress,
}: {
  theme: any;
  onLongPress?: () => void;
}) {
  const drag = useReorderableDrag();

  return (
    <TouchableOpacity
      style={styles.gripTouch}
      onLongPress={() => {
        onLongPress?.();
        drag();
      }}
      delayLongPress={200}
      activeOpacity={0.7}
    >
      <Ionicons name="reorder-two" size={24} color={theme.textSecondary} />
    </TouchableOpacity>
  );
}

export default function DraggableExerciseList({
  exercises,
  onReorder,
  renderItem,
  theme,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  style,
  autoscrollThreshold = 0,
  autoscrollSpeedScale = 1.5,
  autoscrollDelay = 16,
  autoscrollActivationDelta = 2,
  autoscrollThresholdOffset = { start: 10, end: 40 },
}: DraggableExerciseListProps) {
  const listRef = useRef<any>(null);
  const containerRef = useRef<View | null>(null);

  const {
    panGesture,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    onDragStart: autoScrollDragStart,
    onDragEnd: autoScrollDragEnd,
    onScroll: autoScrollScroll,
    onLayout: autoScrollLayout,
    onContentSizeChange: autoScrollContentSizeChange,
  } = useDragAutoScroll({
    listRef,
    containerRef,
  });

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const handleDragStart = useCallback(() => {
    'worklet';
    runOnJS(triggerHaptic)();
    runOnJS(autoScrollDragStart)();
  }, [triggerHaptic, autoScrollDragStart]);

  const handleDragEnd = useCallback(() => {
    'worklet';
    runOnJS(autoScrollDragEnd)();
  }, [autoScrollDragEnd]);

  const handleIndexChange = useCallback(() => {
    'worklet';
    runOnJS(triggerHaptic)();
  }, [triggerHaptic]);

  const handleReorder = useCallback(
    ({ from, to }: ReorderableListReorderEvent) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      if (from !== to && from >= 0 && to >= 0) {
        onReorder(from, to);
      }
    },
    [onReorder]
  );

  return (
    <View
      ref={containerRef}
      style={[{ flex: 1 }, style]}
      onLayout={autoScrollLayout}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      <ReorderableList
        ref={listRef}
        panGesture={panGesture}
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrapper}>{renderItem(item, index)}</View>
        )}
        onReorder={handleReorder}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onIndexChange={handleIndexChange}
        onScroll={autoScrollScroll}
        onContentSizeChange={autoScrollContentSizeChange}
        cellAnimations={{
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 12,
        }}
        autoscrollThreshold={autoscrollThreshold}
        autoscrollSpeedScale={autoscrollSpeedScale}
        autoscrollDelay={autoscrollDelay}
        autoscrollActivationDelta={autoscrollActivationDelta}
        autoscrollThresholdOffset={autoscrollThresholdOffset as any}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
  },
  gripTouch: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
});
