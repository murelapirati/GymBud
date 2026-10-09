import { ScannedProduct } from '../types';

const local = (
  id: string,
  name: string,
  aliases: string[],
  servingSize: number,
  calories: number,
  proteins: number,
  carbohydrates: number,
  fat: number,
  portionDescription: string,
): ScannedProduct => ({
  barcode: `local:${id}`,
  name,
  aliases,
  servingSize,
  servingSizeUnit: 'g',
  portionDescription,
  source: 'bundled_catalog',
  confidence: 'estimated',
  nutriments: {
    energyKcal: calories,
    proteins,
    carbohydrates,
    fat,
  },
});

export const LOCAL_FOODS: ScannedProduct[] = [
  local('shaorma-chicken', 'Shaorma cu pui', ['shaorma', 'șaorma', 'shawarma', 'chicken shawarma', 'kebab'], 400, 210, 12, 19, 9, '1 shaorma, approximately 400g'),
  local('shaorma-beef', 'Shaorma cu vita', ['shaorma vita', 'șaorma vită', 'beef shawarma', 'doner'], 400, 235, 14, 18, 12, '1 shaorma, approximately 400g'),
  local('shaorma-small', 'Shaorma mica cu pui', ['shaorma mica', 'șaorma mică', 'small shawarma'], 300, 210, 12, 19, 9, '1 small shaorma, approximately 300g'),
  local('kebab-chicken', 'Kebab cu pui', ['kebab pui', 'chicken kebab', 'doner kebab'], 350, 220, 14, 20, 10, '1 kebab, approximately 350g'),
  local('mici', 'Mici cu paine', ['mici', 'mititei', 'romanian mici'], 250, 260, 14, 16, 16, '3-4 mici with bread, approximately 250g'),
  local('sarmale', 'Sarmale cu mamaliga', ['sarmale', 'sarmalute', 'stuffed cabbage'], 350, 145, 7, 10, 8, '1 portion, approximately 350g'),
  local('mamaliga', 'Mamaliga', ['mămăligă', 'polenta'], 200, 85, 2, 18, 0.5, '1 portion, approximately 200g'),
  local('pizza-slice', 'Pizza, felie', ['pizza slice', 'felie pizza'], 140, 250, 11, 28, 11, '1 slice, approximately 140g'),
  local('burger-fries', 'Burger cu cartofi', ['burger', 'hamburger', 'burger and fries'], 450, 220, 10, 24, 11, '1 meal, approximately 450g'),
  local('crispy-chicken-menu', 'Meniu crispy pui', ['crispy', 'crispy chicken', 'chicken menu'], 450, 235, 13, 22, 12, '1 menu, approximately 450g'),
];
