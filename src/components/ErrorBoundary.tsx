import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  componentStack: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      componentStack: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    this.setState({
      componentStack: errorInfo.componentStack || null,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      componentStack: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.card}>
              <Text style={styles.title}>Application Error</Text>
              <Text style={styles.subtitle}>
                An unexpected error occurred while rendering.
              </Text>

              <View style={styles.errorBox}>
                <Text style={styles.errorLabel}>Message:</Text>
                <Text style={styles.errorText}>
                  {this.state.error?.message || 'Unknown error'}
                </Text>
              </View>

              {this.state.componentStack && (
                <View style={styles.stackBox}>
                  <Text style={styles.stackLabel}>Component Stack:</Text>
                  <Text style={styles.stackText} numberOfLines={12}>
                    {this.state.componentStack}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleReset}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#161622',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A3C',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF4D4D',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#1F1F30',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF4D4D',
  },
  errorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#F87171',
    fontFamily: 'monospace',
  },
  stackBox: {
    backgroundColor: '#13131D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    maxHeight: 180,
  },
  stackLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  stackText: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
