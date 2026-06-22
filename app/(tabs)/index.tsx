import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TaskForm from "../../components/TaskForm";
import TaskItem from "../../components/TaskItem";
import { supabase } from "../../lib/supabase";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
};

export default function HomeScreen() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  async function loadTasks() {
    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error loading tasks:", error.message);
      setLoadError(error.message);
      setTasks([]);
      setLoading(false);
      return;
    }

    setTasks((data ?? []) as Task[]);
    setLoading(false);
  }

  async function addTask() {
    if (task.trim() === "") return;

    const { error } = await supabase
      .from("tasks")
      .insert([{ title: task, completed: false }]);

    if (error) {
      console.log("Error adding task:", error.message);
      return;
    }

    setTask("");
    loadTasks();
  }

  function startEditing(item: Task) {
    setEditingTaskId(item.id);
    setEditingText(item.title);
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setEditingText("");
  }

  async function updateTask() {
    if (!editingTaskId) return;
    const trimmedTitle = editingText.trim();
    if (trimmedTitle === "") return;

    const { error } = await supabase
      .from("tasks")
      .update({ title: trimmedTitle })
      .eq("id", editingTaskId);

    if (error) {
      console.log("Error updating task:", error.message);
      return;
    }

    setEditingTaskId(null);
    setEditingText("");
    loadTasks();
  }

  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) {
      console.log("Error updating task:", error.message);
      return;
    }

    loadTasks();
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.log("Error deleting task:", error.message);
      return;
    }

    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      <TaskForm task={task} setTask={setTask} onAdd={addTask} />

      {editingTaskId ? (
        <View style={styles.editRow}>
          <TextInput
            style={styles.editInput}
            placeholder="Edit task title"
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={updateTask}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={cancelEditing}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.helperRow}>
        <Text style={styles.helperText}>
          Tap a task to toggle completion. Long press to delete.
        </Text>
      </View>

      {loading ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Loading tasks…</Text>
        </View>
      ) : loadError ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>Error: {loadError}</Text>
        </View>
      ) : tasks.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No tasks yet. Add one above.</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.taskRowWrapper}>
              <TaskItem
                item={item}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
              <TouchableOpacity
                style={styles.editAction}
                activeOpacity={0.7}
                onPress={() => startEditing(item)}
              >
                <MaterialIcons name="edit" size={18} color="#2563eb" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2A44",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  messageContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    color: "#475569",
  },
  errorText: {
    fontSize: 16,
    color: "#dc2626",
  },
  helperRow: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  helperText: {
    color: "#64748b",
    fontSize: 13,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    borderColor: "#94a3b8",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#475569",
    fontWeight: "600",
  },
  taskRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editAction: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});
