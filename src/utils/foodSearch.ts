import { LOCAL_FOODS } from '../data/localFoods';
import { ScannedProduct } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { searchFoodByText as searchOpenFoodFacts } from './foodApi';

export interface FoodSearchResult extends ScannedProduct {
  sourceLabel: string;
}

export interface FoodProvider {
  id: ScannedProduct['source'];
  search: (query: string) => Promise<ScannedProduct[]>;
}

const normalize = (value: string) =>
  value.toLocaleLowerCase('ro').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const matchesQuery = (food: ScannedProduct, query: string) => {
  const needle = normalize(query);
  return [food.name, ...(food.aliases || [])].some(value => normalize(value).includes(needle));
};

const sourceLabel = (source?: ScannedProduct['source']) => {
  switch (source) {
    case 'bundled_catalog': return 'GymBud catalog · estimated';
    case 'recent_food': return 'Recent food';
    case 'user_food': return 'My food';
    case 'usda': return 'USDA FoodData Central';
    default: return 'OpenFoodFacts';
  }
};

const withSource = (food: ScannedProduct, source: ScannedProduct['source']): FoodSearchResult => ({
  ...food,
  source,
  sourceLabel: sourceLabel(source),
});

const dedupe = (foods: FoodSearchResult[]) => {
  const seen = new Set<string>();
  return foods.filter(food => {
    const key = `${normalize(food.name)}|${Math.round(food.servingSize)}|${Math.round(food.nutriments.energyKcal)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const searchFoods = async (query: string): Promise<FoodSearchResult[]> => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const providers: FoodProvider[] = [
    {
      id: 'user_food',
      search: async () => {
        const [userFoods, recent] = await Promise.all([
          storage.getItem<ScannedProduct[]>(STORAGE_KEYS.USER_FOODS),
          storage.getItem<ScannedProduct[]>(STORAGE_KEYS.RECENT_FOODS),
        ]);
        return [...(userFoods || []), ...(recent || [])]
          .filter(food => matchesQuery(food, trimmed));
      },
    },
    {
      id: 'bundled_catalog',
      search: async () => LOCAL_FOODS.filter(food => matchesQuery(food, trimmed)),
    },
    {
      id: 'openfoodfacts',
      search: () => searchOpenFoodFacts(trimmed),
    },
  ];

  const results = await Promise.allSettled(providers.map(provider => provider.search(trimmed)));
  const foods = results.flatMap((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value.map(food => withSource(food, providers[index].id));
    }
    console.warn(`${providers[index].id} food provider unavailable.`, result.reason);
    return [];
  });

  return dedupe(foods).slice(0, 30);
};

export const getFoodSourceLabel = sourceLabel;
