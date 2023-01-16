import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GroceryList from './GroceryList';
import RECIPES, { DATASTORE, GroceryListItem } from './src/data';

DATASTORE.addToGroceryList(DATASTORE.getGroceryCatalogue().map(product => ({ name: product.name, count: 1 })))
export default function App() {
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
      <GroceryList items={groceryItems} addItem={addGroceryItem} removeItem={removeGroceryItem}></GroceryList>
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
