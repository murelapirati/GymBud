import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ScannedProduct } from '../types';
import { calculateMacros } from '../utils/foodApi';

interface ProductDetailsModalProps {
  visible: boolean;
  product: ScannedProduct | null;
  onClose: () => void;
  onAdd: (calories: number, protein: number, carbs: number, fat: number, name: string, barcode: string, servingAmount: string, imageUrl?: string) => void;
  addButtonLabel?: string;
}

const MULTIPLIER_PRESETS = [0.25, 0.5, 1, 1.5, 2, 3];

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  visible,
  product,
  onClose,
  onAdd,
  addButtonLabel = 'Add to Diary',
}) => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'multiplier' | 'amount'>('multiplier');
  const [selectedServing, setSelectedServing] = useState(100);
  const [customServing, setCustomServing] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [editableName, setEditableName] = useState('');

  useEffect(() => {
    if (product) {
      setEditableName(product.name || '');
      // Default to full product quantity when it differs from the labeled serving size
      const hasFullChip =
        product.totalSize != null &&
        product.totalSizeUnit != null &&
        product.totalSize !== product.servingSize;
      const defaultPercent = hasFullChip
        ? Math.round((product.totalSize! / product.servingSize) * 100)
        : 100;
      setSelectedServing(defaultPercent);
      setCustomServing('');
      setShowCustomInput(false);
      setMode('multiplier');
    }
  }, [product]);

  if (!product) return null;

  // Presets for amount mode: same multipliers but as actual g/ml values
  const amountPresets = MULTIPLIER_PRESETS.map(
    m => Math.round(product.servingSize * m * 10) / 10
  );

  const fullPercent =
    product.totalSize != null &&
    product.totalSizeUnit != null &&
    product.totalSize !== product.servingSize
      ? Math.round((product.totalSize / product.servingSize) * 100)
      : null;

  const servingPercent = showCustomInput
    ? customServing !== ''
      ? mode === 'multiplier'
        ? (parseFloat(customServing) || 1) * 100
        : (parseFloat(customServing) / product.servingSize) * 100
      : selectedServing
    : selectedServing;

  const macros = calculateMacros(product, servingPercent);
  const actualServingSize = Math.round((product.servingSize * servingPercent / 100) * 10) / 10;

  const handleAdd = () => {
    const servingAmount = `${actualServingSize}${product.servingSizeUnit}`;
    const finalName = editableName.trim() || product.name || 'Unknown Product';
    onAdd(
      macros.calories,
      macros.protein,
      macros.carbs,
      macros.fat,
      finalName,
      product.barcode,
      servingAmount,
      product.imageUrl
    );
    onClose();
    setSelectedServing(100);
    setCustomServing('');
    setShowCustomInput(false);
    setEditableName('');
  };

  const handleServingSelect = (value: number) => {
    // value is a multiplier in 'multiplier' mode, or an actual g/ml amount in 'amount' mode
    const percentage = mode === 'multiplier'
      ? value * 100
      : (value / product.servingSize) * 100;
    setSelectedServing(percentage);
    setShowCustomInput(false);
    setCustomServing('');
  };

  const handleCustom = () => {
    setShowCustomInput(true);
    setCustomServing('');
  };

  const handleModeSwitch = (newMode: 'multiplier' | 'amount') => {
    setMode(newMode);
    setShowCustomInput(false);
    setCustomServing('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* Dark backdrop — tapping this closes the modal */}
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  Product Details
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={28} color={theme.text} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.scrollContent}
                contentContainerStyle={styles.scrollContentContainer}
                keyboardShouldPersistTaps="handled"
              >
                {/* Product Image */}
                {product.imageUrl && (
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                )}

                {/* Product Info */}
                <View style={styles.productInfo}>
                  <TextInput
                    style={[styles.productNameInput, { color: theme.text, borderColor: theme.border }]}
                    value={editableName}
                    onChangeText={setEditableName}
                    placeholder="Product name"
                    placeholderTextColor={theme.textSecondary}
                  />
                  {product.brand && (
                    <Text style={[styles.productBrand, { color: theme.textSecondary }]}>
                      {product.brand}
                    </Text>
                  )}
                  <Text style={[styles.servingSizeText, { color: theme.textSecondary }]}>
                    Standard serving: {product.servingSize}{product.servingSizeUnit}
                  </Text>
                </View>

                {/* Serving Size Selector */}
                <View style={styles.servingSection}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Select Serving Size
                  </Text>

                  {/* Mode Toggle */}
                  <View style={[styles.modeToggle, { backgroundColor: theme.surface }]}>
                    <TouchableOpacity
                      style={[styles.modeOption, mode === 'multiplier' && { backgroundColor: theme.primary }]}
                      onPress={() => handleModeSwitch('multiplier')}
                    >
                      <Text style={[styles.modeOptionText, { color: mode === 'multiplier' ? '#fff' : theme.text }]}>
                        × Multiplier
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modeOption, mode === 'amount' && { backgroundColor: theme.primary }]}
                      onPress={() => handleModeSwitch('amount')}
                    >
                      <Text style={[styles.modeOptionText, { color: mode === 'amount' ? '#fff' : theme.text }]}>
                        {product.servingSizeUnit} Amount
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.servingGrid}>
                    {fullPercent != null && (() => {
                      const isFullActive = !showCustomInput && selectedServing === fullPercent;
                      return (
                        <TouchableOpacity
                          key="full"
                          style={[
                            styles.servingButton,
                            {
                              backgroundColor: theme.surface,
                              borderColor: isFullActive ? theme.primary : theme.border,
                              borderWidth: isFullActive ? 2 : 1,
                            }
                          ]}
                          onPress={() => { setSelectedServing(fullPercent); setShowCustomInput(false); setCustomServing(''); }}
                        >
                          <Text style={[styles.servingButtonText, { color: isFullActive ? theme.primary : theme.text }]}>
                            Full
                          </Text>
                          <Text style={[styles.servingButtonSubtext, { color: theme.textSecondary }]}>
                            {product.totalSize}{product.totalSizeUnit}
                          </Text>
                        </TouchableOpacity>
                      );
                    })()}
                    {(mode === 'multiplier' ? MULTIPLIER_PRESETS : amountPresets).map((value) => {
                      const percentage = mode === 'multiplier'
                        ? value * 100
                        : (value / product.servingSize) * 100;
                      const isActive = !showCustomInput && Math.abs(selectedServing - percentage) < 0.01;
                      const actualAmount = Math.round((product.servingSize * percentage / 100) * 10) / 10;
                      return (
                        <TouchableOpacity
                          key={value}
                          style={[
                            styles.servingButton,
                            {
                              backgroundColor: theme.surface,
                              borderColor: isActive ? theme.primary : theme.border,
                              borderWidth: isActive ? 2 : 1,
                            }
                          ]}
                          onPress={() => handleServingSelect(value)}
                        >
                          <Text style={[styles.servingButtonText, { color: isActive ? theme.primary : theme.text }]}>
                            {mode === 'multiplier' ? `${value}×` : `${value}${product.servingSizeUnit}`}
                          </Text>
                          {mode === 'multiplier' && (
                            <Text style={[styles.servingButtonSubtext, { color: theme.textSecondary }]}>
                              {actualAmount}{product.servingSizeUnit}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Custom Input */}
                  <TouchableOpacity
                    style={[
                      styles.customButton,
                      { 
                        backgroundColor: theme.surface,
                        borderColor: showCustomInput ? theme.primary : theme.border,
                        borderWidth: showCustomInput ? 2 : 1,
                      }
                    ]}
                    onPress={handleCustom}
                  >
                    <Ionicons 
                      name="create-outline" 
                      size={20} 
                      color={showCustomInput ? theme.primary : theme.text} 
                    />
                    <Text style={[
                      styles.customButtonText,
                      { color: showCustomInput ? theme.primary : theme.text }
                    ]}>
                      Custom Amount
                    </Text>
                  </TouchableOpacity>

                  {showCustomInput && (
                    <View style={styles.customInputContainer}>
                      <TextInput
                        style={[
                          styles.customInput,
                          { 
                            backgroundColor: theme.surface,
                            color: theme.text,
                            borderColor: theme.border,
                          }
                        ]}
                        placeholder={
                          mode === 'multiplier'
                            ? `${selectedServing / 100}`
                            : `${actualServingSize}`
                        }
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="decimal-pad"
                        value={customServing}
                        onChangeText={setCustomServing}
                        autoFocus
                      />
                      <Text style={[styles.customInputLabel, { color: theme.textSecondary }]}>
                        {mode === 'multiplier' ? '× of serving' : product.servingSizeUnit}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Nutrition Info */}
                <View style={[styles.nutritionSection, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Nutrition ({actualServingSize}{product.servingSizeUnit})
                  </Text>
                  
                  <View style={styles.macroRow}>
                    <View style={styles.macroItem}>
                      <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>
                        Calories
                      </Text>
                      <Text style={[styles.macroValue, { color: theme.primary }]}>
                        {macros.calories}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.macroRow}>
                    <View style={styles.macroItem}>
                      <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>
                        Protein
                      </Text>
                      <Text style={[styles.macroValue, { color: '#FF3B3B' }]}>
                        {macros.protein}g
                      </Text>
                    </View>

                    <View style={styles.macroItem}>
                      <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>
                        Carbs
                      </Text>
                      <Text style={[styles.macroValue, { color: '#ffee03' }]}>
                        {macros.carbs}g
                      </Text>
                    </View>

                    <View style={styles.macroItem}>
                      <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>
                        Fat
                      </Text>
                      <Text style={[styles.macroValue, { color: '#c50fd6' }]}>
                        {macros.fat}g
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Add Button */}
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={handleAdd}
              >
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.addButtonText}>{addButtonLabel}</Text>
              </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContent: {
    maxHeight: '75%',
  },
  scrollContentContainer: {
    paddingBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  productInfo: {
    marginBottom: 24,
  },
  productNameInput: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    marginBottom: 8,
  },
  servingSizeText: {
    fontSize: 14,
  },
  servingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  modeOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  servingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  servingButton: {
    width: '31%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  servingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  servingButtonSubtext: {
    fontSize: 11,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  customInputContainer: {
    marginTop: 12,
  },
  customInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  customInputLabel: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  nutritionSection: {
    padding: 16,
    borderRadius: 12,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
