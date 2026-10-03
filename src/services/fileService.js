import { File } from 'expo-file-system';
import * as LegacyFileSystem from 'expo-file-system/legacy';

// Reads a picked file as text. Tries three methods because Expo Go on Android
// sometimes refuses one of them (known permission issue with content:// files).
export async function readTextFile(uri) {
  const attempts = [
    () => new File(uri).text(), // modern API
    async () => {
      const res = await fetch(uri); // works with file:// and content:// on Android
      return res.text();
    },
    () => LegacyFileSystem.readAsStringAsync(uri), // old API
  ];

  let lastError = null;
  for (const attempt of attempts) {
    try {
      const text = await attempt();
      if (text && text.trim()) return text;
    } catch (e) {
      lastError = e; // remember it and try the next method
    }
  }
  throw new Error(lastError ? `Could not read the file: ${lastError.message}` : 'The file is empty.');
}