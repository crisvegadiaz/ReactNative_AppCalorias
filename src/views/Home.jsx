import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text, View, StyleSheet } from "react-native";
import { useCallback, useState } from "react";
import { Button, Icon } from "@rneui/themed";
import TodayCalories from "../components/TodayCalories";
import useFoodStorage from "../hooks/useFoodStorage";
import TodayMeals from "../components/TodayMeals";
import Header from "../components/Header";

const totalCaloriesPerDay = 2000;

function Home() {
  const [todayFood, setTodayFood] = useState();
  const [todayStatistics, setTodayStatistics] = useState({});
  const { onGetTodayFood } = useFoodStorage();
  const { navigate } = useNavigation();

  const calculateTodayStatistics = (meals) => {
    try {
      const caloriesConsumed = meals.reduce(
        (acum, curr) => acum + Number(curr.calories),
        0
      );
      const remainingCalories = totalCaloriesPerDay - caloriesConsumed;
      const percentage = (caloriesConsumed / totalCaloriesPerDay) * 100;

      setTodayStatistics({
        consumed: caloriesConsumed,
        percentage: percentage,
        remaining: remainingCalories,
        total: totalCaloriesPerDay,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loadTodayFood = useCallback(async () => {
    try {
      const todayFoodResponse = await onGetTodayFood();
      if (Array.isArray(todayFoodResponse)) {
        calculateTodayStatistics(todayFoodResponse);
        setTodayFood(todayFoodResponse);
      } else {
        console.error("onGetTodayFood did not return an array");
        setTodayFood([]);
      }
    } catch (error) {
      setTodayFood([]);
      console.error(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTodayFood().catch(null);
    }, [loadTodayFood])
  );

  const handleAddCaloriesPress = () => {
    navigate("AddFood");
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.caloriesContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.caloriesLegend}>Calories</Text>
        </View>
        <View style={styles.rightContainer}>
          <Button
            icon={<Icon name="add-circle-outline" color="#fff" />}
            radius="lg"
            color="#4ecb71"
            onPress={handleAddCaloriesPress}
          />
        </View>
      </View>
      <TodayCalories {...todayStatistics} />
      <TodayMeals
        foods={todayFood}
        onCompleteAddRemove={() => loadTodayFood()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    flex: 1,
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  caloriesLegend: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Home;
