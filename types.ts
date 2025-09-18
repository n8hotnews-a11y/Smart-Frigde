export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate: string;
  storage: 'Tủ lạnh' | 'Tủ đông' | 'Kệ bếp';
  imageUrl?: string; // Image as a data URL
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  goal: string; // e.g., 'Tăng cân', 'Giảm cân', 'Duy trì sức khỏe'
}

export interface MealSuggestion {
  name: string;
  description: string;
  ingredientsNeeded: string[];
  recipe: string;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export enum Tab {
  Dashboard = 'Trang chủ',
  Inventory = 'Kho',
  MealPlanner = 'Gợi ý món',
  Nutrition = 'Dinh dưỡng',
  Chatbot = 'Trợ lý AI',
}

export interface NutritionReportData {
  memberId: string;
  period: 'weekly' | 'monthly';
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  goalProgress: number; // A percentage from 0 to 100
  summary: string; // AI-generated summary
}
