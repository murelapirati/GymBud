import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ScannedProduct } from '../types';
import { searchFoodByText, fetchProductByBarcode } from '../utils/foodApi';
import { BarcodeScannerModal } from './BarcodeScannerModal';

interface IngredientPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProduct: (product: ScannedProduct) => void;
}

export const IngredientPickerModal: React.FC<IngredientPickerModalProps> = ({
  visible,
  onClose,
  onSelectProduct,
}) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ScannedProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!text.trim()) { setResults([]); setSearched(false); return; }
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      setSearched(true);
      const found = await searchFoodByText(text.trim());
      setResults(found);
      setIsSearching(false);
    }, 600);
  };

  const handleBarcodeScan = async (barcode: string) => {
    setIsScannerOpen(false);
    setIsScanLoading(true);
    const product = await fetchProductByBarcode(barcode);
    setIsScanLoading(false);
    if (product) {
      onSelectProduct(product);
      handleClose();
    }
  };

  const handleSelect = (product: ScannedProduct) => {
    onSelectProduct(product);
    handleClose();
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setIsSearching(false);
    onClose();
  };

  const renderResult = ({ item }: { item: ScannedProduct }) => (
    <TouchableOpacity
      style={[styles.resultItem, { borderBottomColor: theme.border }]}
      onPress={() => handleSelect(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.resultImage} resizeMode="contain" />
      ) : (
        <View style={[styles.resultImagePlaceholder, { backgroundColor: theme.surface }]}>
          <Ionicons name="nutrition-outline" size={24} color={theme.textSecondary} />
        </View>
      )}
      <View style={styles.resultInfo}>
        <Text style={[styles.resultName, { color: theme.text }]} numberOfLines={2}>
          {item.name || 'Unknown product'}
        </Text>
        {item.brand ? (
          <Text style={[styles.resultBrand, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.brand}
          </Text>
        ) : null}
        <Text style={[styles.resultMacros, { color: theme.textSecondary }]}>
          {Math.round(item.nutriments.energyKcal)} kcal · {item.nutriments.proteins}g P · {item.nutriments.carbohydrates}g C · {item.nutriments.fat}g F  <Text style={{ color: theme.textTertiary }}>per 100{item.servingSizeUnit}</Text>
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <>
      <Modal visible={visible && !isScannerOpen} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={handleClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>Add Ingredient</Text>
            <TouchableOpacity
              style={[styles.scanButton, { backgroundColor: theme.primary }]}
              onPress={() => setIsScannerOpen(true)}
              disabled={isScanLoading}
            >
              {isScanLoading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="barcode-outline" size={20} color="#fff" />}
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={[styles.searchRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={20} color={theme.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search food (e.g. egg, chicken breast…)"
              placeholderTextColor={theme.textSecondary}
              value={query}
              onChangeText={handleSearch}
              autoCorrect={false}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
                <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Results */}
          {isSearching ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>Searching…</Text>
            </View>
          ) : searched && results.length === 0 ? (
            <View style={styles.center}>
              <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>No results found</Text>
              <Text style={[styles.statusSubtext, { color: theme.textTertiary }]}>Try a different name or scan a barcode</Text>
            </View>
          ) : !searched ? (
            <View style={styles.center}>
              <Ionicons name="nutrition-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>Search for an ingredient</Text>
              <Text style={[styles.statusSubtext, { color: theme.textTertiary }]}>or tap the barcode button to scan</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item, index) => item.barcode || index.toString()}
              renderItem={renderResult}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.list}
            />
          )}
        </View>
      </Modal>

      <BarcodeScannerModal
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  scanButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 48,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  statusSubtext: {
    fontSize: 14,
  },
  list: {
    paddingBottom: 40,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  resultImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  resultImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
  },
  resultBrand: {
    fontSize: 13,
  },
  resultMacros: {
    fontSize: 12,
    marginTop: 2,
  },
});
