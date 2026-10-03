import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { isTodayTask, isOverdue } from '../utils/dateUtils';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';

export default function DashboardScreen({ navigation }) {
  const { tasks, loading, error, toggleComplete } = useTasks();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 ">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
        <Text className="text-center text-red-600">{error}</Text>
      </View>
    );
  }

  // Simple counts, derived from the tasks array (cheap, so no useMemo needed)
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = total - completed;
  const todayTasks = tasks.filter(isTodayTask);
  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <ScrollView contentContainerClassName="p-4 pb-28">
        {/* 2x2 grid: each card is w-1/2, the negative margin cancels the edge padding */}
        <View className="-mx-1.5 flex-row flex-wrap">
          <StatCard title="Total tasks" value={total} icon="list" color="#4f46e5" bg="bg-indigo-100 dark:bg-indigo-900" />
          <StatCard title="Completed" value={completed} icon="checkmark-circle" color="#16a34a" bg="bg-green-100 dark:bg-green-900" />
          <StatCard title="Pending" value={pending} icon="time" color="#d97706" bg="bg-amber-100 dark:bg-amber-900" />
          <StatCard title="Today's tasks" value={todayTasks.length} icon="today" color="#0284c7" bg="bg-sky-100 dark:bg-sky-900" />
        </View>
        {overdueCount > 0 && (
          <Pressable
            onPress={() => navigation.navigate('TaskList', { filter: 'Overdue' })}
            className="mt-3 flex-row items-center rounded-xl bg-red-100 p-3 dark:bg-red-900">
              <Ionicons name="alert-circle" size={22} color="#dc2626" />
              <Text className="ml-2 flex-1 text-red-700 dark:text-red-200">
                {overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#dc2626" />
          </Pressable>)}

        {/* Bulk upload entry */}
        <Pressable
          onPress={() => navigation.navigate('BulkUpload')}
          className="mt-4 flex-row items-center rounded-xl bg-indigo-600 p-4"
        >
          <Ionicons name="cloud-upload-outline" size={26} color="white" />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-white">Bulk Upload</Text>
            <Text className="text-xs text-indigo-100">Import tasks from a CSV file</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>

        {/* Today's tasks preview */}
        <View className="mb-2 mt-6 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900">Today's tasks</Text>
          <Pressable onPress={() => navigation.navigate('TaskList')}>
            <Text className="font-medium text-indigo-600">View all</Text>
          </Pressable>
        </View>

        {todayTasks.length === 0 ? (
          <View className="items-center rounded-xl bg-white p-6">
            <Ionicons name="happy-outline" size={32} color="#9ca3af" />
            <Text className="mt-2 text-center text-gray-500">
              {total === 0 ? 'No tasks yet. Tap + to add your first task.' : 'Nothing scheduled for today.'}
            </Text>
          </View>
        ) : (
          todayTasks.slice(0, 3).map((task) => (
            <View key={task.id} className="mb-3">
            <TaskCard
              task={task}
              onPress={() => navigation.navigate('TaskDetails', { taskId: task.id })}
              onToggle={() => toggleComplete(task.id)}
            />
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating add button */}
      <Pressable
        onPress={() => navigation.navigate('AddEditTask')}
        className="absolute bottom-16 right-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
    </View>
  );
}