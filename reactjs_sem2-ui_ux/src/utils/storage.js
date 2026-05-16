// Utility helpers that wrap localStorage JSON parsing/stringifying.
// All data for the app is stored under keys prefixed with "cem_".

export const KEYS = {
  EVENTS: 'cem_events',
  REGISTRATIONS: 'cem_registrations',
  FEEDBACK: 'cem_feedback',
  NOTIFICATIONS: 'cem_notifications',
  AUTH: 'cem_auth',
};

export function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Returns all items in a list stored at key (defaults to empty array).
export function getList(key) {
  return getItem(key) || [];
}

// Appends a single item to the end of a stored array.
export function addToList(key, item) {
  const list = getList(key);
  list.push(item);
  setItem(key, list);
}

// Replaces the item whose .id matches id with { ...existing, ...updates }.
export function updateInList(key, id, updates) {
  const list = getList(key);
  const updated = list.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  setItem(key, updated);
}

// Removes the item whose .id matches id from the stored array.
export function removeFromList(key, id) {
  const list = getList(key);
  setItem(key, list.filter((item) => item.id !== id));
}
