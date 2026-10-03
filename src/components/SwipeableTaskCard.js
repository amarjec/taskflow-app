import { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import TaskCard from './TaskCard';

// One colored button revealed by the swipe
function ActionButton({ icon, label, bg, onPress }) {
  return (
    <Pressable onPress={onPress} className={`w-24 items-center justify-center ${bg}`}>
      <Ionicons name={icon} size={24} color="white" />
      <Text className="mt-1 text-xs font-medium text-white">{label}</Text>
    </Pressable>
  );
}

export default function SwipeableTaskCard({ task, onPress, onToggle, onDelete }) {
  const swipeRef = useRef(null); // lets us close the row from code
  const done = task.status === 'Completed';

  function closeThen(action) {
    swipeRef.current?.close();
    action();
  }

  return (
    // overflow-hidden + rounded keeps the colored buttons inside the card's rounded corners
    <View className="mb-3 overflow-hidden rounded-xl">
      <Swipeable
        ref={swipeRef}
        overshootLeft={false}
        overshootRight={false}
        renderLeftActions={() => (
          <ActionButton
            icon={done ? 'refresh' : 'checkmark'}
            label={done ? 'Pending' : 'Complete'}
            bg="bg-green-600"
            onPress={() => closeThen(onToggle)}
          />
        )}
        renderRightActions={() => (
          <ActionButton icon="trash" label="Delete" bg="bg-red-500" onPress={() => closeThen(onDelete)} />
        )}
      >
        <TaskCard task={task} onPress={onPress} onToggle={onToggle} onDelete={onDelete} />
      </Swipeable>
    </View>
  );
}