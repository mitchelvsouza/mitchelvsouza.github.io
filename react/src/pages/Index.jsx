import React, { useState, useEffect } from 'react';
import { initializeDB, getAllItems, addItem, updateItem, deleteItem } from '../utils/localDatabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    initializeDB();
    refreshItems();
  }, []);

  const refreshItems = () => {
    setItems(getAllItems());
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItem({ name: newItemName });
      setNewItemName('');
      refreshItems();
    }
  };

  const handleUpdateItem = () => {
    if (editingItem && editingItem.name.trim()) {
      updateItem(editingItem.id, { name: editingItem.name });
      setEditingItem(null);
      refreshItems();
    }
  };

  const handleDeleteItem = (id) => {
    deleteItem(id);
    refreshItems();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Local CRUD Database</h1>
          
          <div className="flex mb-4">
            <Input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="New item name"
              className="flex-grow mr-2"
            />
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>

          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                {editingItem && editingItem.id === item.id ? (
                  <Input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="flex-grow mr-2"
                  />
                ) : (
                  <span>{item.name}</span>
                )}
                <div>
                  {editingItem && editingItem.id === item.id ? (
                    <Button onClick={handleUpdateItem} className="mr-2">Save</Button>
                  ) : (
                    <Button onClick={() => setEditingItem(item)} className="mr-2">Edit</Button>
                  )}
                  <Button onClick={() => handleDeleteItem(item.id)} variant="destructive">Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
