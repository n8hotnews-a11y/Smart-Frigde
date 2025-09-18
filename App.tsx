import React, { useState, useEffect } from 'react';
import { Tab, FoodItem, FamilyMember } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import MealPlanner from './components/MealPlanner';
import Nutrition from './components/Nutrition';
import Chatbot from './components/Chatbot';
import ExpiryNotification from './components/ExpiryNotification';

// Mock Data
const initialFoodItems: FoodItem[] = [
  { id: '1', name: 'Thịt bò', quantity: '500g', expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Tủ đông' },
  { id: '2', name: 'Trứng gà', quantity: '10 quả', expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Tủ lạnh' },
  { id: '3', name: 'Sữa tươi', quantity: '1L', expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Tủ lạnh' },
  { id: '4', name: 'Cà chua', quantity: '5 quả', expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Tủ lạnh' },
  { id: '5', name: 'Gạo', quantity: '2kg', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], storage: 'Kệ bếp' },
];

const initialFamilyMembers: FamilyMember[] = [
    { id: 'm1', name: 'Anh Hùng', age: 35, goal: 'Duy trì sức khỏe' },
    { id: 'm2', name: 'Chị Mai', age: 32, goal: 'Giảm cân' },
    { id: 'm3', name: 'Bé An', age: 5, goal: 'Tăng cân' },
];

const isExpiringSoon = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems);
  const [familyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [showExpiryNotification, setShowExpiryNotification] = useState(false);
  const [expiringItems, setExpiringItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    const expiring = foodItems.filter(item => isExpiringSoon(item.expiryDate));
    if (expiring.length > 0) {
      setExpiringItems(expiring);
      // Use a timeout to show notification shortly after app load
      const timer = setTimeout(() => setShowExpiryNotification(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [foodItems]);

  const handleAddItem = (item: Omit<FoodItem, 'id' | 'imageUrl'>) => {
    const newItem: FoodItem = {
      id: new Date().toISOString(),
      ...item,
    };
    setFoodItems(prevItems => [...prevItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setFoodItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard:
        return <Dashboard foodItems={foodItems} setActiveTab={setActiveTab} />;
      case Tab.Inventory:
        return <Inventory foodItems={foodItems} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} onUpdateItem={() => {}} />;
      case Tab.MealPlanner:
        return <MealPlanner foodItems={foodItems} />;
      case Tab.Nutrition:
        return <Nutrition familyMembers={familyMembers} setActiveTab={setActiveTab} />;
      case Tab.Chatbot:
        return <Chatbot />;
      default:
        return <Dashboard foodItems={foodItems} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="font-sans bg-stone-50 min-h-screen pb-16">
      <main className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      {showExpiryNotification && <ExpiryNotification items={expiringItems} onClose={() => setShowExpiryNotification(false)} />}
    </div>
  );
};

export default App;
