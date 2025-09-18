import React from 'react';
import { FoodItem, FamilyMember, Tab } from '../types';
import ExpiryNotification from './ExpiryNotification';
import { InventoryIcon, MealIcon, NutritionIcon } from './icons';
import { signOutUser } from '../services/firebaseService';

interface DashboardProps {
  foodItems: FoodItem[];
  familyMembers: FamilyMember[];
  setActiveTab: (tab: Tab) => void;
  userEmail: string;
}

const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}> = ({ icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left w-full flex items-center space-x-4"
  >
    <div className="bg-orange-100 text-orange-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="font-semibold text-stone-800">{label}</p>
      <p className="text-sm text-stone-500">{description}</p>
    </div>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ foodItems, familyMembers, setActiveTab, userEmail }) => {
  
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Chào mừng,</h1>
          <p className="text-stone-600 text-lg truncate max-w-[200px]">{userEmail}!</p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-stone-200 text-stone-700 font-semibold py-2 px-4 rounded-lg hover:bg-stone-300 transition-colors text-sm"
        >
          Đăng xuất
        </button>
      </header>

      <section>
        <ExpiryNotification foodItems={foodItems} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-stone-700">Truy cập nhanh</h2>
        <div className="space-y-3">
          <QuickActionButton
            icon={<InventoryIcon className="w-6 h-6" />}
            label="Kiểm tra kho"
            description={`Hiện có ${foodItems.length} món trong kho.`}
            onClick={() => setActiveTab(Tab.Inventory)}
          />
          <QuickActionButton
            icon={<MealIcon className="w-6 h-6" />}
            label="Gợi ý món ăn"
            description="Tìm cảm hứng cho bữa ăn hôm nay."
            onClick={() => setActiveTab(Tab.MealPlanner)}
          />
          <QuickActionButton
            icon={<NutritionIcon className="w-6 h-6" />}
            label="Báo cáo dinh dưỡng"
            description={`Theo dõi sức khỏe cho ${familyMembers.length} thành viên.`}
            onClick={() => setActiveTab(Tab.Nutrition)}
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
