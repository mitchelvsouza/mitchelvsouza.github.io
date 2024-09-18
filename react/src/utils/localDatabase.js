const DB_KEY = 'localCrudDB';

export const initializeDB = () => {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify([]));
  }
};

export const getAllItems = () => {
  return JSON.parse(localStorage.getItem(DB_KEY));
};

export const addItem = (item) => {
  const items = getAllItems();
  const newItem = { ...item, id: Date.now() };
  items.push(newItem);
  localStorage.setItem(DB_KEY, JSON.stringify(items));
  return newItem;
};

export const updateItem = (id, updatedItem) => {
  const items = getAllItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem, id };
    localStorage.setItem(DB_KEY, JSON.stringify(items));
    return items[index];
  }
  return null;
};

export const deleteItem = (id) => {
  const items = getAllItems();
  const filteredItems = items.filter(item => item.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(filteredItems));
};
