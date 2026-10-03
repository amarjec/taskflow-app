import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PriorityBadge from './PriorityBadge';
import OverdueBadge from './OverdueBadge';
import { isOverdue } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';

export default function TaskCard({ task, onPress, onToggle, onDelete }) {
  const { colors } = useTheme();
  const done = task.status === 'Completed';
  const overdue = isOverdue(task);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <Pressable
        onPress={onToggle}
        hitSlop={10}
        className="mr-3"
        accessibilityLabel={done ? 'Mark as pending' : 'Mark as completed'}
      >
        <Ionicons name={done ? 'checkbox' : 'square-outline'} size={26} color={done ? colors.success : colors.muted} />
      </Pressable>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            done ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
          }`}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        <View className="mt-1 flex-row items-center">
          <Text className="mr-2 text-xs text-gray-500 dark:text-gray-400">{task.category}</Text>
          <PriorityBadge priority={task.priority} />
          {overdue && (
            <View className="ml-2">
              <OverdueBadge />
            </View>
          )}
        </View>

        <Text className={`mt-1 text-xs ${overdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          Start: {task.startDate}  •  Due: {task.dueDate}
        </Text>
      </View>

      {onDelete && (
        <Pressable onPress={onDelete} hitSlop={10} className="ml-2" accessibilityLabel="Delete task">
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </Pressable>
      )}
    </Pressable>
  );
}