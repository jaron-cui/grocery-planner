export type Quantity = {
  unit: 'servings';
  number: number;
} | {
  unit: 'sprinkle';
} | {
  unit: 'unlimited';
}

export function compareQuantity(quantity1: Quantity, quantity2: Quantity): number {
  if ((quantity1.unit == 'unlimited' && quantity2.unit != 'unlimited') 
  || (quantity1.unit != 'sprinkle' && quantity2.unit == 'sprinkle')) {
    return 1;
  }
  if (quantity1.unit != 'unlimited' && quantity2.unit == 'unlimited'
  || (quantity1.unit == 'sprinkle' && quantity2.unit != 'sprinkle')) {
    return -1;
  }
  if (quantity1.unit == 'servings' && quantity2.unit == 'servings') {
    return quantity1.number - quantity2.number;
  }
  if (quantity1.unit == quantity2.unit) {
    return 0;
  }
}

export function subtractQuantity(quantity1: Quantity, quantity2: Quantity): Quantity {
  if (quantity2.unit == 'unlimited') {
    throw new Error('cannot subtract unlimited quantity');
  }
  if (quantity2.unit == 'sprinkle' || quantity1.unit == 'unlimited') {
    return quantity1;
  }
  if (quantity1.unit == 'servings') {
    if (quantity2.number > quantity1.number) {
      throw new Error('cannot subtract a larger quantity from a smaller quantity');
    }
    return { unit: 'servings', number: quantity1.number - quantity2.number };
  }
  if (quantity1.unit == 'sprinkle') {
    throw new Error('cannot subtract from a sprinkle quantity');
  }
}