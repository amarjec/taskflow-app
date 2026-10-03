import { View, Text, Pressable } from 'react-native';

export default function OptionSelector({ options, value, onChange }) {
  return (
    <View className="flex-row">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            className={`mr-2 rounded-full border px-4 py-2 ${
              selected
                ? 'border-indigo-600 bg-indigo-600'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <Text className={selected ? 'font-medium text-white' : 'text-gray-700 dark:text-gray-300'}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}