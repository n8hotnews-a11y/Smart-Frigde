
import React, { useState } from 'react';
import { FoodItem, MealSuggestion } from '../types';
import { suggestMeals } from '../services/geminiService';

interface MealPlannerProps {
  foodItems: FoodItem[];
}

const MealSuggestionCard: React.FC<{ suggestion: MealSuggestion }> = ({ suggestion }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm transition-shadow">
    <h3 className="text-xl font-bold text-orange-700">{suggestion.name}</h3>
    <p className="text-stone-600 mt-1 mb-3">{suggestion.description}</p>
    
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-stone-800">Nguyên liệu cần:</h4>
        <ul className="list-disc list-inside text-stone-600 text-sm mt-1">
          {suggestion.ingredientsNeeded.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-stone-800">Công thức:</h4>
        <p className="whitespace-pre-wrap text-stone-600 text-sm mt-1">{suggestion.recipe}</p>
      </div>
       <div>
        <h4 className="font-semibold text-stone-800">Dinh dưỡng (ước tính):</h4>
        <p className="text-stone-600 text-sm mt-1">
            Calories: {suggestion.nutrition.calories}, Đạm: {suggestion.nutrition.protein}, Carb: {suggestion.nutrition.carbs}, Béo: {suggestion.nutrition.fat}
        </p>
      </div>
    </div>
  </div>
);


const MealPlanner: React.FC<MealPlannerProps> = ({ foodItems }) => {
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await suggestMeals(foodItems);
      setSuggestions(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Gợi ý món ăn</h1>
      <p className="text-stone-600 mb-4">Để AI gợi ý thực đơn từ những nguyên liệu bạn có!</p>

      <button
        onClick={handleGetSuggestions}
        disabled={isLoading || foodItems.length === 0}
        className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400"
      >
        {isLoading ? 'AI đang suy nghĩ...' : 'Lấy gợi ý ngay!'}
      </button>
      {foodItems.length === 0 && <p className="text-sm text-center mt-2 text-red-600">Vui lòng thêm thực phẩm vào kho trước.</p>}

      <div className="mt-6 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {suggestions.length > 0 && (
          suggestions.map((s, i) => <MealSuggestionCard key={i} suggestion={s} />)
        )}
        
        {isLoading && (
           <div className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
