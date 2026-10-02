import { isValidDate } from './dateUtils';

// Returns an object like { title: 'Title is required' }. Empty object = valid.
export function validateTask(task) {
  const errors = {};

  const title = task.title.trim();
  if (!title) errors.title = 'Title is required';
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters';

  if (!task.category.trim()) errors.category = 'Category is required';

  if (!isValidDate(task.startDate)) errors.startDate = 'Use format YYYY-MM-DD';

  if (!isValidDate(task.dueDate)) {
    errors.dueDate = 'Use format YYYY-MM-DD';
  } else if (!errors.startDate && task.dueDate < task.startDate) {
    // YYYY-MM-DD strings compare correctly with < and >, no Date objects needed
    errors.dueDate = 'Due date cannot be earlier than start date';
  }

  return errors;
}