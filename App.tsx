import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import MealPlanner from './components/MealPlanner';
import Nutrition from './components/Nutrition';
import Chatbot from './components/Chatbot';
import ExpiryNotification from './components/ExpiryNotification';
import { Tab, FoodItem, FamilyMember } from './types';

// Mock Data
const initialFoodItems: FoodItem[] = [
  { id: '1', name: 'Thịt gà', quantity: '500g', expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Tủ đông' },
  { id: '2', name: 'Trứng gà', quantity: '10 quả', expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Tủ lạnh' },
  { id: '3', name: 'Cà chua', quantity: '5 quả', expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Tủ lạnh' },
  { id: '4', name: 'Hành tây', quantity: '2 củ', expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Kệ bếp' },
  { id: '5', name: 'Bánh mì', quantity: '1 ổ', expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Kệ bếp' },
];

const initialFamilyMembers: FamilyMember[] = [
    { id: 'fm1', name: 'Anh Hùng', age: 35, goal: 'Duy trì sức khỏe' },
    { id: 'fm2', name: 'Chị Mai', age: 32, goal: 'Giảm cân' },
    { id: 'fm3', name: 'Bé An', age: 6, goal: 'Tăng cân' },
];

const isExpiringSoon = (expiryDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems);
  const [familyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [expiringItemsForModal, setExpiringItemsForModal] = useState<FoodItem[]>([]);

  useEffect(() => {
    const expiringItems = foodItems.filter(item => isExpiringSoon(item.expiryDate));
    if (expiringItems.length > 0) {
        setExpiringItemsForModal(expiringItems);
        // Only show modal once per session for simplicity
        if (!sessionStorage.getItem('expiryModalShown')) {
            setShowExpiryModal(true);
            sessionStorage.setItem('expiryModalShown', 'true');
        }
    } else {
        setExpiringItemsForModal([]);
    }
  }, [foodItems]);

  const handleAddItem = (item: Omit<FoodItem, 'id' | 'imageUrl'>) => {
    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      ...item,
    };
    setFoodItems(prevItems => [...prevItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setFoodItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleUpdateItem = (updatedItem: FoodItem) => {
     setFoodItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard:
        return <Dashboard foodItems={foodItems} setActiveTab={setActiveTab} />;
      case Tab.Inventory:
        return <Inventory foodItems={foodItems} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} onUpdateItem={handleUpdateItem} />;
      case Tab.MealPlanner:
        return <MealPlanner foodItems={foodItems} />;
      case Tab.Nutrition:
        return <Nutrition familyMembers={familyMembers} />;
      case Tab.Chatbot:
        return <Chatbot />;
      default:
        return <Dashboard foodItems={foodItems} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="font-sans bg-stone-50 min-h-screen">
      <div className="relative mx-auto max-w-lg min-h-screen bg-white shadow-2xl">
        <main>
          {renderContent()}
        </main>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {showExpiryModal && <ExpiryNotification items={expiringItemsForModal} onClose={() => setShowExpiryModal(false)} />}
    </div>
  );
}

export default App;
