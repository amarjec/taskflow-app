import { ScrollView, View, Text, Switch, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

// A titled group of rows, like the iOS/Android settings screens
function Section({ title, children }) {
  return (
    <View className="mb-6">
      <Text className="mb-2 px-1 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{title}</Text>
      <View className="overflow-hidden rounded-xl bg-white dark:bg-gray-800">{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const { tasks, clearAllTasks } = useTasks();
  const { isDark, setTheme } = useTheme();

  function confirmClear() {
    if (tasks.length === 0) {
      Alert.alert('Nothing to clear', 'You have no tasks.');
      return;
    }
    Alert.alert(
      'Clear all tasks',
      `This will permanently delete all ${tasks.length} tasks. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete all',
          style: 'destructive',
          onPress: () => {
            clearAllTasks();
            Alert.alert('Done', 'All tasks have been deleted.');
          },
        },
      ]
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900" contentContainerClassName="p-4">
      <Section title="Appearance">
        <View className="flex-row items-center p-4">
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color="#4f46e5" />
          <Text className="ml-3 flex-1 text-base text-gray-900 dark:text-gray-100">Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={(on) => setTheme(on ? 'dark' : 'light')}
            trackColor={{ false: '#d1d5db', true: '#818cf8' }}
            thumbColor={isDark ? '#4f46e5' : '#f9fafb'}
          />
        </View>
      </Section>

      <Section title="Data">
        <Pressable onPress={confirmClear} className="flex-row items-center p-4">
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
          <View className="ml-3 flex-1">
            <Text className="text-base text-red-500">Clear all tasks</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} stored on this device
            </Text>
          </View>
        </Pressable>
      </Section>

      <Section title="About">
        <View className="flex-row items-center justify-between p-4">
          <Text className="text-base text-gray-900 dark:text-gray-100">TaskFlow</Text>
          <Text className="text-gray-500 dark:text-gray-400">v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
        </View>
      </Section>
    </ScrollView>
  );
}