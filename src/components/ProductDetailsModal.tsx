import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ScannedProduct } from '../types';
import { calculateMacros } from '../utils/foodApi';

interface ProductDetailsModalProps {
  visible: boolean;
  product: ScannedProduct | null;
  onClose: () => void;
  onAdd: (calories: number, protein: number, carbs: number, fat: number, name: string, barcode: string) => void;
}

const SERVING_PRESETS = [25, 50, 75, 100, 150, 200];

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  visible,
  product,
  onClose,
  onAdd,
}) => {
  const { theme } = useTheme();
  const [selectedServing, setSelectedServing] = useState(100);
  const [customServing, setCustomServing] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!product) return null;

  const servingPercent = showCustomInput && customServing 
    ? parseFloat(customServing) || 100 
    : selectedServing;

  const macros = calculateMacros(product, servingPercent);
  const actualServingSize = Math.round((product.servingSize * servingPercent / 100) * 10) / 10;

  const handleAdd = () => {
    onAdd(
      macros.calories,
      macros.protein,
      macros.carbs,
      macros.fat,
      product.name,
      product.barcode
    );
    onClose();
    // Reset state
    setSelectedServing(100);
    setCustomServing('');
    setShowCustomInput(false);
  };

  const handleServingSelect = (percent: number) => {
    setSelectedServing(percent);
    setShowCustomInput(false);
    setCustomServing('');
  };

  const handleCustom = () => {
    setShowCustomInput(true);
    setCustomServing(selectedServing.toString());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
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
                  <Text style={[styles.productName, { color: theme.text }]}>
                    {product.name}
                  </Text>
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
                  
                  <View style={styles.servingGrid}>
                    {SERVING_PRESETS.map((percent) => (
                      <TouchableOpacity
                        key={percent}
                        style={[
                          styles.servingButton,
                          { 
                            backgroundColor: theme.surface,
                            borderColor: !showCustomInput && selectedServing === percent ? theme.primary : theme.border,
                            borderWidth: !showCustomInput && selectedServing === percent ? 2 : 1,
                          }
                        ]}
                        onPress={() => handleServingSelect(percent)}
                      >
                        <Text style={[
                          styles.servingButtonText,
                          { color: !showCustomInput && selectedServing === percent ? theme.primary : theme.text }
                        ]}>
                          {percent}%
                        </Text>
                        <Text style={[styles.servingButtonSubtext, { color: theme.textSecondary }]}>
                          {Math.round((product.servingSize * percent / 100) * 10) / 10}{product.servingSizeUnit}
                        </Text>
                      </TouchableOpacity>
                    ))}
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
                        placeholder="Enter percentage (e.g., 75)"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="decimal-pad"
                        value={customServing}
                        onChangeText={setCustomServing}
                        autoFocus
                      />
                      <Text style={[styles.customInputLabel, { color: theme.textSecondary }]}>
                        % of serving
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
                <Text style={styles.addButtonText}>Add to Diary</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
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
  productName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
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
