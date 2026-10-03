import { View, Text } from 'react-native';

const STYLES = {
  High: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300' },
  Medium: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-300' },
  Low: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300' },
};

export default function PriorityBadge({ priority }) {
  const s = STYLES[priority] || STYLES.Low;
  return (
    <View className={`self-start rounded-full px-2 py-0.5 ${s.bg}`}>
      <Text className={`text-xs font-medium ${s.text}`}>{priority}</Text>
    </View>
  );
}