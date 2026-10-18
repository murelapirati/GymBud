import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';

const ProblemChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test crash occurred');
  }
  return <Text>Normal render</Text>;
};

describe('ErrorBoundary', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when no error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByText('Normal render')).toBeTruthy();
  });

  it('catches render error and displays error text on screen', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Application Error')).toBeTruthy();
    expect(getByText('Test crash occurred')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('allows retrying via Try Again button', () => {
    let throwError = true;
    const DynamicChild = () => {
      if (throwError) {
        throw new Error('Temporary failure');
      }
      return <Text>Recovered successfully</Text>;
    };

    const { getByText } = render(
      <ErrorBoundary>
        <DynamicChild />
      </ErrorBoundary>
    );

    expect(getByText('Temporary failure')).toBeTruthy();

    throwError = false;
    fireEvent.press(getByText('Try Again'));

    expect(getByText('Recovered successfully')).toBeTruthy();
  });
});
