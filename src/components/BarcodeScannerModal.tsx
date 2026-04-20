import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface BarcodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
  isExternallyLoading?: boolean;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  visible,
  onClose,
  onScan,
  isExternallyLoading = false,
}) => {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      requestPermission();
      setScanned(false);
      setIsLoading(false);
    }
  }, [visible]);

  // Sync internal loading with external loading state:
  // when parent finishes loading, clear the internal flag too
  useEffect(() => {
    if (!isExternallyLoading && scanned) {
      setIsLoading(false);
    }
  }, [isExternallyLoading]);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (scanned || isLoading || isExternallyLoading) return;

    setScanned(true);
    setIsLoading(true);
    onScan(data);
    // Loading state is now cleared via isExternallyLoading from the parent;
    // reset our local flag when external loading finishes.
  };

  const handleClose = () => {
    setScanned(false);
    setIsLoading(false);
    onClose();
  };

  if (!visible) return null;

  if (!permission) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.permissionText, { color: theme.text }]}>
            Requesting camera permission...
          </Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.permissionContainer}>
          <View style={[styles.permissionCard, { backgroundColor: theme.card }]}>
            <Ionicons name="camera-outline" size={64} color={theme.error} />
            <Text style={[styles.permissionTitle, { color: theme.text }]}>
              Camera Permission Required
            </Text>
            <Text style={[styles.permissionText, { color: theme.textSecondary }]}>
              Please grant camera access to scan barcodes
            </Text>
            <TouchableOpacity
              style={[styles.permissionButton, { backgroundColor: theme.primary }]}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.permissionButton, { backgroundColor: theme.card, marginTop: 8 }]}
              onPress={handleClose}
            >
              <Text style={[styles.permissionButtonText, { color: theme.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent={false} animationType="slide">
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr', 'code128', 'code39'] }}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Overlay with scan area indicator */}
        <View style={styles.overlay}>
          {/* Top bar */}
          <View style={[styles.topBar, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Scan area */}
          <View style={styles.scanAreaContainer}>
            <View style={styles.scanAreaTop} />
            <View style={styles.scanAreaMiddle}>
              <View style={styles.scanAreaSide} />
              <View style={styles.scanBox}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
                
                {isLoading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View style={styles.scanAreaSide} />
            </View>
            <View style={styles.scanAreaBottom}>
              <Text style={styles.instructionText}>
                {isLoading ? 'Looking up product...' : 'Align barcode within the frame'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');
const scanBoxSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: 320,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  scanAreaContainer: {
    flex: 1,
  },
  scanAreaTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanAreaMiddle: {
    flexDirection: 'row',
    height: scanBoxSize,
  },
  scanAreaSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanBox: {
    width: scanBoxSize,
    height: scanBoxSize,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAreaBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
