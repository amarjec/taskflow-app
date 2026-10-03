import "./global.css"
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from './src/screens/DashboardScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import AddEditTaskScreen from './src/screens/AddEditTaskScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import BulkUploadScreen from './src/screens/BulkUploadScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

const lightNavTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#f3f4f6' },
};

const darkNavTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#111827', card: '#1f2937' },
};

function AppContent() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer theme={isDark ? darkNavTheme : lightNavTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={({ navigation }) => ({title: 'TaskFlow',headerRight: () => (
              <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10}>
                <Ionicons name="settings-outline" size={24} color={isDark ? '#e5e7eb' : '#374151'} />
              </Pressable>
            ),
          })}
        />
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
        <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} options={{ title: 'Task' }} />
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Task Details' }} />
        <Stack.Screen name="BulkUpload" component={BulkUploadScreen} options={{ title: 'Bulk Upload' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ThemeProvider>
  );
}
