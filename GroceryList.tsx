import { IngredientList } from "./src/recipe";
import { FlatList, Text, View, Button, TouchableOpacity } from "react-native";
import { GroceryListItem } from "./src/data";
import React, { useState } from "react";
import { CheckBox } from "react-native-elements";
import TextButton from "./TextButton";

interface GroceryListProps {
  items: GroceryListItem[];
  addItem: (item: GroceryListItem) => void;
  removeItem: (item: number) => void;
}

const GroceryList = ({ items, addItem, removeItem }: GroceryListProps) => {
  const [allowSelection, setAllowSelection] = useState<boolean>(true);
  const [selected, setSelected] = useState<number[]>([]);

  removeItem = (index: number) => {
    setSelected(selected.map(
      (selectedIndex: number) => selectedIndex < index ? selectedIndex : selectedIndex - 1));
    removeItem(index);
  };

  const toggleAllowSelection = () => {
    if (allowSelection) {
      setSelected([]);
      setAllowSelection(false);
    } else {
      setAllowSelection(true);
    }
  }
  const isSelected = (index: number) => selected.includes(index);
  const toggleIndex = (index: number) => (
    () => {
      if (!allowSelection) {
        return;
      }
      if (isSelected(index)) {
        setSelected(selected.filter(i => i !== index));
      } else {
        setSelected([...selected, index]);
      }
    }
  );

  return (
    <View style={{justifyContent: 'flex-start', width:'500px'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextButton style={{width: '80px'}} title={allowSelection ? 'Cancel' : 'Select'} onPress={toggleAllowSelection}/>
      </View>
      <FlatList style={{minHeight: 400}} data={items} renderItem={
        info => (
          <GroceryListElement
            item={info.item}
            showSelection={allowSelection}
            selected={isSelected(info.index)}
            toggleSelection={toggleIndex(info.index)}
          />
        )
      }/>
    </View>
  );
}

interface GroceryListElementProps {
  item: GroceryListItem;
  showSelection: boolean;
  selected: boolean;
  toggleSelection: () => void;
}

const GroceryListElement = ({ item, showSelection, selected, toggleSelection }: GroceryListElementProps) => {
  return (
    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', height: '40px'}} onPress={toggleSelection}>
      <Text>{item.name}</Text>
      {showSelection && <CheckBox checked={selected}/>}
    </TouchableOpacity>
  )
}

export default GroceryList;