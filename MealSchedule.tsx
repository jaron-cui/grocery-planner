import { useEffect, useState } from "react";
import { View, Text, Modal } from "react-native"
import { DATASTORE } from "./src/data";
import { Name, Recipe } from "./src/recipe";
import TextButton from "./TextButton";

type StringDict<T> = {
  [key in string]: T;
}

const MealSchedule = () => {
  const [scheduledMeals, setScheduledMeals] = useState<string[]>(['Chicken Fricasee']);
  const [recipes, setRecipes] = useState<StringDict<Recipe>>({});

  useEffect(() => {
    const recipeMap: StringDict<Recipe> = {};
    DATASTORE.getRecipes().map(entry => entry.recipe).forEach(recipe => {console.log(recipe);recipeMap[recipe.name] = recipe});
    setRecipes(recipeMap);
    console.log('recipemap: ' + JSON.stringify(recipeMap))
  }, []);

  const nextMeal = () => {
    setScheduledMeals(scheduledMeals.slice(1));
    // TODO: update data...
  }

  const cookMeal = () => {
    nextMeal();
    // TODO: update pantry...
  }

  const Meals = () => (
    scheduledMeals.length === 0 ? <NoMeals/> : 
      <NextMeals
        meals={scheduledMeals.map(name => recipes[name])}
        skip={nextMeal}
        cook={cookMeal}
      />
  )

  return (
    <View>
      {recipes ? <Meals/> : <Text>Loading...</Text>}    
    </View>
  )
}

const NoMeals = () => (
  <Text>No meals!</Text>
);

interface NextMealsProps {
  meals: Recipe[];
  skip: () => void;
  cook: () => void;
}

const NextMeals = ({ meals, skip, cook }: NextMealsProps) => {
  const [cooking, setCooking] = useState<boolean>(false);
  console.log(meals[0])
  if (!meals[0]) {
    return <Text>Unknown meal: {JSON.stringify(meals[0])}</Text>
  }
  return (
    <View>
      <Text>{meals[0].name}</Text>
      <View>
        <TextButton onPress={skip}>Skip</TextButton>
        <TextButton onPress={() => setCooking(true)}>Cook</TextButton>
      </View>
      <CookMeal recipe={meals[0]} cook={cook} open={cooking} close={() => setCooking(false)}/>
    </View>
  );
}

interface CookMealProps {
  recipe: Recipe;
  cook: () => void;
  open: boolean;
  close: () => void;
}

const CookMeal = ({ recipe, cook, open, close }: CookMealProps) => (
  <Modal visible={open}>
    <Text>{recipe.name}</Text>
    <Text>Ingredients: {JSON.stringify(recipe.ingredients)}</Text>
    <Text>Description: {recipe.description}</Text>
    <View>
      <TextButton onPress={close}>Cancel</TextButton>
      <TextButton onPress={() => { cook(); close(); }}>Cooked</TextButton>
    </View>
  </Modal>
);

export default MealSchedule;