import { View, Text } from 'react-native';

export default function OverdueBadge() {
  return (
    <View className="self-start rounded-full bg-red-100 px-2 py-0.5 dark:bg-red-500/20">
      <Text className="text-xs font-medium text-red-700 dark:text-red-300">Overdue</Text>
    </View>
  );
}