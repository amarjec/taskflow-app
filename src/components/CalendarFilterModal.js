import { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateToString, getTodayString, stringToDate } from '../utils/dateUtils';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Returns a flat list for the month: null for empty cells, then 1..daysInMonth
function buildMonthGrid(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // day 0 of next month = last day of this one
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null); // pad the last week
  return cells;
}

// selectedDate: 'YYYY-MM-DD' or null.  markedDates: Set of 'YYYY-MM-DD' that have tasks.
export default function CalendarFilterModal({ selectedDate, markedDates, onSelect, onClose }) {
  // Open on the selected month, or on the current month
  const start = stringToDate(selectedDate) || new Date();
  const [view, setView] = useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const today = getTodayString();

  const year = view.getFullYear();
  const month = view.getMonth();
  const cells = buildMonthGrid(year, month);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  function changeMonth(delta) {
    setView(new Date(year, month + delta, 1)); // Date handles Dec -> Jan rollover for us
  }

  function pick(day) {
    onSelect(dateToString(new Date(year, month, day)));
    onClose();
  }

  return (
    <Modal transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      {/* Tapping the dark backdrop closes the calendar */}
      <Pressable className="flex-1 justify-center bg-black/50 px-5" onPress={onClose}>
        {/* This Pressable swallows taps so touching the card itself doesn't close it */}
        <Pressable className="rounded-2xl bg-white p-4 dark:bg-gray-800" onPress={() => {}}>
          {/* Month header */}
          <View className="mb-3 flex-row items-center justify-between">
            <Pressable onPress={() => changeMonth(-1)} hitSlop={10} accessibilityLabel="Previous month">
              <Ionicons name="chevron-back" size={24} color="#4f46e5" />
            </Pressable>
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {MONTH_NAMES[month]} {year}
            </Text>
            <Pressable onPress={() => changeMonth(1)} hitSlop={10} accessibilityLabel="Next month">
              <Ionicons name="chevron-forward" size={24} color="#4f46e5" />
            </Pressable>
          </View>

          {/* Weekday labels */}
          <View className="mb-1 flex-row">
            {WEEKDAYS.map((w) => (
              <Text key={w} className="flex-1 text-center text-xs text-gray-400">
                {w}
              </Text>
            ))}
          </View>

          {/* Day grid, one row per week */}
          {weeks.map((week, wi) => (
            <View key={wi} className="flex-row">
              {week.map((day, di) => {
                if (day === null) return <View key={di} className="h-11 flex-1" />;

                const dateStr = dateToString(new Date(year, month, day));
                const selected = dateStr === selectedDate;
                const isToday = dateStr === today;

                return (
                  <Pressable
                    key={di}
                    onPress={() => pick(day)}
                    className="h-11 flex-1 items-center justify-center"
                  >
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-full ${
                        selected ? 'bg-indigo-600' : isToday ? 'border border-indigo-400' : ''
                      }`}
                    >
                      <Text className={`text-sm ${selected ? 'font-semibold text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                        {day}
                      </Text>
                    </View>
                    {markedDates.has(dateStr) && (
                      <View className="absolute bottom-0 h-1 w-1 rounded-full bg-indigo-500" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}

          {/* Footer */}
          <View className="mt-3 flex-row items-center justify-between">
            <Pressable
              onPress={() => {
                onSelect(null);
                onClose();
              }}
              hitSlop={8}
            >
              <Text className="font-medium text-indigo-600 dark:text-indigo-300">Clear filter</Text>
            </Pressable>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text className="text-gray-500 dark:text-gray-400">Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}