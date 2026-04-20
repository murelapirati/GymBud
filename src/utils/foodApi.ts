import axios from 'axios';
import { ScannedProduct } from '../types';

const OPENFOODFACTS_API = 'https://world.openfoodfacts.org/api/v0/product';
const OPENFOODFACTS_SEARCH_API = 'https://world.openfoodfacts.org/cgi/search.pl';

// Shared parser — works for both barcode lookup and search results
const parseProductData = (product: any, barcodeOverride?: string): ScannedProduct | null => {
  const nutriments = product.nutriments || {};
  const hasNutriments = Object.keys(nutriments).length > 0;
  const hasImage = !!(product.image_url || product.image_front_url);
  const hasName = !!(product.product_name || product.generic_name);

  if (!hasNutriments && !hasImage && !hasName) return null;

  let totalSize: number | undefined;
  let totalSizeUnit: string | undefined;
  if (product.quantity) {
    const qMatch = product.quantity.match(/^(\d+\.?\d*)\s*([a-zA-Z]+)/);
    if (qMatch) {
      totalSize = parseFloat(qMatch[1]);
      totalSizeUnit = qMatch[2];
    }
  }

  // Standard mass/volume units that correspond to real gram/ml quantities
  const STANDARD_UNITS = ['g', 'ml', 'oz', 'fl', 'mg', 'kg', 'l', 'lb'];
  const isStandardUnit = (unit: string) =>
    STANDARD_UNITS.some(u => unit.toLowerCase().startsWith(u));

  let servingSize = 100;
  let servingSizeUnit = 'g';
  if (product.serving_size) {
    const rawServing: string = product.serving_size;

    // First try parenthetical: "1 can (500 ml)" or "1 serving (28g)"
    const parenMatch = rawServing.match(/\((\d+\.?\d*)\s*([a-zA-Z]+)\)/);
    if (parenMatch && isStandardUnit(parenMatch[2])) {
      servingSize = parseFloat(parenMatch[1]);
      servingSizeUnit = parenMatch[2].toLowerCase();
    } else {
      // Plain parse: "330 ml", "28g", "1 can", etc.
      const match = rawServing.match(/(\d+\.?\d*)\s*([a-zA-Z]+)/);
      if (match) {
        const parsedSize = parseFloat(match[1]);
        const parsedUnit = match[2].trim().toLowerCase();
        if (isStandardUnit(parsedUnit)) {
          servingSize = parsedSize;
          servingSizeUnit = parsedUnit;
        } else {
          // Non-standard unit (e.g. "can", "bottle") — use totalSize or 100g
          if (totalSize != null && totalSizeUnit != null) {
            servingSize = totalSize;
            servingSizeUnit = totalSizeUnit;
          }
          // else stays at 100g default
        }
      }
    }
  } else if (totalSize != null && totalSizeUnit != null) {
    servingSize = totalSize;
    servingSizeUnit = totalSizeUnit;
  }


  return {
    barcode: barcodeOverride || product.code || product._id || '',
    name: product.product_name
      || product.product_name_en
      || product.abbreviated_product_name
      || product.generic_name
      || product.generic_name_en
      || product.product_name_fr
      || product.product_name_de
      || '',
    brand: product.brands || undefined,
    servingSize,
    servingSizeUnit,
    totalSize,
    totalSizeUnit,
    nutriments: {
      energyKcal: nutriments['energy-kcal_100g'] != null
        ? nutriments['energy-kcal_100g']
        : (nutriments.energy_100g != null ? Math.round(nutriments.energy_100g / 4.184) : 0),
      proteins: nutriments.proteins_100g || 0,
      carbohydrates: nutriments.carbohydrates_100g || 0,
      fat: nutriments.fat_100g || 0,
    },
    imageUrl: product.image_url || product.image_front_url || undefined,
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch product information from OpenFoodFacts API by barcode.
 * Retries up to MAX_RETRIES times with exponential backoff to handle
 * slow API responses that initially return status=0 before the data arrives.
 */
export const fetchProductByBarcode = async (barcode: string): Promise<ScannedProduct | null> => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1500;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(`${OPENFOODFACTS_API}/${barcode}.json`, {
        timeout: 10000, // 10s per attempt
      });

      if (response.data.status !== 0 && response.data.product) {
        return parseProductData(response.data.product, barcode);
      }

      // Product returned status=0 (not found on this attempt).
      // If we have retries left, wait and try again in case of a slow CDN.
      if (attempt < MAX_RETRIES) {
        console.log(`OpenFoodFacts returned status=0 for ${barcode}, retrying (${attempt}/${MAX_RETRIES - 1})…`);
        await delay(RETRY_DELAY_MS * attempt);
        continue;
      }

      // All retries exhausted — product genuinely not found
      return null;
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        console.warn(`fetchProductByBarcode attempt ${attempt} failed, retrying…`, error);
        await delay(RETRY_DELAY_MS * attempt);
        continue;
      }
      console.error('Error fetching product from OpenFoodFacts:', error);
      return null;
    }
  }

  return null;
};

/**
 * Search OpenFoodFacts by text query (for ingredients like "egg", "chicken breast", etc.)
 */
export const searchFoodByText = async (query: string): Promise<ScannedProduct[]> => {
  try {
    const response = await axios.get(OPENFOODFACTS_SEARCH_API, {
      params: {
        search_terms: query,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 20,
        fields: 'product_name,product_name_en,abbreviated_product_name,generic_name,nutriments,serving_size,image_url,image_front_url,brands,quantity,code',
      },
    });
    const products: any[] = response.data.products || [];
    return products
      .map(p => parseProductData(p))
      .filter((p): p is ScannedProduct => p !== null && p.name !== '');
  } catch (error) {
    console.error('Error searching OpenFoodFacts:', error);
    return [];
  }
};

/**
 * Calculate actual nutrient values based on serving percentage
 * @param product - The scanned product
 * @param servingPercent - Percentage of standard serving (e.g., 100 for full serving)
 * @returns Object with calculated macros
 */
export const calculateMacros = (product: ScannedProduct, servingPercent: number) => {
  const multiplier = (product.servingSize / 100) * (servingPercent / 100);
  
  return {
    calories: Math.round(product.nutriments.energyKcal * multiplier),
    protein: Math.round(product.nutriments.proteins * multiplier * 10) / 10,
    carbs: Math.round(product.nutriments.carbohydrates * multiplier * 10) / 10,
    fat: Math.round(product.nutriments.fat * multiplier * 10) / 10,
  };
};
