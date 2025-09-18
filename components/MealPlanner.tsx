import React, { useState, useCallback } from 'react';
import { FoodItem, MealSuggestion } from '../types';
import { suggestMeals } from '../services/geminiService';

interface MealPlannerProps {
  foodItems: FoodItem[];
}

const MealSuggestionCard: React.FC<{ meal: MealSuggestion }> = ({ meal }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-amber-800">{meal.name}</h3>
    <p className="text-sm text-stone-600 mt-1 mb-3">{meal.description}</p>
    
    <div className="text-xs space-y-2">
      <p><strong className="font-medium text-stone-700">Nguyên liệu cần:</strong> {meal.ingredientsNeeded.join(', ')}</p>
      <p><strong className="font-medium text-stone-700">Dinh dưỡng:</strong> Calo: {meal.nutrition.calories}, Đạm: {meal.nutrition.protein}, Carb: {meal.nutrition.carbs}, Béo: {meal.nutrition.fat}</p>
    </div>
    
    <details className="mt-3">
        <summary className="text-sm font-semibold text-amber-700 cursor-pointer">Xem công thức</summary>
        <p className="text-sm text-stone-700 mt-2 whitespace-pre-wrap">{meal.recipe}</p>
    </details>
  </div>
);

const MealPlanner: React.FC<MealPlannerProps> = ({ foodItems }) => {
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSuggestions = useCallback(async () => {
    if (foodItems.length === 0) {
      setError("Bạn cần thêm thực phẩm vào kho trước khi nhận gợi ý.");
      return;
    }
    setIsLoading(true);
    setError('');
    setSuggestions([]);
    try {
      const result = await suggestMeals(foodItems);
      setSuggestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn.');
    } finally {
      setIsLoading(false);
    }
  }, [foodItems]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-stone-800">Gợi ý món ăn</h1>
      <button
        onClick={handleGetSuggestions}
        disabled={isLoading || foodItems.length === 0}
        className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'AI đang suy nghĩ...' : 'Tìm món ăn ngay!'}
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-stone-700">Kết quả từ AI</h2>
          {suggestions.map((meal, index) => (
            <MealSuggestionCard key={index} meal={meal} />
          ))}
        </div>
      )}

      {suggestions.length === 0 && !isLoading && foodItems.length > 0 && (
          <div className="text-center py-10 text-stone-500">
              <p>Nhấn nút "Tìm món ăn ngay!" để AI gợi ý bữa ăn cho bạn.</p>
          </div>
      )}
    </div>
  );
};

export default MealPlanner;