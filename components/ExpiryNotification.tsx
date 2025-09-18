import React from 'react';
import { FoodItem } from '../types';

interface ExpiryNotificationProps {
  items: FoodItem[];
  onClose: () => void;
}

const ExpiryNotification: React.FC<ExpiryNotificationProps> = ({ items, onClose }) => {
  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end sm:items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl animate-slide-up">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-stone-800">Thực phẩm sắp hết hạn!</h3>
            <p className="text-sm text-stone-600 mt-1">Đừng để lãng phí, hãy sử dụng sớm nhé:</p>
            <ul className="mt-2 space-y-2 text-sm">
              {items.map(item => (
                <li key={item.id} className="flex items-center gap-3">
                  {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                  )}
                  <span className="flex-1">
                    <span className="font-medium text-stone-700">{item.name}</span>
                    <br/>
                    <span className="text-xs">HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
          >
            Đã hiểu
          </button>
        </div>
      </div>
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ExpiryNotification;
