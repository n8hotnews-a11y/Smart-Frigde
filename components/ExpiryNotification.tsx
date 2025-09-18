
import React from 'react';
import { FoodItem } from '../types';

interface ExpiryNotificationProps {
  foodItems: FoodItem[];
}

const ExpiryNotification: React.FC<ExpiryNotificationProps> = ({ foodItems }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiringSoonItems = foodItems.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  if (expiringSoonItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-lg" role="alert">
      <p className="font-bold">Sắp hết hạn!</p>
      <ul className="mt-2 list-disc list-inside text-sm">
        {expiringSoonItems.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong> - HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
          </li>
        ))}
      </ul>
      <p className="text-xs mt-2">Hãy sử dụng sớm để tránh lãng phí nhé.</p>
    </div>
  );
};

export default ExpiryNotification;
