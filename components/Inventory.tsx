import React, { useState } from 'react';
import { FoodItem } from '../types';

// FIX: Define props for the Inventory component to manage state from App.tsx
interface InventoryProps {
  foodItems: FoodItem[];
  onAddItem: (item: Omit<FoodItem, 'id' | 'imageUrl'>) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: FoodItem) => void; // For potential future use
}

const Inventory: React.FC<InventoryProps> = ({ foodItems, onAddItem, onDeleteItem }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
    storage: 'Tủ lạnh' as FoodItem['storage'],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name && newItem.quantity && newItem.expiryDate) {
      onAddItem(newItem);
      setNewItem({
        name: '',
        quantity: '',
        expiryDate: '',
        storage: 'Tủ lạnh',
      });
      setIsAdding(false);
    } else {
      alert("Vui lòng điền đầy đủ thông tin.");
    }
  };

  const sortedItems = [...foodItems].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-800">Kho thực phẩm</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-orange-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-lg hover:bg-orange-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-700">Thêm thực phẩm mới</h2>
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              placeholder="Tên thực phẩm (VD: Táo)"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <div className="grid grid-cols-2 gap-3">
               <input
                type="text"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                placeholder="Số lượng (VD: 5 quả)"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
               <input
                type="date"
                name="expiryDate"
                value={newItem.expiryDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <select
              name="storage"
              value={newItem.storage}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Tủ lạnh">Tủ lạnh</option>
              <option value="Tủ đông">Tủ đông</option>
              <option value="Kệ bếp">Kệ bếp</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">Thêm</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {sortedItems.length > 0 ? (
          sortedItems.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-stone-800">{item.name}</p>
                <p className="text-sm text-stone-500">{item.quantity} - {item.storage}</p>
                <p className="text-sm text-orange-600 font-medium">HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}</p>
              </div>
              <button onClick={() => onDeleteItem(item.id)} className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-stone-500 py-10">Kho của bạn đang trống. Nhấn nút '+' để thêm thực phẩm.</p>
        )}
      </div>
    </div>
  );
};

export default Inventory;
