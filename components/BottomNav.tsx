import React from 'react';
import { Tab } from '../types';
import { HomeIcon, InventoryIcon, MealIcon, NutritionIcon, ChatIcon } from './icons';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
  label: Tab;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-orange-600' : 'text-stone-500 hover:text-orange-500'
    }`}
  >
    {icon}
    <span className="text-xs font-medium mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { label: Tab.Dashboard, icon: <HomeIcon className="w-6 h-6" /> },
    { label: Tab.Inventory, icon: <InventoryIcon className="w-6 h-6" /> },
    { label: Tab.MealPlanner, icon: <MealIcon className="w-6 h-6" /> },
    { label: Tab.Nutrition, icon: <NutritionIcon className="w-6 h-6" /> },
    { label: Tab.Chatbot, icon: <ChatIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around border-t border-gray-200">
      {navItems.map((item) => (
        <NavItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          isActive={activeTab === item.label}
          onClick={() => setActiveTab(item.label)}
        />
      ))}
    </div>
  );
};

export default BottomNav;