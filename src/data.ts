import { Quantity } from "./quantity";
import { IngredientList, Name, Recipe } from "./recipe";

const SERVINGS_1: Quantity = { unit: 'servings', number: 1 };
const SERVINGS_2: Quantity = { unit: 'servings', number: 2 };
const SPRINKLE: Quantity = { unit: 'sprinkle' }
const RECIPES: Recipe[] = [
  {
    name: 'Chicken Fricasee',
    servings: 2,
    ingredients: {
      'chicken-thigh': { unit: 'servings', number: 4 },
      'white-mushrooms': SERVINGS_1,
      'onion': { unit: 'servings', number: 0.5 },
      'butter': { unit: 'servings', number: 0.3 },
      'chicken-broth': SERVINGS_2,
      'white-cooking-wine': SERVINGS_2,
      'flour': SPRINKLE,
      'bay-leaf': SPRINKLE,
      'thyme': SPRINKLE,
      'salt': SPRINKLE,
      'black-pepper': SPRINKLE
    }
  }, {
    name: 'Chicken Alfredo',
    servings: 1,
    ingredients: {
      'chicken-breast': SERVINGS_1,
      'fettuccine': SERVINGS_1,
      'butter': { unit: 'servings', number: 0.2 },
      'cream': SERVINGS_1,
      'parmesan-cheese': SERVINGS_1
    }
  }, {
    name: 'Cajun Shrimp Fettucine',
    servings: 1,
    ingredients: {
      'shrimp': SERVINGS_1,
      'fettucine': SERVINGS_1,
      'butter': { unit: 'servings', number: 0.2 },
      'cream': SERVINGS_1,
      'cajun-spice': SPRINKLE,
      'flour': SPRINKLE,
      'salt': SPRINKLE
    }
  }, {
    name: 'Steak',
    servings: 1,
    ingredients: {
      'steak': SERVINGS_1,
      'butter': { unit: 'servings', number: 0.2 },
      'salt': SPRINKLE,
      'black-pepper': SPRINKLE,
      'thyme': SPRINKLE
    }
  }, {
    name: 'Grilled Brussels Sprouts',
    servings: 1,
    ingredients: {
      'brussels-sprouts': SERVINGS_1,
      'oil': SPRINKLE,
      'salt': SPRINKLE,
      'black-pepper': SPRINKLE
    },
    description: 'Cook!'
  }, {
    name: 'Grilled Green Beans',
    servings: 1,
    ingredients: {
      'green-beans': SERVINGS_1,
      'oil': SPRINKLE,
      'butter': SPRINKLE,
      'salt': SPRINKLE,
      'black-pepper': SPRINKLE
    }
  }, {
    name: 'Grilled Cheese with Tomato Soup',
    servings: 1,
    ingredients: {
      'white-bread': SERVINGS_2,
      'american-cheese': SERVINGS_2,
      'cheddar-cheese': SERVINGS_1,
      'butter': { unit: 'servings', number: 0.2 },
      'tomato-soup': SERVINGS_1
    }
  }, {
    name: 'Cooked Porkchop',
    servings: 1,
    ingredients: {
      'porkchop': SERVINGS_1,
      'butter': { unit: 'servings', number: 0.2 },
      'salt': SPRINKLE,
      'black-pepper': SPRINKLE,
      'thyme': SPRINKLE
    }
  }
];

export const GROCERY_CATALOGUE: GroceryProduct[] = [
  {
    name: '1-steak-package',
    ingredient: 'steak',
    quantity: { unit: 'servings', number: 1 }
  }
];

type RecipeEntry = {
  recipe: Recipe;
  active: boolean;
}

type GroceryProduct = {
  name: Name;
  ingredient: Name;
  quantity: Quantity;
}

export type GroceryListItem = {
  name: Name;
  count: number;
}

let store: any = null;

function getLocalStorageItem(key: string): any {
  return store[key];
}

function setLocalStorageItem(key: string, value: any): any {
  store[key] = value;
}

