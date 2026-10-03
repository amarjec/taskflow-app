import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Complete class names only (Tailwind can't see names built from pieces)
const TONES = {
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-500/20', light: '#4f46e5', dark: '#a5b4fc' },
  green: { bg: 'bg-green-100 dark:bg-green-500/20', light: '#16a34a', dark: '#86efac' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-500/20', light: '#d97706', dark: '#fcd34d' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-500/20', light: '#0284c7', dark: '#7dd3fc' },
};

export default function StatCard({ title, value, icon, tone = 'indigo' }) {
  const { isDark } = useTheme();
  const t = TONES[tone];

  return (
    <View className="w-1/2 p-1.5">
      <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <View className={`h-10 w-10 items-center justify-center rounded-full ${t.bg}`}>
          <Ionicons name={icon} size={22} color={isDark ? t.dark : t.light} />
        </View>
        <Text className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">{title}</Text>
      </View>
    </View>
  );
}