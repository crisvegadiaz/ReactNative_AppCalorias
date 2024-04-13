import { Text, View, StyleSheet } from "react-native";
import { Input } from "@rneui/themed";

function AddFoodInput({ children, value, setValue, exRegula }) {
  const handleTextChange = (text) => {
    if (exRegula.test(text)) {
      setValue(text);
    } else {
      setValue("");
    }
  };

  return (
    <View style={styles.formItem}>
      <View style={styles.inputContainer}>
        <Input value={value} onChangeText={handleTextChange} />
      </View>
      <View style={styles.legendContainer}>
        <Text style={styles.legend}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flex: 2,
  },
  legendContainer: {
    flex: 1,
  },
  legend: {
    fontWeight: "500",
  },
});

export default AddFoodInput;
