import { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
// import TaskCard from '../components/TaskCard';
import SwipeableTaskCard from '../components/SwipeableTaskCard';
import { isOverdue } from '../utils/dateUtils';

const FILTERS = ['All', 'Pending', 'Completed', 'Overdue'];

const SORTS = [
  { key: 'newest', label: 'Newest' },
  { key: 'due', label: 'Due date' },
  { key: 'priority', label: 'Priority' },
  { key: 'title', label: 'A-Z' },
];

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

// Returns a sorted COPY (sort() changes the array it is called on, so we copy first)
function sortTasks(list, sortKey) {
  const sorted = [...list];
  if (sortKey === 'due') {
    sorted.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  } else if (sortKey === 'priority') {
    // High first; tasks with the same priority go by due date
    sorted.sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.dueDate.localeCompare(b.dueDate)
    );
  } else if (sortKey === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  // 'newest' keeps the stored order (new tasks are added to the front)
  return sorted;
}

export default function TaskListScreen({ navigation, route }) {
  const { tasks, loading, error, toggleComplete, deleteTask } = useTasks();
  const [filter, setFilter] = useState(route.params?.filter ?? 'All');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('newest');

  // If the screen is already open and receives a new filter, apply it
  useEffect(() => {
    if (route.params?.filter) setFilter(route.params.filter);
  }, [route.params?.filter]);

  // Filter first, then sort. Recalculated only when one of the inputs changes.
  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = tasks.filter((t) => {
      const matchesFilter = filter === 'All' || (filter === 'Overdue' ? isOverdue(t) : t.status === filter);
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
    return sortTasks(filtered, sortKey);
  }, [tasks, filter, search, sortKey]);

  function confirmDelete(task) {
    Alert.alert('Delete task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <Text className="text-center text-red-600">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Search box */}
      <View className="mx-4 mt-4 flex-row items-center rounded-xl bg-white px-3 dark:bg-gray-800">
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
            className={`mr-2 rounded-full px-4 py-2 ${filter === f ? 'bg-indigo-600' : 'bg-white dark:bg-gray-800'}`}
          >
            <Text className={filter === f ? 'font-medium text-white' : 'text-gray-700 dark:text-gray-300'}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {/* Sort chips. grow-0 stops a horizontal ScrollView from stretching to fill the screen height */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3 grow-0"
        contentContainerClassName="items-center px-4"
      >
        <Text className="mr-2 text-xs text-gray-500 dark:text-gray-400">Sort by</Text>
        {SORTS.map((s) => (
          <Pressable
            key={s.key}
            onPress={() => setSortKey(s.key)}
            className={`mr-2 rounded-full px-3 py-1 ${
              sortKey === s.key ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <Text
              className={`text-xs ${
                sortKey === s.key
                  ? 'font-medium text-indigo-700 dark:text-indigo-200'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {s.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-24"
        renderItem={({ item }) => (
        <SwipeableTaskCard 
          task={item}
          onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
          onToggle={() => toggleComplete(item.id)}
          onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            <Ionicons name="clipboard-outline" size={48} color="#9ca3af" />
            <Text className="mt-2 text-gray-500 dark:text-gray-400">
              {tasks.length === 0 ? 'No tasks yet. Tap + to add one.' : 'No tasks match your search.'}
            </Text>
          </View>
        }
      />

      {/* Floating add button */}
      <Pressable
        onPress={() => navigation.navigate('AddEditTask')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
    </View>
  );
}