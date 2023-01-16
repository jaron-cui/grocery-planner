import { IngredientList } from "./src/recipe";
import { FlatList, Text, View, Button, TouchableOpacity, TextInput, Modal } from "react-native";
import { DATASTORE, GroceryListItem } from "./src/data";
import React, { useEffect, useState } from "react";
import { CheckBox, Icon } from "react-native-elements";
import TextButton from "./TextButton";

interface GroceryListProps {
  items: GroceryListItem[];
  addItem: (item: GroceryListItem) => void;
  removeItem: (item: number) => void;
}

const GroceryList = ({ items, addItem, removeItem }: GroceryListProps) => {
  const [allowEditing, setAllowEditing] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  return (
    <View style={{justifyContent: 'flex-start', width:'500px'}}>
      {/*<View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextButton style={{width: '80px'}} title={allowEditing ? 'Cancel' : 'Edit'} onPress={() => setAllowEditing(!allowEditing)}/>
  </View>*/}
      <FlatList style={{minHeight: 100}} data={items} renderItem={
        info => (
          <GroceryListElement
            item={info.item}
            editing={allowEditing}
            deleteItem={() => removeItem(info.index)}
          />
        )
      }/>
      <TextButton onPress={() => setShowSearch(true)}>
        <Icon name='add'/>
      </TextButton>
      <GroceryItemSearch show={showSearch} onSelect={name => {
        addItem({ name: name, count: 1 });
        setShowSearch(false);
      }} />
    </View>
  );
}

interface GroceryListElementProps {
  item: GroceryListItem;
  editing: boolean;
  deleteItem: () => void;
}

const GroceryListElement = ({ item, editing, deleteItem }: GroceryListElementProps) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', height: '40px'}}>
      {editing && <Icon name='close' onPress={deleteItem}/>}
      <Text>{item.name} x {item.count}</Text>
    </View>
  )
}

interface GroceryItemSearchProps {
  show: boolean;
  onSelect: (name: string) => void;
}

const GroceryItemSearch = ({ show, onSelect }: GroceryItemSearchProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    setItems(DATASTORE.getGroceryCatalogue().map(product => product.name));
  }, []);

  const curatedItems = () => {
    return items.filter(name => name.includes(search)).sort((a, b) => a.indexOf(search) - b.indexOf(search));
  };

  return (
    <Modal visible={show}>
      <TextInput autoFocus={true} onChangeText={setSearch}/>
      <FlatList data={curatedItems()} renderItem={
        info => (
          <TextButton onPress={() => onSelect(info.item)}>{info.item}</TextButton>
        )
      }/>
    </Modal>
  );
}

export default GroceryList;