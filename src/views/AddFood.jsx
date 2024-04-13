import { Text, View, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import { Button, Icon, Input } from "@rneui/themed";
import AddFoodModal from "../components/AddFoodModal";
import { useEffect, useState } from "react";
import useFoodStorage from "../hooks/useFoodStorage";
import MealItem from "../components/MeadItem";

function AddFood() {
  const [visible, setIsVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [foods, setFoods] = useState([]);
  const { onGetFoods } = useFoodStorage();

  const loadFoods = async () => {
    try {
      const foodsResponse = await onGetFoods();
      setFoods(foodsResponse);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadFoods().catch(null);
  }, []);

  const handleModalClose = async (shouldUpdate) => {
    if (shouldUpdate) {
      loadFoods();
    }
    setIsVisible(false);
  };

  const handleSearchPress = async () => {
    try {
      const result = await onGetFoods();
      setFoods(
        result.filter((item) =>
          item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      );
    } catch (error) {
      console.error(error);
      setFoods([]);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.addFoodContainer}>
        <View style={styles.legendContainer}>
          <Text style={styles.addFoodLegend}>Add Food</Text>
        </View>
        <View style={styles.addFoodBtnContainer}>
          <Button
            icon={<Icon name="add-circle-outline" color="#fff" />}
            radius="lg"
            color="#4ecb71"
            onPress={() => setIsVisible(true)}
          />
        </View>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="apples, pie, soda..."
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        <View>
          <Button
            title="Search"
            color="#ade8f"
            titleStyle={styles.searchBtnTitle}
            radius="lg"
            onPress={handleSearchPress}
          />
        </View>
      </View>
      <ScrollView style={styles.content}>
        {foods.map((meal, index) => (
          <MealItem
            key={`add-foo-item-${meal.name}-${index}`}
            {...meal}
            isAbleToAdd
          />
        ))}
      </ScrollView>
      <AddFoodModal visible={visible} onClose={handleModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    flex: 1,
  },
  content: {},
  legendContainer: {
    flex: 1,
  },
  addFoodBtnContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  addFoodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  addFoodLegend: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
  },
  inputContainer: {
    flex: 1,
    marginLeft: 12,
  },
  searchBtnTitle: {
    color: "#000",
    fontSize: 14,
  },
});

export default AddFood;
