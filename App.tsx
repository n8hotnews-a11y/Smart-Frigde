import React, { useState, useEffect } from 'react';
import { Tab, FoodItem, FamilyMember } from './types';
import { onAuthChange } from './services/firebaseService';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import MealPlanner from './components/MealPlanner';
import Nutrition from './components/Nutrition';
import Chatbot from './components/Chatbot';
import AuthScreen from './components/AuthScreen';

// Mock Data (will be used after login)
const MOCK_FOOD_ITEMS: FoodItem[] = [
  { id: '1', name: 'Thịt heo', quantity: '500g', expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), storage: 'Tủ đông' },
  { id: '2', name: 'Trứng gà', quantity: '12 quả', expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), storage: 'Tủ lạnh' },
  { id: '3', name: 'Cà chua', quantity: '5 quả', expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), storage: 'Tủ lạnh' },
];

const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'Bố Hùng', age: 45, goal: 'Duy trì sức khỏe' },
  { id: '2', name: 'Mẹ Lan', age: 42, goal: 'Giảm cân' },
];

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(MOCK_FOOD_ITEMS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải ứng dụng...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard:
        return <Dashboard foodItems={foodItems} familyMembers={familyMembers} setActiveTab={setActiveTab} userEmail={user.email} />;
      case Tab.Inventory:
        return <Inventory foodItems={foodItems} setFoodItems={setFoodItems} />;
      case Tab.MealPlanner:
        return <MealPlanner foodItems={foodItems} />;
      case Tab.Nutrition:
        return <Nutrition familyMembers={familyMembers} />;
      case Tab.Chatbot:
        return <Chatbot />;
      default:
        return <Dashboard foodItems={foodItems} familyMembers={familyMembers} setActiveTab={setActiveTab} userEmail={user.email} />;
    }
  };

  return (
    <div className="font-sans bg-stone-50 text-stone-900 min-h-screen">
      <main className="pb-20"> {/* Padding bottom to avoid overlap with nav */}
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
