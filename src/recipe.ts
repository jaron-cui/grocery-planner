import { Quantity } from "./quantity";

export type FoodCategory = 'vegetable' | 'meat' | 'spice' | 'processed' | 'dairy' | 'carb' | 'condiment' | 'fruit';

type MaybePerishable = {
  perishable: false;
} | {
  perishable: true;
  daysFresh: number;
  acquired: Date;
}

export type Name = string;

export type Ingredient = {
  name: Name;
  categories: FoodCategory[];
} & MaybePerishable;

export type IngredientList = {
  [key in Name]: Quantity;
}

export type Recipe = {
  name: Name;
  description?: string;
  ingredients: IngredientList;
  servings: number;
  recipe?: string;
}
