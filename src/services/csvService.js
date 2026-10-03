import Papa from 'papaparse';
import { validateTask } from '../utils/validators';
import { PRIORITIES } from '../utils/constants';

// Column order used when the file has NO header row (like your tasks.csv)
const COLUMNS = ['id', 'title', 'description', 'category', 'priority', 'start_date', 'due_date', 'status'];

// Maps our field names to CSV column names, for friendlier error messages
const FIELD_LABELS = { title: 'title', category: 'category', startDate: 'start_date', dueDate: 'due_date' };

// "pending" / "Done" / "TODO" etc. -> the two statuses the app understands
const STATUS_MAP = {
  pending: 'Pending',
  todo: 'Pending',
  completed: 'Completed',
  complete: 'Completed',
  done: 'Completed',
};

function normalizePriority(value) {
  return PRIORITIES.find((p) => p.toLowerCase() === value.toLowerCase()) || null;
}

function normalizeStatus(value) {
  return STATUS_MAP[value.toLowerCase()] || null;
}

// Two tasks with the same title + dates count as the same task
function contentKey(task) {
  return `${task.title}|${task.startDate}|${task.dueDate}`.toLowerCase();
}

/**
 * Turns raw CSV text into row objects.
 * We parse WITHOUT papaparse's header option, then detect a header ourselves,
 * because header:true would swallow the first task of a headerless file.
 */
export function parseCsv(text) {
  const parsed = Papa.parse(text.replace(/^\uFEFF/, ''), { skipEmptyLines: true }); // strip BOM
  const lines = parsed.data.map((r) => r.map((cell) => String(cell ?? '').trim()));
  if (lines.length === 0) throw new Error('The file has no data.');

  const firstRow = lines[0].map((c) => c.toLowerCase());
  const hasHeader = firstRow.includes('title') && firstRow.includes('priority');

  let columns = COLUMNS;
  let dataLines = lines;

  if (hasHeader) {
    columns = firstRow; // use the file's own column names (any order)
    dataLines = lines.slice(1);
    const missing = COLUMNS.filter((c) => !columns.includes(c));
    if (missing.length > 0) throw new Error(`Missing columns: ${missing.join(', ')}`);
  }
  if (dataLines.length === 0) throw new Error('The file has a header but no tasks.');

  const rows = dataLines.map((cells, i) => {
    const row = { _row: i + 1, _badLength: cells.length !== columns.length };
    columns.forEach((col, idx) => {
      row[col] = cells[idx] ?? '';
    });
    return row;
  });

  return { rows, hasHeader };
}

/**
 * Checks every row. Returns:
 *  validTasks - ready to import
 *  errors     - invalid rows with a reason
 *  duplicates - rows that already exist (in the app, or earlier in the same file)
 */
export function validateCsvRows(rows, existingTasks) {
  const validTasks = [];
  const errors = [];
  const duplicates = [];

  // Sets give fast "have I seen this?" checks
  const seenIds = new Set(existingTasks.map((t) => t.id));
  const seenKeys = new Set(existingTasks.map(contentKey));

  rows.forEach((row) => {
    if (row._badLength) {
      errors.push({ row: row._row, title: row.title, message: 'Wrong number of columns' });
      return;
    }

    const priority = normalizePriority(row.priority);
    const status = normalizeStatus(row.status);
    const task = {
      title: row.title,
      description: row.description,
      category: row.category,
      priority,
      startDate: row.start_date,
      dueDate: row.due_date,
      status,
    };

    // Reuse the SAME validation as the Add/Edit form (including due >= start)
    const problems = Object.entries(validateTask(task)).map(
      ([field, msg]) => `${FIELD_LABELS[field] || field}: ${msg}`
    );
    if (!priority) problems.push(`priority: "${row.priority}" must be Low, Medium or High`);
    if (!status) problems.push(`status: "${row.status}" must be pending or completed`);

    if (problems.length > 0) {
      errors.push({ row: row._row, title: row.title, message: problems.join('; ') });
      return;
    }

    // Duplicate check (only for otherwise valid rows)
    const id = row.id || `csv-${Date.now()}-${row._row}`;
    const key = contentKey(task);
    if (seenIds.has(id) || seenKeys.has(key)) {
      duplicates.push({
        row: row._row,
        title: row.title,
        message: seenIds.has(id) ? 'A task with this id already exists' : 'Same title and dates already exist',
      });
      return;
    }

    seenIds.add(id);
    seenKeys.add(key);
    validTasks.push({ ...task, id });
  });

  return { totalRows: rows.length, validTasks, errors, duplicates };
}