import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GroceryList from './GroceryList';
import MealSchedule from './MealSchedule';
import RECIPES, { DATASTORE, GroceryListItem } from './src/data';

type Screen = 'grocery-list' | 'cook'

DATASTORE.addToGroceryList(DATASTORE.getGroceryCatalogue().map(product => ({ name: product.name, count: 1 })))
export default function App() {
  const [screen, setScreen] = useState<Screen>('cook');
  const [groceryItems, setGroceryItems] = useState<GroceryListItem[]>(DATASTORE.getGroceryList());
  
  function removeGroceryItem(index: number) {
    const copy = [...groceryItems];
    copy.splice(index, 1);
    setGroceryItems(copy);
  }

  function addGroceryItem(groceryItem: GroceryListItem) {
    setGroceryItems([...groceryItems, groceryItem]);
  }

  return (
    <View style={styles.container}>
      {screen === 'grocery-list' && <GroceryList items={groceryItems} addItem={addGroceryItem} removeItem={removeGroceryItem}></GroceryList>}
      {screen === 'cook' && <MealSchedule/>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
