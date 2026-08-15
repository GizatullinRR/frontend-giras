export const CATALOG_SECTIONS = [
  {
    slug: 'workwear',
    title: 'Спецодежда',
    blurb: 'Куртки, брюки, комбинезоны, костюмы',
    ready: true,
  },
  {
    slug: 'shoes',
    title: 'Обувь',
    blurb: 'Ботинки, сапоги, галоши, стельки',
    ready: false,
  },
  {
    slug: 'gloves',
    title: 'Перчатки',
    blurb: 'Защитные, утеплённые, монтажные',
    ready: false,
  },
  {
    slug: 'ppe',
    title: 'СИЗ',
    blurb: 'Каски, очки, наушники, респираторы',
    ready: false,
  },
  {
    slug: 'other',
    title: 'Другое',
    blurb: 'Аксессуары, уход и расходники',
    ready: false,
  },
] as const;

export type CatalogSlug = (typeof CATALOG_SECTIONS)[number]['slug'];
