import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import PriorityBadge from '../components/PriorityBadge';

// Small helper component used only in this file
function InfoRow({ label, children }) {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-xs uppercase text-gray-400">{label}</Text>
      {children}
    </View>
  );
}

export default function TaskDetailsScreen({ navigation, route }) {
  const { taskId } = route.params;
  const { tasks, toggleComplete, deleteTask } = useTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#9ca3af" />
        <Text className="mt-2 text-gray-500">Task not found.</Text>
      </View>
    );
  }

  const done = task.status === 'Completed';

  function handleDelete() {
    Alert.alert('Delete task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          navigation.goBack(); // leave first, so "Task not found" never flashes
          deleteTask(task.id);
        },
      },
    ]);
  }

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="p-4 pb-10">
      <View className="rounded-xl bg-white p-5 shadow-sm">
        <Text className="mb-1 text-xl font-bold text-gray-900">{task.title}</Text>
        <View
          className={`mb-5 self-start rounded-full px-3 py-1 ${done ? 'bg-green-100' : 'bg-amber-100'}`}
        >
          <Text className={`text-xs font-medium ${done ? 'text-green-700' : 'text-amber-700'}`}>
            {task.status}
          </Text>
        </View>

        <InfoRow label="Description">
          <Text className="text-gray-800">{task.description || 'No description'}</Text>
        </InfoRow>
        <InfoRow label="Category">
          <Text className="text-gray-800">{task.category}</Text>
        </InfoRow>
        <InfoRow label="Priority">
          <PriorityBadge priority={task.priority} />
        </InfoRow>
        <InfoRow label="Start date">
          <Text className="text-gray-800">{task.startDate}</Text>
        </InfoRow>
        <InfoRow label="Due date">
          <Text className="text-gray-800">{task.dueDate}</Text>
        </InfoRow>
      </View>

      {/* Actions */}
      <Pressable
        onPress={() => toggleComplete(task.id)}
        className={`mt-5 items-center rounded-xl py-4 ${done ? 'bg-gray-600' : 'bg-green-600'}`}
      >
        <Text className="font-semibold text-white">{done ? 'Mark as Pending' : 'Mark as Completed'}</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('AddEditTask', { taskId: task.id })}
        className="mt-3 items-center rounded-xl border border-indigo-600 bg-white py-4"
      >
        <Text className="font-semibold text-indigo-600">Edit Task</Text>
      </Pressable>

      <Pressable onPress={handleDelete} className="mt-3 items-center rounded-xl border border-red-500 bg-white py-4">
        <Text className="font-semibold text-red-500">Delete Task</Text>
      </Pressable>
    </ScrollView>
  );
}