import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'taskflow_tasks';
const TaskContext = createContext();

// Time + random part, so two tasks created in the same millisecond never clash
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hydrated, setHydrated] = useState(false); // true once saved data was read successfully

  // 1. Load saved tasks once at startup
  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setTasks(JSON.parse(saved));
        setHydrated(true);
      } catch (e) {
        setError('Could not load tasks');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 2. Save whenever tasks change (but never before loading finished)
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() =>
      setError('Could not save tasks')
    );
  }, [tasks, hydrated]);

  function addTask(task) {
    setTasks((prev) => [{ ...task, id: generateId() }, ...prev]);
  }

  function updateTask(id, changes) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t
      )
    );
  }

  function clearAllTasks() {
    setTasks([]);
  }

  // Adds many tasks at once. Duplicates are already filtered out by csvService.
  function importTasks(newTasks) {
    setTasks((prev) => [...newTasks, ...prev]);
  }

  return (
    <TaskContext.Provider
      value={{ tasks, loading, error, addTask, updateTask, deleteTask, toggleComplete, clearAllTasks, importTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}