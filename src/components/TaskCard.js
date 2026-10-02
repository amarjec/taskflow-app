import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIORITY_STYLES = {
  High: { bg: 'bg-red-100', text: 'text-red-700' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Low: { bg: 'bg-green-100', text: 'text-green-700' },
};

export default function TaskCard({ task, onPress, onToggle, onDelete }) {
  const done = task.status === 'Completed';
  const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Low;

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-xl bg-white p-4 shadow-sm"
    >
      {/* Checkbox */}
      <Pressable onPress={onToggle} hitSlop={10} className="mr-3">
        <Ionicons
          name={done ? 'checkbox' : 'square-outline'}
          size={26}
          color={done ? '#16a34a' : '#9ca3af'}
        />
      </Pressable>

      {/* Task info */}
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        <View className="mt-1 flex-row items-center">
          <Text className="mr-2 text-xs text-gray-500">{task.category}</Text>
          <View className={`rounded-full px-2 py-0.5 ${p.bg}`}>
            <Text className={`text-xs font-medium ${p.text}`}>{task.priority}</Text>
          </View>
        </View>

        <Text className="mt-1 text-xs text-gray-500">
          Start: {task.startDate}  •  Due: {task.dueDate}
        </Text>
      </View>

      {/* Delete */}
      <Pressable onPress={onDelete} hitSlop={10} className="ml-2">
        <Ionicons name="trash-outline" size={22} color="#ef4444" />
      </Pressable>
    </Pressable>
  );
}