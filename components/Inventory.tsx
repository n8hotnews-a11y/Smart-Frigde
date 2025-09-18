
import React from 'react';
import { FoodItem } from '../types';

interface InventoryProps {
  foodItems: FoodItem[];
  setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
}

const FoodCard: React.FC<{ item: FoodItem }> = ({ item }) => {
  const getExpiryColor = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(item.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) return 'text-red-600';
    if (diffDays <= 7) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
      <div>
        <p className="font-semibold text-stone-800">{item.name}</p>
        <p className="text-sm text-stone-500">Số lượng: {item.quantity}</p>
      </div>
      <div>
        <p className={`text-sm font-medium ${getExpiryColor()}`}>
          HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
        </p>
      </div>
    </div>
  );
};


const Inventory: React.FC<InventoryProps> = ({ foodItems, setFoodItems }) => {
  const groupedItems = foodItems.reduce((acc, item) => {
    const storage = item.storage;
    if (!acc[storage]) {
      acc[storage] = [];
    }
    acc[storage].push(item);
    return acc;
  }, {} as Record<FoodItem['storage'], FoodItem[]>);

  const storageOrder: FoodItem['storage'][] = ['Tủ lạnh', 'Tủ đông', 'Kệ bếp'];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-stone-800">Kho thực phẩm</h1>
        {/* Add item button can be added here in a real app */}
      </div>
      <p className="text-stone-600 mb-6">Quản lý các nguyên liệu có sẵn trong bếp của bạn.</p>
      
      <div className="space-y-6">
        {storageOrder.map(storageType => (
          groupedItems[storageType] && groupedItems[storageType].length > 0 && (
            <div key={storageType}>
              <h2 className="text-xl font-semibold text-stone-700 mb-3">{storageType}</h2>
              <div className="space-y-2">
                {groupedItems[storageType]
                  .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                  .map(item => (
                    <FoodCard key={item.id} item={item} />
                  ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Inventory;
