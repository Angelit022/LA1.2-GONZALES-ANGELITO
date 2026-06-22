import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type TaskFormProps = {
  task: string;
  setTask: (value: string) => void;
  onAdd: () => void;
};

export default function TaskForm({ task, setTask, onAdd }: TaskFormProps) {
  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder="Enter Task"
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={onAdd}
      >
        <MaterialIcons name="add" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#2E5BBA",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
