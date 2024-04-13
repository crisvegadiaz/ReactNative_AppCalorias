import AsyncStorage from "@react-native-async-storage/async-storage";
import { isToday } from "date-fns";

const MY_FOOD_KEY = "@MyFood:Key";
const MY_TODAY_FOOD_KEY = "@MyTodayFood:Key";

function useFoodStorage() {
  const saveInfoToStorage = async (storageKey, meal) => {
    try {
      const currentSavedFood = await AsyncStorage.getItem(storageKey);

      if (currentSavedFood !== null) {
        const currentSavedFoodParsed = JSON.parse(currentSavedFood);
        currentSavedFoodParsed.push(meal);

        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(currentSavedFoodParsed)
        );

        return Promise.resolve();
      }
      await AsyncStorage.setItem(storageKey, JSON.stringify([meal]));

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getInfoToStorage = async (storageKey) => {
    try {
      const foods = await AsyncStorage.getItem(storageKey);

      if (foods !== null) {
        const parsedFoods = JSON.parse(foods);

        return storageKey === MY_FOOD_KEY
          ? Promise.resolve(parsedFoods)
          : Promise.resolve(
              parsedFoods.filter((meal) => meal.date && isToday(meal.date))
            );
      } else {
        return Promise.resolve([]);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleSaveFood = async ({ calories, name, portion }) => {
    try {
      const result = await saveInfoToStorage(MY_FOOD_KEY, {
        calories,
        name,
        portion,
      });

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleGetFoods = async () => {
    return getInfoToStorage(MY_FOOD_KEY);
  };

  const handleSaveTodayFood = async ({ calories, name, portion }) => {
    try {
      const result = await saveInfoToStorage(MY_TODAY_FOOD_KEY, {
        calories,
        name,
        portion,
        date: new Date().toISOString(),
      });

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleGetTodayFood = async () => {
    return getInfoToStorage(MY_TODAY_FOOD_KEY);
  };

  const handleRemoveTodayFood = async (index) => {
    try {
      const todayFood = await handleGetTodayFood();
      const filteredItem = todayFood?.filter((_, itemIndex) => {
        return itemIndex !== index;
      });
      await AsyncStorage.setItem(
        MY_TODAY_FOOD_KEY,
        JSON.stringify(filteredItem)
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    onSaveFood: handleSaveFood,
    onGetFoods: handleGetFoods,
    onSaveTodayFood: handleSaveTodayFood,
    onGetTodayFood: handleGetTodayFood,
    onDeleteTodayFood: handleRemoveTodayFood,
  };
}

export default useFoodStorage;
