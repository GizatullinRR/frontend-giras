export type WorkwearCategory =
  | 'WORK'
  | 'SECURITY'
  | 'MEDICAL'
  | 'FOOD'
  | 'SERVICE'
  | 'KNITWEAR'
  | 'HIGH_VIS'
  | 'WATERPROOF'
  | 'PROTECTIVE';

export type WorkwearItemSet =
  | 'JACKET_PANTS'
  | 'JACKET_COMBAT_PANTS'
  | 'PANTS'
  | 'JACKET'
  | 'SEMI_OVERALL';

export type WorkwearSize =
  | 'SIZE_1'
  | 'SIZE_2'
  | 'SIZE_3'
  | 'SIZE_4'
  | 'SIZE_5'
  | 'SIZE_6'
  | 'SIZE_7'
  | 'SIZE_8'
  | 'SIZE_9'
  | 'SIZE_10'
  | 'SIZE_11'
  | 'SIZE_12'
  | 'SIZE_13'
  | 'SIZE_14'
  | 'SIZE_15'
  | 'SIZE_16'
  | 'SIZE_17'
  | 'SIZE_18';

export type WorkwearGender = 'MALE' | 'FEMALE' | 'UNISEX';

export type WorkwearSeason = 'WINTER' | 'SUMMER';

export interface Workwear {
  id: string;
  name: string;
  description: string | null;
  category: WorkwearCategory;
  sizes: WorkwearSize[];
  color: string;
  season: WorkwearSeason;
  gender: WorkwearGender;
  set: WorkwearItemSet;
  material: string;
  price: string | number;
  isCertified: boolean;
  article: string | null;
  imageKeys: string[];
  imageUrls: string[];
  ordinalNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkwearPayload {
  name: string;
  description?: string | null;
  category: WorkwearCategory;
  sizes: WorkwearSize[];
  color: string;
  season: WorkwearSeason;
  gender: WorkwearGender;
  set: WorkwearItemSet;
  material: string;
  price: number;
  isCertified?: boolean;
  article?: string | null;
}

export type UpdateWorkwearPayload = Partial<CreateWorkwearPayload>;
