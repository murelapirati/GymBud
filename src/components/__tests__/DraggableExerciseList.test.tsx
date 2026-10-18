import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import DraggableExerciseList, { DragErrorBoundary, GripHandle } from '../workout/DraggableExerciseList';

let lastReorderableListProps: any = null;

// Mock react-native-reorderable-list for testing environment
jest.mock('react-native-reorderable-list', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => {
      lastReorderableListProps = props;
      const { data, renderItem, ListHeaderComponent, ListFooterComponent, ListEmptyComponent } = props;
      if (!data || data.length === 0) {
        return (
          <View testID="reorderable-list-empty">
            {ListHeaderComponent}
            {ListEmptyComponent}
            {ListFooterComponent}
          </View>
        );
      }
      return (
        <View testID="reorderable-list">
          {ListHeaderComponent}
          {data.map((item: any, index: number) => (
            <View key={item.id || index}>{renderItem({ item, index })}</View>
          ))}
          {ListFooterComponent}
        </View>
      );
    },
    useReorderableDrag: () => jest.fn(),
  };
});

const mockTheme = {
  card: '#1F2937',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  primary: '#6366F1',
  border: '#374151',
  surface: '#111827',
};

const mockExercises = [
  { id: 'ex-1', name: 'Barbell Bench Press', sets: [{ id: 's1', reps: 10 }] },
  { id: 'ex-2', name: 'Incline Dumbbell Press', sets: [{ id: 's2', reps: 12 }] },
  { id: 'ex-3', name: 'Triceps Pushdown', sets: [{ id: 's3', reps: 15 }] },
];

describe('DraggableExerciseList', () => {
  it('renders all exercises, header, and footer', () => {
    const onReorder = jest.fn();
    const { getByText } = render(
      <DraggableExerciseList
        exercises={mockExercises}
        onReorder={onReorder}
        theme={mockTheme}
        ListHeaderComponent={<Text>Workout Header</Text>}
        ListFooterComponent={<Text>Workout Footer</Text>}
        renderItem={(exercise) => (
          <View>
            <Text>{exercise.name}</Text>
          </View>
        )}
      />
    );

    expect(getByText('Workout Header')).toBeTruthy();
    expect(getByText('Barbell Bench Press')).toBeTruthy();
    expect(getByText('Incline Dumbbell Press')).toBeTruthy();
    expect(getByText('Triceps Pushdown')).toBeTruthy();
    expect(getByText('Workout Footer')).toBeTruthy();
  });

  it('renders empty component when no exercises are provided', () => {
    const onReorder = jest.fn();
    const { getByText } = render(
      <DraggableExerciseList
        exercises={[]}
        onReorder={onReorder}
        theme={mockTheme}
        ListEmptyComponent={<Text>No exercises yet</Text>}
        renderItem={(exercise) => (
          <View>
            <Text>{exercise.name}</Text>
          </View>
        )}
      />
    );

    expect(getByText('No exercises yet')).toBeTruthy();
  });

  it('renders GripHandle component', () => {
    const { getByTestId } = render(
      <View testID="grip-container">
        <GripHandle theme={mockTheme} />
      </View>
    );

    expect(getByTestId('grip-container')).toBeTruthy();
  });

  it('passes tuned autoscroll configuration and flex: 1 style to ReorderableList', () => {
    const onReorder = jest.fn();
    render(
      <DraggableExerciseList
        exercises={mockExercises}
        onReorder={onReorder}
        theme={mockTheme}
        renderItem={(exercise) => (
          <View>
            <Text>{exercise.name}</Text>
          </View>
        )}
      />
    );

    expect(lastReorderableListProps).toBeTruthy();
    expect(lastReorderableListProps.autoscrollThreshold).toBe(0);
    expect(lastReorderableListProps.autoscrollSpeedScale).toBe(1.5);
    expect(lastReorderableListProps.autoscrollDelay).toBe(16);
    expect(lastReorderableListProps.autoscrollActivationDelta).toBe(2);
    expect(lastReorderableListProps.autoscrollThresholdOffset).toEqual({ start: 10, end: 40 });
    expect(lastReorderableListProps.style).toEqual({ flex: 1 });
  });
});

describe('DragErrorBoundary', () => {
  const originalWarn = console.warn;
  const originalError = console.error;
  beforeAll(() => {
    console.warn = jest.fn();
    console.error = jest.fn();
  });
  afterAll(() => {
    console.warn = originalWarn;
    console.error = originalError;
  });

  const ThrowingComponent = () => {
    throw new Error('Drag gesture crashed');
  };

  it('renders children when no error occurs', () => {
    const onError = jest.fn();
    const { getByText } = render(
      <DragErrorBoundary
        onError={onError}
        fallback={<Text>Manual fallback list</Text>}
      >
        <Text>Normal drag list</Text>
      </DragErrorBoundary>
    );

    expect(getByText('Normal drag list')).toBeTruthy();
    expect(onError).not.toHaveBeenCalled();
  });

  it('catches error, invokes onError, and renders fallback', () => {
    const onError = jest.fn();
    const { getByText } = render(
      <DragErrorBoundary
        onError={onError}
        fallback={<Text>Manual fallback list</Text>}
      >
        <ThrowingComponent />
      </DragErrorBoundary>
    );

    expect(getByText('Manual fallback list')).toBeTruthy();
    expect(onError).toHaveBeenCalled();
  });
});
