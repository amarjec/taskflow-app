import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from './src/screens/DashboardScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import AddEditTaskScreen from './src/screens/AddEditTaskScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import BulkUploadScreen from './src/screens/BulkUploadScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { TaskProvider } from './src/context/TaskContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
          <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} options={{ title: 'Task' }} />
          <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Task Details' }} />
          <Stack.Screen name="BulkUpload" component={BulkUploadScreen} options={{ title: 'Bulk Upload' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}