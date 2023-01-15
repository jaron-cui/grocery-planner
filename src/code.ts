import { Quantity, compareQuantity, subtractQuantity } from "./quantity";
import RECIPES from "./data";
import { IngredientList, Recipe } from "./recipe";

//console.log(sortRecipesByPlannedIngredients(recipes, ['shrimp', 'fettucine', 'cajun-spice']).map(recipe => recipe.name));
console.log(planRecipes(RECIPES, {}, 7).map(recipe => recipe.name));

function planRecipes(recipes: Recipe[], stock: IngredientList, count: number): Recipe[] {
  const usingStock = sortRecipesByAvailableIngredients(recipes, stock);
  const firstRecipe = usingStock[biasedSelectLower(usingStock.length)];

  const ingredients = new Set<string>(Object.keys(stock).concat(Object.keys(firstRecipe.ingredients)));
  const selectedRecipes = [firstRecipe];
  for (let i = 1; i < count; i += 1) {
    const fromIngredients = sortRecipesByPlannedIngredients(recipes, ingredients);
    const nextRecipe = fromIngredients[biasedSelectLower(fromIngredients.length)];
    Object.keys(nextRecipe.ingredients).forEach(name => ingredients.add(name));
    selectedRecipes.push(nextRecipe);
  }
  return selectedRecipes;
}

function biasedSelectLower(max: number) {
  const outOf = max * (max + 1) / 2 - 1;
  const index = Math.floor(Math.random() * outOf)
  let selection = 1;
  while (index > selection * (selection + 1) / 2) {
    selection += 1;
  }
  return max - selection;
}

function sortRecipesByPlannedIngredients(recipes: Recipe[], ingredients: Set<string>): Recipe[] {
  // const ingredientMissing = (ingredient: string) => !ingredients.has(ingredient);
  // return recipes.slice().sort((recipe1, recipe2) => {
  //   console.log(Object.keys(recipe1.ingredients))
  //   const missingIngredients1: string[] = Object.keys(recipe1.ingredients).filter(ingredientMissing);
  //   const missingIngredients2: string[] = Object.keys(recipe2.ingredients).filter(ingredientMissing);
  //   // console.log('missing ' + missingIngredients1.length + ' ingredients from ' + recipe1.name);
  //   // console.log('from ' + Object.keys(recipe1.ingredients).length)
  //   return missingIngredients1.length - missingIngredients2.length;
  // })

  return sortRecipesByAvailableIngredients(recipes, mapFromSet(ingredients, name => ({ unit: 'unlimited' })))
}

function mapFromSet<V>(set: Set<string>, valueFromKey: (k: string) => V): any {
  const dict = {};
  set.forEach(k => dict[k] = valueFromKey(k));
  return dict;
}

function sortRecipesByAvailableIngredients(recipes: Recipe[], stock: IngredientList): Recipe[] {
  return recipes.slice().sort((recipe1, recipe2) => {
    const missingIngredients1 = getMissingIngredients(recipe1, stock);
    const missingIngredients2 = getMissingIngredients(recipe2, stock);
    return Object.keys(missingIngredients1).length - Object.keys(missingIngredients2).length;
  })
}

function getMissingIngredients(recipe: Recipe, stock: IngredientList): IngredientList {
  const missingIngredients = {};
  for (let ingredient in recipe.ingredients) {
    const available: Quantity | undefined = stock[ingredient];
    const required: Quantity = recipe.ingredients[ingredient];
    if (!available) {
      missingIngredients[ingredient] = required;
      continue;
    }
    if (compareQuantity(available, required) < 0) {
      missingIngredients[ingredient] = subtractQuantity(required, available);
    }
  }
  return missingIngredients;
}
