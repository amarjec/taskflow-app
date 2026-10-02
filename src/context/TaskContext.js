import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'taskflow_tasks';
const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs once when the app starts: load saved tasks
  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {
        setError('Could not load tasks');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Every change goes through here: update state AND save to storage
  async function saveTasks(newTasks) {
    setTasks(newTasks);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {
      setError('Could not save tasks');
    }
  }

  function addTask(task) {
    const newTask = { ...task, id: Date.now().toString() };
    saveTasks([newTask, ...tasks]);
  }

  function updateTask(id, changes) {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }

  function deleteTask(id) {
    saveTasks(tasks.filter((t) => t.id !== id));
  }

  function toggleComplete(id) {
    saveTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
          : t
      )
    );
  }

  function clearAllTasks() {
    saveTasks([]);
  }

  return (
    <TaskContext.Provider
      value={{ tasks, loading, error, addTask, updateTask, deleteTask, toggleComplete, clearAllTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook so screens can write: const { tasks } = useTasks();
export function useTasks() {
  return useContext(TaskContext);
}