const LOCAL_RECIPES = '@recipes';
const LOCAL_GROCERY_CATALOGUE = '@grocery-catalogue';
const LOCAL_GROCERY_LIST = '@grocery-list';
const LOCAL_PANTRY = '@pantry';

class DataStore {
  constructor() {
    store = {};
    store[LOCAL_GROCERY_LIST] = [];
    store[LOCAL_GROCERY_CATALOGUE] = GROCERY_CATALOGUE;
    store[LOCAL_RECIPES] = RECIPES.map(recipe => ({ recipe: recipe, active: true }));
  }
  /**
   * getRecipes
 : Recipe[]  */
  public getRecipes(): RecipeEntry[] {
    return getLocalStorageItem(LOCAL_RECIPES) as RecipeEntry[];
    //return RECIPES.map(recipe => ({ recipe: recipe, active: true }));
  }

  public setRecipeActive(recipeName: string, active: boolean): void {
    console.log('set recipe ' + recipeName + ' active to ' + active);
  }

  public getGroceryCatalogue(): GroceryProduct[] {
    return getLocalStorageItem(LOCAL_GROCERY_CATALOGUE) as GroceryProduct[];
  }

  public createGroceryCatalogueItem(item: GroceryProduct): void {
    const groceryCatalogue = getLocalStorageItem(LOCAL_GROCERY_CATALOGUE) as GroceryProduct[];
    if (groceryCatalogue.find(product => product.name === item.name)) {
      throw new Error('product \'' + item.name + '\' already exists!');
    }
    groceryCatalogue.push(item);
    setLocalStorageItem(LOCAL_GROCERY_CATALOGUE, groceryCatalogue);
  }

  public deleteGroceryCatalogueItem(groceryItemName: Name): void {
    const groceryCatalogue = getLocalStorageItem(LOCAL_GROCERY_CATALOGUE) as GroceryProduct[];
    const newCatalogue = groceryCatalogue.filter(product => product.name !== groceryItemName);
    setLocalStorageItem(LOCAL_GROCERY_CATALOGUE, newCatalogue);
  }

  public getGroceryList(): GroceryListItem[] {
    return getLocalStorageItem(LOCAL_GROCERY_LIST) as GroceryListItem[];
  }

  public addToGroceryList(groceryItems: GroceryListItem[]): void {
    const groceryList = getLocalStorageItem(LOCAL_GROCERY_LIST) as GroceryListItem[];
    groceryItems.forEach(item => {
      const matchingItem = groceryList.find(existingItem => existingItem.name === item.name);
      if (matchingItem) {
        matchingItem.count += item.count;
      } else {
        groceryList.push(item);
      }
    });
    setLocalStorageItem(LOCAL_GROCERY_LIST, groceryList);
  }

  public removeFromGroceryList(groceryItems: GroceryListItem[]): void {
    let groceryList = getLocalStorageItem(LOCAL_GROCERY_LIST) as GroceryListItem[];
    groceryItems.forEach(item => {
      const matchingItem = groceryList.find(existingItem => existingItem.name === item.name);
      if (matchingItem) {
        matchingItem.count -= item.count;
        if (matchingItem.count <= 0) {
          groceryList = groceryList.filter(existingItem => existingItem.name !== item.name);
        }
      }
    });
    setLocalStorageItem(LOCAL_GROCERY_LIST, groceryList);
  }

  public getPantryItems(): IngredientList {
    return getLocalStorageItem(LOCAL_PANTRY) as IngredientList;
  }

  public addToPantry(ingredients: IngredientList) {
    const pantry = getLocalStorageItem(LOCAL_PANTRY) as IngredientList;
    Object.keys(ingredients).forEach(ingredientName => {
      if (!pantry[ingredientName]) {
        pantry[ingredientName] = ingredients[ingredientName];
      }
    })
  }

  public removeFromPantry(ingredients: IngredientList) {

  }
}

export const DATASTORE = new DataStore();

export default RECIPES;