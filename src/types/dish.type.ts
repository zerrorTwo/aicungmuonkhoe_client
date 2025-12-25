export interface DishBasic {
  ID: string;
  AGE_GROUP_ID: string;
  NAME: string;
  REGION_ID: string;
  COOKING_METHOD_ID: string;
  COOKING_METHOD_NAME?: string;
  MEAL_STRUCTURE_ID: string;
  SMALL_IMAGE: string;
  LARGE_IMAGE: string;
  STATUS: number;
  COOKING_INSTRUCTION: string;
  TIPS: string;
  CREATED_AT: string;
}

export interface NutritionInfo {
  ENERGY: number;
  WATER: number;
  PROTEIN: number;
  ANIMAL_PROTEIN: number;
  VEGETABLE_PROTEIN: number;
  FAT: number;
  ANIMAL_FAT: number;
  VEGETABLE_FAT: number;
  STARCH_SUGAR: number;
  FIBER: number;
  MONO_UNSATURATED_FAT: number;
  POLY_UNSATURATED_FAT: number;
  TOTAL_UNSATURATED_FAT: number;
  CHOLESTEROL: number;
  SUGAR: number;
}

export interface IngredientDetail {
  ID: number;
  NAME: string;
  WEIGHT: number;
  PROCESSING_METHOD: string;
  IMAGE: string;
  IMAGE_COOKED: string;
}

export interface DishDetail extends DishBasic {
  COOKING_INSTRUCTION: string;
  TIPS: string;
  ADDITIONAL_INFO: string;
  TAGS: string[];
  INGREDIENTS: IngredientDetail[];
  NUTRITION: NutritionInfo;
}
