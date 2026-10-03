import { View, Text } from 'react-native';

export default function FormField({ label, error, children }) {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      {children}
      {error ? <Text className="mt-1 text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}