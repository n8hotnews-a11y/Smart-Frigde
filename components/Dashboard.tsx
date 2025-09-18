import React from 'react';
import { FoodItem, Tab } from '../types';

interface DashboardProps {
  foodItems: FoodItem[];
  setActiveTab: (tab: Tab) => void;
}

const isExpiringSoon = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
};

const Dashboard: React.FC<DashboardProps> = ({ foodItems, setActiveTab }) => {
  const expiringItems = foodItems.filter(item => isExpiringSoon(item.expiryDate));

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-stone-800">Chào buổi sáng!</h1>
        <p className="text-stone-500">Đây là tổng quan thực phẩm của gia đình bạn.</p>
      </header>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-stone-700 mb-3">Sắp hết hạn</h2>
        {expiringItems.length > 0 ? (
          <ul className="space-y-2">
            {expiringItems.map(item => (
              <li key={item.id} className="flex items-center gap-3 p-2 bg-orange-50 rounded-md">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-orange-800 truncate">{item.name}</p>
                </div>
                <span className="text-sm text-orange-600 flex-shrink-0">HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-stone-500">Tuyệt vời! Không có gì sắp hết hạn.</p>
        )}
      </div>

      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-lg shadow-lg text-white text-center">
        <h2 className="text-xl font-bold mb-2">Cần ý tưởng cho bữa tối?</h2>
        <p className="mb-4">Hãy để AI gợi ý những món ăn ngon từ nguyên liệu bạn có.</p>
        <button 
          onClick={() => setActiveTab(Tab.MealPlanner)}
          className="bg-white text-amber-700 font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          Nhận gợi ý ngay
        </button>
      </div>

       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-stone-700 mb-3">Tính năng nhanh</h2>
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveTab(Tab.Inventory)} className="p-4 bg-stone-100 rounded-lg text-stone-700 font-medium hover:bg-amber-100 transition">Quản lý kho</button>
            <button onClick={() => setActiveTab(Tab.Chatbot)} className="p-4 bg-stone-100 rounded-lg text-stone-700 font-medium hover:bg-amber-100 transition">Hỏi trợ lý AI</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
