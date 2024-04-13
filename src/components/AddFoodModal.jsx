import { Button, Icon } from "@rneui/themed";
import { Alert, Modal, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import useFoodStorage from "../hooks/useFoodStorage";
import AddFoodInput from "./AddFoodInput";

function AddFoodModal({ onClose, visible }) {
  const [calories, setCalories] = useState("");
  const [name, setName] = useState("");
  const [portion, setPortion] = useState("");
  const { onSaveFood } = useFoodStorage();

  useEffect(() => {
    setCalories("");
    setName("");
    setPortion("");
  }, [visible]);

  const handleAddPress = async () => {
    try {
      await onSaveFood({
        calories,
        name,
        portion,
      });
      onClose(true);
      Alert.alert("Comida guardada exitosamente");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={() => onClose()}
      transparent
      animationType="slide"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.closeContainer}>
            <Button
              icon={<Icon name="close" size={28} />}
              onPress={onClose}
              type="clear"
            />
          </View>
          <AddFoodInput
            value={calories}
            setValue={setCalories}
            exRegula={/^\d+$/}
          >
            KCAL
          </AddFoodInput>
          <AddFoodInput
            value={name}
            setValue={setName}
            exRegula={/^[a-zA-ZñÑ]+(([a-zA-Z ñÑ])?[a-zA-ZñÑ]*)*$/}
          >
            Nombre
          </AddFoodInput>
          <AddFoodInput
            value={portion}
            setValue={setPortion}
            exRegula={/^\d+$/}
          >
            Porción
          </AddFoodInput>
          <View style={styles.buttonContainer}>
            <Button
              title="Add"
              icon={<Icon name="add" color="#fff" />}
              color="#4ecb71"
              radius="lg"
              onPress={handleAddPress}
              disabled={
                calories.trim() === "" ||
                name.trim() === "" ||
                portion.trim() === ""
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeContainer: {
    alignItems: "flex-end",
  },
  buttonContainer: {
    alignItems: "flex-end",
  },
  containerError: {
    flex: 1,
  },
  textError: {
    color: "#FF524A",
  },
});

export default AddFoodModal;
