import {
  WorkwearCategory,
  WorkwearGender,
  WorkwearItemSet,
  WorkwearSeason,
  WorkwearSize,
} from './workwear.types';

export const WORKWEAR_CATEGORIES: { value: WorkwearCategory; label: string }[] = [
  { value: 'WORK', label: 'Рабочая' },
  { value: 'SECURITY', label: 'Охрана' },
  { value: 'MEDICAL', label: 'Медицина' },
  { value: 'FOOD', label: 'Пищевая' },
  { value: 'SERVICE', label: 'Сервис' },
  { value: 'KNITWEAR', label: 'Трикотаж' },
  { value: 'HIGH_VIS', label: 'Сигнальная' },
  { value: 'WATERPROOF', label: 'Влагозащитная' },
  { value: 'PROTECTIVE', label: 'Защитная' },
];

export const WORKWEAR_SETS: { value: WorkwearItemSet; label: string }[] = [
  { value: 'JACKET_PANTS', label: 'Куртка + брюки' },
  { value: 'JACKET_COMBAT_PANTS', label: 'Куртка + брюки боевые' },
  { value: 'PANTS', label: 'Брюки' },
  { value: 'JACKET', label: 'Куртка' },
  { value: 'SEMI_OVERALL', label: 'Полукомбинезон' },
];

export const WORKWEAR_SEASONS: { value: WorkwearSeason; label: string }[] = [
  { value: 'SUMMER', label: 'Лето' },
  { value: 'WINTER', label: 'Зима' },
];

export const WORKWEAR_GENDERS: { value: WorkwearGender; label: string }[] = [
  { value: 'UNISEX', label: 'Унисекс' },
  { value: 'MALE', label: 'Мужская' },
  { value: 'FEMALE', label: 'Женская' },
];

export const WORKWEAR_SIZE_HEIGHTS = ['158-164', '170-176', '182-188'] as const;

export const WORKWEAR_SIZE_ROWS: {
  chest: string;
  ru: string;
  sizes: [WorkwearSize, WorkwearSize, WorkwearSize];
}[] = [
  { chest: '88-92', ru: '44-46', sizes: ['SIZE_1', 'SIZE_2', 'SIZE_3'] },
  { chest: '96-100', ru: '48-50', sizes: ['SIZE_4', 'SIZE_5', 'SIZE_6'] },
  { chest: '104-108', ru: '52-54', sizes: ['SIZE_7', 'SIZE_8', 'SIZE_9'] },
  { chest: '112-116', ru: '56-58', sizes: ['SIZE_10', 'SIZE_11', 'SIZE_12'] },
  { chest: '120-124', ru: '60-62', sizes: ['SIZE_13', 'SIZE_14', 'SIZE_15'] },
  { chest: '128-132', ru: '64-66', sizes: ['SIZE_16', 'SIZE_17', 'SIZE_18'] },
];

export const WORKWEAR_SIZES: { value: WorkwearSize; label: string }[] =
  WORKWEAR_SIZE_ROWS.flatMap((row) =>
    row.sizes.map((value, index) => ({
      value,
      label: `${row.chest} (${row.ru}) / ${WORKWEAR_SIZE_HEIGHTS[index]}`,
    })),
  );

export function groupedSizes(values: WorkwearSize[]) {
  return WORKWEAR_SIZE_ROWS.flatMap((row) => {
    const heights = row.sizes.flatMap((size, index) =>
      values.includes(size) ? [WORKWEAR_SIZE_HEIGHTS[index]] : [],
    );

    return heights.length
      ? [{ chest: row.chest, ru: row.ru, heights }]
      : [];
  });
}

const categoryMap = Object.fromEntries(
  WORKWEAR_CATEGORIES.map((item) => [item.value, item.label]),
) as Record<WorkwearCategory, string>;

const setMap = Object.fromEntries(
  WORKWEAR_SETS.map((item) => [item.value, item.label]),
) as Record<WorkwearItemSet, string>;

const seasonMap = Object.fromEntries(
  WORKWEAR_SEASONS.map((item) => [item.value, item.label]),
) as Record<WorkwearSeason, string>;

const genderMap = Object.fromEntries(
  WORKWEAR_GENDERS.map((item) => [item.value, item.label]),
) as Record<WorkwearGender, string>;

const sizeMap = Object.fromEntries(
  WORKWEAR_SIZES.map((item) => [item.value, item.label]),
) as Record<WorkwearSize, string>;

export function categoryLabel(value: WorkwearCategory): string {
  return categoryMap[value];
}

export function setLabel(value: WorkwearItemSet): string {
  return setMap[value];
}

export function seasonLabel(value: WorkwearSeason): string {
  return seasonMap[value];
}

export function genderLabel(value: WorkwearGender): string {
  return genderMap[value];
}

export function sizeLabel(value: WorkwearSize): string {
  return sizeMap[value];
}

export function formatPrice(price: string | number): string {
  return Number(price).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
