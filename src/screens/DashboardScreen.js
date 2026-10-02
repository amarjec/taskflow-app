import { View, Button } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 10 }}>
      <Button title="Tasks" onPress={() => navigation.navigate('TaskList')} />
      <Button title="Add Task" onPress={() => navigation.navigate('AddEditTask')} />
      <Button title="Bulk Upload" onPress={() => navigation.navigate('BulkUpload')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}