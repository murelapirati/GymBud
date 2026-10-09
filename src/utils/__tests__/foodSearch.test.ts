import { searchFoods } from '../foodSearch';
import { searchFoodByText } from '../foodApi';
import { storage, STORAGE_KEYS } from '../storage';

jest.mock('../foodApi', () => ({
  searchFoodByText: jest.fn(),
}));

describe('food search aggregator', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await storage.removeItem(STORAGE_KEYS.RECENT_FOODS);
    await storage.removeItem(STORAGE_KEYS.USER_FOODS);
    (searchFoodByText as jest.Mock).mockResolvedValue([]);
  });

  it('finds Romanian shaorma aliases from the bundled catalog offline', async () => {
    const results = await searchFoods('șaorma');

    expect(results.some(result => result.name === 'Shaorma cu pui')).toBe(true);
    expect(results.find(result => result.name === 'Shaorma cu pui')?.source).toBe('bundled_catalog');
    expect(results.find(result => result.name === 'Shaorma cu pui')?.confidence).toBe('estimated');
  });

  it('prioritizes saved user foods and deduplicates equivalent results', async () => {
    await storage.setItem(STORAGE_KEYS.USER_FOODS, [{
      barcode: 'manual:my-shaorma',
      name: 'My Shaorma',
      servingSize: 400,
      servingSizeUnit: 'g',
      source: 'user_food',
      confidence: 'estimated',
      nutriments: { energyKcal: 200, proteins: 10, carbohydrates: 20, fat: 8 },
    }]);
    (searchFoodByText as jest.Mock).mockResolvedValue([{
      barcode: 'remote-1',
      name: 'My Shaorma',
      servingSize: 400,
      servingSizeUnit: 'g',
      nutriments: { energyKcal: 200, proteins: 10, carbohydrates: 20, fat: 8 },
    }]);

    const results = await searchFoods('shaorma');
    expect(results[0].source).toBe('user_food');
    expect(results.filter(result => result.name === 'My Shaorma')).toHaveLength(1);
  });
});
