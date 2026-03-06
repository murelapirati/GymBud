import axios from 'axios';
import { ScannedProduct } from '../types';

const OPENFOODFACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

/**
 * Fetch product information from OpenFoodFacts API by barcode
 * @param barcode - The barcode string to look up
 * @returns ScannedProduct object or null if not found
 */
export const fetchProductByBarcode = async (barcode: string): Promise<ScannedProduct | null> => {
  try {
    const response = await axios.get(`${OPENFOODFACTS_API}/${barcode}.json`);
    
    if (response.data.status === 0 || !response.data.product) {
      return null; // Product not found
    }

    const product = response.data.product;
    const nutriments = product.nutriments || {};

    // Extract serving size (default to 100g if not specified)
    let servingSize = 100;
    let servingSizeUnit = 'g';
    
    if (product.serving_size) {
      // Parse serving size string like "30g" or "250ml"
      const match = product.serving_size.match(/(\d+\.?\d*)\s*([a-zA-Z]+)/);
      if (match) {
        servingSize = parseFloat(match[1]);
        servingSizeUnit = match[2];
      }
    }

    return {
      barcode,
      name: product.product_name || product.generic_name || 'Unknown Product',
      brand: product.brands || undefined,
      servingSize,
      servingSizeUnit,
      nutriments: {
        energyKcal: nutriments['energy-kcal_100g'] || nutriments.energy_100g / 4.184 || 0,
        proteins: nutriments.proteins_100g || 0,
        carbohydrates: nutriments.carbohydrates_100g || 0,
        fat: nutriments.fat_100g || 0,
      },
      imageUrl: product.image_url || product.image_front_url || undefined,
    };
  } catch (error) {
    console.error('Error fetching product from OpenFoodFacts:', error);
    return null;
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
