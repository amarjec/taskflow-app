import { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import { stringToDate, dateToString, formatDisplayDate } from '../utils/dateUtils';

// value / onChange use 'YYYY-MM-DD' strings, so the rest of the app is unchanged
export default function DatePickerField({ value, onChange, minimumDate, hasError }) {
  const { isDark } = useTheme();
  const [showIos, setShowIos] = useState(false);
  const date = stringToDate(value) || new Date();

  function handleChange(event, selected) {
    if (Platform.OS === 'ios') setShowIos(false);
    if (event.type === 'dismissed' || !selected) return; // user cancelled
    onChange(dateToString(selected));
  }

  function openPicker() {
    if (Platform.OS === 'android') {
      // Android shows a native calendar dialog
      DateTimePickerAndroid.open({ value: date, mode: 'date', minimumDate, onChange: handleChange });
    } else {
      setShowIos((open) => !open);
    }
  }

  return (
    <View>
      <Pressable
        onPress={openPicker}
        className={`flex-row items-center rounded-xl border bg-white px-3 py-3 dark:bg-gray-800 ${
          hasError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <Ionicons name="calendar-outline" size={20} color="#4f46e5" />
        <Text className="ml-2 flex-1 text-gray-900 dark:text-gray-100">{formatDisplayDate(value)}</Text>
        <Ionicons name="chevron-down" size={18} color="#9ca3af" />
      </Pressable>

      {showIos && (
        <DateTimePicker
          value={date}
          mode="date"
          display="inline"
          minimumDate={minimumDate}
          themeVariant={isDark ? 'dark' : 'light'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}