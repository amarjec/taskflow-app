import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatCard({ title, value, icon, color, bg }) {
  return (
    <View className="w-1/2 p-1.5">
      <View className="rounded-xl bg-white p-4 shadow-sm">
        <View className={`h-10 w-10 items-center justify-center rounded-full ${bg}`}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text className="mt-3 text-3xl font-bold text-gray-900">{value}</Text>
        <Text className="text-sm text-gray-500">{title}</Text>
      </View>
    </View>
  );
}