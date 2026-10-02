import { View, Text, Pressable } from 'react-native';

export default function OptionSelector({ options, value, onChange }) {
  return (
    <View className="flex-row">
      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => onChange(opt)}
          className={`mr-2 rounded-full px-4 py-2 ${value === opt ? 'bg-indigo-600' : 'bg-white'}`}
        >
          <Text className={value === opt ? 'font-medium text-white' : 'text-gray-700'}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}