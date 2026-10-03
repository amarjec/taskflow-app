import { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';

const FILTERS = ['All', 'Pending', 'Completed'];

export default function TaskListScreen({ navigation }) {
  const { tasks, loading, error, toggleComplete, deleteTask } = useTasks();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Recalculate only when tasks, filter or search change
  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesFilter = filter === 'All' || t.status === filter;
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  function confirmDelete(task) {
    Alert.alert('Delete task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  }

  // ---- Loading and error states ----
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900">
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

  // ---- Main UI ----
  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Search box */}
      <View className="mx-4 mt-4 flex-row items-center rounded-xl bg-white px-3">
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          className="ml-2 flex-1 py-3 text-gray-900 dark:text-gray-100"
          placeholder="Search tasks..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter tabs */}
      <View className="mx-4 my-3 flex-row">
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`mr-2 rounded-full px-4 py-2 ${filter === f ? 'bg-indigo-600' : 'bg-white'}`}
          >
            <Text className={filter === f ? 'font-medium text-white' : 'text-gray-700'}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-24"
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
            onToggle={() => toggleComplete(item.id)}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            <Ionicons name="clipboard-outline" size={48} color="#9ca3af" />
            <Text className="mt-2 text-gray-500">
              {tasks.length === 0 ? 'No tasks yet. Tap + to add one.' : 'No tasks match your search.'}
            </Text>
          </View>
        }
      />

      {/* Floating add button */}
      <Pressable
        onPress={() => navigation.navigate('AddEditTask')}
        className="absolute bottom-16 right-8 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
      
    </View>
  );
}