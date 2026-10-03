import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import PriorityBadge from '../components/PriorityBadge';
import OverdueBadge from '../components/OverdueBadge';
import { isOverdue } from '../utils/dateUtils';

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
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#9ca3af" />
        <Text className="mt-2 text-gray-500 dark:text-gray-400">Task not found.</Text>
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
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900" contentContainerClassName="p-4 pb-10">
      <View className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm">
        <Text className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">{task.title}</Text>
        <View
          className={`mb-5 self-start rounded-full px-3 py-1 ${done ? 'bg-green-100 dark:bg-green-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}
        >
          <Text className={`text-xs font-medium ${done ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
            {task.status}
          </Text>
          {isOverdue(task) && (
            <View className="ml-2">
              <OverdueBadge />
            </View>
          )}
        </View>

        <InfoRow label="Description">
          <Text className="text-gray-800 dark:text-gray-200">{task.description || 'No description'}</Text>
        </InfoRow>
        <InfoRow label="Category">
          <Text className="text-gray-800 dark:text-gray-200">{task.category}</Text>
        </InfoRow>
        <InfoRow label="Priority">
          <PriorityBadge priority={task.priority} />
        </InfoRow>
        <InfoRow label="Start date">
          <Text className="text-gray-800 dark:text-gray-200">{task.startDate}</Text>
        </InfoRow>
        <InfoRow label="Due date">
          <Text className="text-gray-800 dark:text-gray-200">{task.dueDate}</Text>
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
        className="mt-3 items-center rounded-xl border border-indigo-600 bg-white dark:bg-gray-800 py-4"
      >
        <Text className="font-semibold text-indigo-600">Edit Task</Text>
      </Pressable>

      <Pressable onPress={handleDelete} className="mt-3 items-center rounded-xl border border-red-500 bg-white dark:bg-gray-800 py-4">
        <Text className="font-semibold text-red-500">Delete Task</Text>
      </Pressable>
    </ScrollView>
  );
}