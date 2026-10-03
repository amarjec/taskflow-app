import Papa from 'papaparse';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getTodayString } from '../utils/dateUtils';

const COLUMNS = ['id', 'title', 'description', 'category', 'priority', 'start_date', 'due_date', 'status'];

// Task objects use camelCase (startDate); the CSV uses snake_case (start_date)
export function tasksToCsv(tasks) {
  const rows = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    start_date: t.startDate,
    due_date: t.dueDate,
    status: t.status,
  }));
  // unparse handles commas, quotes and line breaks inside values for us
  return Papa.unparse(rows, { columns: COLUMNS });
}

export async function exportTasksCsv(tasks) {
  if (tasks.length === 0) throw new Error('There are no tasks to export.');

  const file = new File(Paths.cache, `taskflow-tasks-${getTodayString()}.csv`);
  if (file.exists) file.delete(); // overwrite an earlier export from the same day
  file.create();
  file.write(tasksToCsv(tasks));

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Export tasks',
    UTI: 'public.comma-separated-values-text', // iOS file type
  });
}