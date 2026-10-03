import { useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { useTasks } from '../context/TaskContext';
import { parseCsv, validateCsvRows } from '../services/csvService';

function formatSize(bytes) {
  if (!bytes) return 'unknown';
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function Tile({ label, value, bg, text }) {
  return (
    <View className={`mx-1 flex-1 items-center rounded-xl p-3 ${bg}`}>
      <Text className={`text-2xl font-bold ${text}`}>{value}</Text>
      <Text className={`text-xs ${text}`}>{label}</Text>
    </View>
  );
}

// Used for both the invalid rows list and the duplicates list
function IssueList({ title, items, color }) {
  if (items.length === 0) return null;
  const shown = items.slice(0, 50); // don't render thousands of rows
  return (
    <View className="mt-4 rounded-xl bg-white p-4">
      <Text className={`mb-2 font-semibold ${color}`}>
        {title} ({items.length})
      </Text>
      {shown.map((item) => (
        <View key={item.row} className="mb-2 border-b border-gray-100 pb-2">
          <Text className="text-sm font-medium text-gray-800">
            Row {item.row}
            {item.title ? ` - ${item.title}` : ''}
          </Text>
          <Text className="text-xs text-gray-500">{item.message}</Text>
        </View>
      ))}
      {items.length > shown.length && (
        <Text className="text-xs text-gray-400">...and {items.length - shown.length} more</Text>
      )}
    </View>
  );
}

export default function BulkUploadScreen({ navigation }) {
  const { tasks, importTasks } = useTasks();
  const [file, setFile] = useState(null); // { name, size, rowCount }
  const [report, setReport] = useState(null); // validation result
  const [result, setResult] = useState(null); // import summary
  const [fileError, setFileError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function pickFile() {
    try {
      // '*/*' because Android reports CSV with many different mime types.
      // copyToCacheDirectory makes the file readable by the app.
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (res.canceled) return;

      // A new file was chosen, so clear everything from the previous one
      setFile(null);
      setReport(null);
      setResult(null);
      setFileError(null);

      const asset = res.assets[0];
      if (!asset.name.toLowerCase().endsWith('.csv')) {
        setFileError('Please choose a .csv file.');
        return;
      }

      setBusy(true);
      const text = await new File(asset.uri).text();
      if (!text.trim()) throw new Error('The file is empty.');

      const { rows } = parseCsv(text);
      setFile({ name: asset.name, size: asset.size, rowCount: rows.length });
      setReport(validateCsvRows(rows, tasks));
    } catch (e) {
      setFileError(e.message || 'Could not read the file.');
    } finally {
      setBusy(false);
    }
  }

  function handleImport() {
    importTasks(report.validTasks);
    setResult({
      imported: report.validTasks.length,
      duplicates: report.duplicates.length,
      failed: report.errors.length,
    });
    setReport(null);
  }

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="p-4 pb-10">
      {/* Pick a file */}
      <View className="rounded-xl bg-white p-5">
        <Text className="font-semibold text-gray-900">Import tasks from CSV</Text>
        <Text className="mt-1 text-xs text-gray-500">
          Columns: id, title, description, category, priority, start_date, due_date, status. A header row is optional.
        </Text>
        <Pressable
          onPress={pickFile}
          disabled={busy}
          className={`mt-4 flex-row items-center justify-center rounded-xl py-3 ${busy ? 'bg-indigo-300' : 'bg-indigo-600'}`}
        >
          <Ionicons name="document-outline" size={20} color="white" />
          <Text className="ml-2 font-semibold text-white">{file ? 'Choose another file' : 'Select CSV file'}</Text>
        </Pressable>
      </View>

      {busy && <ActivityIndicator className="mt-6" size="large" color="#4f46e5" />}

      {/* Error state */}
      {fileError && (
        <View className="mt-4 flex-row items-center rounded-xl bg-red-50 p-4">
          <Ionicons name="alert-circle" size={22} color="#dc2626" />
          <Text className="ml-2 flex-1 text-red-700">{fileError}</Text>
        </View>
      )}

      {/* Selected file info */}
      {file && (
        <View className="mt-4 rounded-xl bg-white p-4">
          <Text className="font-medium text-gray-900" numberOfLines={1}>
            {file.name}
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            {formatSize(file.size)}  •  {file.rowCount} rows detected
          </Text>
        </View>
      )}

      {/* Validation summary, shown BEFORE importing */}
      {report && (
        <>
          <View className="-mx-1 mt-4 flex-row">
            <Tile label="Valid" value={report.validTasks.length} bg="bg-green-100" text="text-green-700" />
            <Tile label="Invalid" value={report.errors.length} bg="bg-red-100" text="text-red-700" />
            <Tile label="Duplicates" value={report.duplicates.length} bg="bg-amber-100" text="text-amber-700" />
          </View>

          <IssueList title="Invalid rows" items={report.errors} color="text-red-600" />
          <IssueList title="Duplicates (skipped)" items={report.duplicates} color="text-amber-600" />

          <Pressable
            onPress={handleImport}
            disabled={report.validTasks.length === 0}
            className={`mt-5 items-center rounded-xl py-4 ${
              report.validTasks.length === 0 ? 'bg-gray-300' : 'bg-green-600'
            }`}
          >
            <Text className="font-semibold text-white">
              {report.validTasks.length === 0
                ? 'Nothing to import'
                : `Import ${report.validTasks.length} valid ${report.validTasks.length === 1 ? 'task' : 'tasks'}`}
            </Text>
          </Pressable>
        </>
      )}

      {/* Import result */}
      {result && (
        <View className="mt-4 items-center rounded-xl bg-white p-6">
          <Ionicons
            name={result.imported > 0 ? 'checkmark-circle' : 'information-circle'}
            size={48}
            color={result.imported > 0 ? '#16a34a' : '#d97706'}
          />
          <Text className="mt-2 text-lg font-semibold text-gray-900">
            {result.imported > 0 ? 'Import complete' : 'Nothing was imported'}
          </Text>
          <Text className="mt-2 text-center text-gray-600">
            Imported: {result.imported}{'\n'}
            Skipped duplicates: {result.duplicates}{'\n'}
            Failed (invalid): {result.failed}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('TaskList')}
            className="mt-5 w-full items-center rounded-xl bg-indigo-600 py-3"
          >
            <Text className="font-semibold text-white">View tasks</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}