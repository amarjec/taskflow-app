import { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTasks } from '../context/TaskContext';
import { validateTask } from '../utils/validators';
import { getTodayString, stringToDate } from '../utils/dateUtils';
import { PRIORITIES, STATUSES, SUGGESTED_CATEGORIES } from '../utils/constants';
import FormField from '../components/FormField';
import OptionSelector from '../components/OptionSelector';
import DatePickerField from '../components/DatePickerField';

export default function AddEditTaskScreen({ navigation, route }) {
  const taskId = route.params?.taskId; // undefined when adding
  const isEdit = Boolean(taskId);
  const { tasks, addTask, updateTask } = useTasks();
  const existing = tasks.find((t) => t.id === taskId);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const [form, setForm] = useState(() =>
    existing
      ? { ...existing }
      : {
          title: '',
          description: '',
          category: '',
          priority: 'Medium',
          startDate: getTodayString(),
          dueDate: getTodayString(),
          status: 'Pending',
        }
  );
  const [errors, setErrors] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Edit Task' : 'Add Task' });
  }, [navigation, isEdit]);

  // Track the keyboard so the footer only adds bottom spacing when the keyboard is closed
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    // Changing the start date can also fix a due-date error, so clear both
    setErrors((prev) => ({ ...prev, [name]: undefined, ...(name === 'startDate' ? { dueDate: undefined } : {}) }));
  }

  function handleSave() {
    const found = validateTask(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const cleaned = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
    };

    if (isEdit) updateTask(taskId, cleaned);
    else addTask(cleaned);
    navigation.goBack();
  }

  if (isEdit && !existing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <Text className="text-gray-500 dark:text-gray-400">Task not found.</Text>
      </View>
    );
  }

  const inputClass = (name) =>
    `rounded-xl border bg-white px-3 py-3 text-gray-900 dark:bg-gray-800 dark:text-gray-100 ${
      errors[name] ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
    }`;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100 dark:bg-gray-900"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-6" keyboardShouldPersistTaps="handled">
        <FormField label="Title *" error={errors.title}>
          <TextInput
            className={inputClass('title')}
            placeholder="e.g. Finish assignment"
            placeholderTextColor="#9ca3af"
            value={form.title}
            onChangeText={(v) => setField('title', v)}
          />
        </FormField>

        <FormField label="Description">
          <TextInput
            className={`${inputClass('description')} h-24`}
            placeholder="Optional details"
            placeholderTextColor="#9ca3af"
            value={form.description}
            onChangeText={(v) => setField('description', v)}
            multiline
            textAlignVertical="top"
          />
        </FormField>

        <FormField label="Priority">
          <OptionSelector options={PRIORITIES} value={form.priority} onChange={(v) => setField('priority', v)} />
        </FormField>

        <FormField label="Category *" error={errors.category}>
          <TextInput
            className={inputClass('category')}
            placeholder="Type or pick one below"
            placeholderTextColor="#9ca3af"
            value={form.category}
            onChangeText={(v) => setField('category', v)}
          />
          <View className="mt-2 flex-row flex-wrap">
            {SUGGESTED_CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setField('category', c)}
                className="mb-2 mr-2 rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-500/20"
              >
                <Text className="text-xs text-indigo-700 dark:text-indigo-300">{c}</Text>
              </Pressable>
            ))}
          </View>
        </FormField>

        <FormField label="Start date *" error={errors.startDate}>
          <DatePickerField
            value={form.startDate}
            onChange={(v) => setField('startDate', v)}
            hasError={Boolean(errors.startDate)}
          />
        </FormField>

        <FormField label="Due date *" error={errors.dueDate}>
          <DatePickerField
            value={form.dueDate}
            onChange={(v) => setField('dueDate', v)}
            minimumDate={stringToDate(form.startDate) || undefined}
            hasError={Boolean(errors.dueDate)}
          />
        </FormField>

        <FormField label="Status">
          <OptionSelector options={STATUSES} value={form.status} onChange={(v) => setField('status', v)} />
        </FormField>
      </ScrollView>

      {/* Pinned footer: it sits below the ScrollView, and KeyboardAvoidingView lifts it above the keyboard */}
      <View
        className="border-t border-gray-200 bg-white px-4 pt-3 dark:border-gray-700 dark:bg-gray-800"
        style={{ paddingBottom: keyboardOpen ? 12 : Math.max(insets.bottom, 12) }}
      >
        <Pressable onPress={handleSave} className="items-center rounded-xl bg-indigo-600 py-4">
          <Text className="text-base font-semibold text-white">{isEdit ? 'Update Task' : 'Save Task'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}