import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type TaskItemProps = {
  item: Task;
  onToggle: (item: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ item, onToggle, onDelete }: TaskItemProps) {
  return (
    <TouchableOpacity
      style={styles.taskRowTouchable}
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
    >
      <View style={styles.taskRow}>
        <MaterialIcons
          style={styles.taskIcon}
          name={item.completed ? "check-box" : "check-box-outline-blank"}
          size={20}
          color={item.completed ? "#2E5BBA" : "#5A6472"}
        />
        <Text style={styles.taskText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskRowTouchable: {
    flex: 1,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskIcon: {
    marginRight: 10,
  },
  taskText: {
    fontSize: 15,
  },
});
