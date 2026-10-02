import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({ task, onPress, onToggle, onDelete }) {
  const done = task.status === 'Completed';

  return (
    <Pressable onPress={onPress} className="mb-3 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
      <Pressable onPress={onToggle} hitSlop={10} className="mr-3">
        <Ionicons name={done ? 'checkbox' : 'square-outline'} size={26} color={done ? '#16a34a' : '#9ca3af'} />
      </Pressable>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        <View className="mt-1 flex-row items-center">
          <Text className="mr-2 text-xs text-gray-500">{task.category}</Text>
          <PriorityBadge priority={task.priority} />
        </View>

        <Text className="mt-1 text-xs text-gray-500">
          Start: {task.startDate}  •  Due: {task.dueDate}
        </Text>
      </View>

      {onDelete && (
        <Pressable onPress={onDelete} hitSlop={10} className="ml-2">
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </Pressable>
      )}
    </Pressable>
  );
}