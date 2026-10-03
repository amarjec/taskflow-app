import { useState, useLayoutEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useTasks } from '../context/TaskContext';
import { validateTask } from '../utils/validators';
import { getTodayString } from '../utils/dateUtils';
import { PRIORITIES, STATUSES, SUGGESTED_CATEGORIES } from '../utils/constants';
import FormField from '../components/FormField';
import OptionSelector from '../components/OptionSelector';

export default function AddEditTaskScreen({ navigation, route }) {
  const taskId = route.params?.taskId; // undefined when adding
  const isEdit = Boolean(taskId);
  const { tasks, addTask, updateTask } = useTasks();
  const existing = tasks.find((t) => t.id === taskId);

  // The function form of useState runs only once, on the first render
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

  // Change the header title depending on the mode
  useLayoutEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Edit Task' : 'Add Task' });
  }, [navigation, isEdit]);

  // One function updates any field, and clears that field's error as the user types
  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSave() {
    const found = validateTask(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // stop if anything is invalid

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

  // Edit mode but the task doesn't exist (e.g. it was deleted)
  if (isEdit && !existing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
        <Text className="text-gray-500">Task not found.</Text>
      </View>
    );
  }

  const inputClass = (name) =>
    `rounded-xl border bg-white px-3 py-3 text-gray-900 dark:text-gray-100 ${errors[name] ? 'border-red-500' : 'border-gray-200'}`;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100 dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-10" keyboardShouldPersistTaps="handled">
        <FormField label="Title *" error={errors.title}>
          <TextInput
            className={inputClass('title')}
            placeholder="e.g. Prepare project proposal"
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
                className="mb-2 mr-2 rounded-full bg-indigo-50 dark:bg-indigo-900 px-3 py-1"
              >
                <Text className="text-xs text-indigo-700 dark:text-indigo-300">{c}</Text>
              </Pressable>
            ))}
          </View>
        </FormField>

        <FormField label="Start date (YYYY-MM-DD) *" error={errors.startDate}>
          <TextInput
            className={inputClass('startDate')}
            placeholder="2026-10-02"
            placeholderTextColor="#9ca3af"
            value={form.startDate}
            onChangeText={(v) => setField('startDate', v)}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
        </FormField>

        <FormField label="Due date (YYYY-MM-DD) *" error={errors.dueDate}>
          <TextInput
            className={inputClass('dueDate')}
            placeholder="2026-10-05"
            placeholderTextColor="#9ca3af"
            value={form.dueDate}
            onChangeText={(v) => setField('dueDate', v)}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
        </FormField>

        <FormField label="Status">
          <OptionSelector options={STATUSES} value={form.status} onChange={(v) => setField('status', v)} />
        </FormField>

        <Pressable onPress={handleSave} className="mt-2 items-center rounded-xl bg-indigo-600 py-4">
          <Text className="text-base font-semibold text-white">{isEdit ? 'Update Task' : 'Save Task'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}