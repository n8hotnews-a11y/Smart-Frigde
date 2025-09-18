import { GoogleGenAI, Chat, Type } from "@google/genai";
import { FoodItem, FamilyMember, MealSuggestion } from '../types';

// FIX: Initialize the GoogleGenAI client according to the new API guidelines.
// The API key is sourced from environment variables, as per requirements.
// It is assumed that process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Use the recommended model 'gemini-2.5-flash' for general text tasks.
const model = 'gemini-2.5-flash';

/**
 * Suggests meals based on a list of available food items using the Gemini API.
 * It requests a structured JSON response.
 * @param foodItems - An array of food items available in the inventory.
 * @returns A promise that resolves to an array of meal suggestions.
 */
export const suggestMeals = async (foodItems: FoodItem[]): Promise<MealSuggestion[]> => {
  const availableIngredients = foodItems.map(item => `${item.name} (${item.quantity})`).join(', ');
  
  const prompt = `Dựa trên các nguyên liệu có sẵn sau đây: ${availableIngredients}, hãy gợi ý 3 món ăn ngon và đơn giản cho một gia đình Việt. Với mỗi món ăn, hãy cung cấp: tên món, mô tả ngắn gọn, danh sách nguyên liệu cần thiết (chỉ từ danh sách được cung cấp), công thức nấu ăn chi tiết từng bước, và thông tin dinh dưỡng ước tính (calo, đạm, carb, béo).`;

  try {
    // FIX: Use ai.models.generateContent with a JSON schema for structured output.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'Tên của món ăn.',
              },
              description: {
                type: Type.STRING,
                description: 'Mô tả ngắn gọn, hấp dẫn về món ăn.',
              },
              ingredientsNeeded: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'Danh sách các nguyên liệu cần thiết cho món ăn, chỉ lấy từ danh sách được cung cấp.',
              },
              recipe: {
                type: Type.STRING,
                description: 'Các bước chi tiết để nấu món ăn.',
              },
              nutrition: {
                type: Type.OBJECT,
                required: ["calories", "protein", "carbs", "fat"],
                properties: {
                  calories: { type: Type.STRING, description: 'Lượng calo ước tính.' },
                  protein: { type: Type.STRING, description: 'Lượng đạm ước tính (gam).' },
                  carbs: { type: Type.STRING, description: 'Lượng carb ước tính (gam).' },
                  fat: { type: Type.STRING, description: 'Lượng béo ước tính (gam).' },
                },
                description: 'Thông tin dinh dưỡng ước tính cho một khẩu phần ăn.',
              },
            },
          },
        },
      },
    });

    // FIX: Extract text from the response using the .text property.
    const jsonString = response.text.trim();
    if (!jsonString) {
      console.error("AI returned an empty response for meal suggestion.");
      throw new Error("AI không trả về phản hồi hợp lệ.");
    }

    return JSON.parse(jsonString) as MealSuggestion[];

  } catch (error) {
    console.error("Error suggesting meals:", error);
    throw new Error("Không thể nhận gợi ý từ AI. Vui lòng thử lại sau.");
  }
};

/**
 * Generates a weekly nutritional report summary for a family member.
 * @param member - The family member for whom to generate the report.
 * @returns A promise that resolves to a string containing the AI-generated summary.
 */
export const generateNutritionReportSummary = async (member: FamilyMember): Promise<string> => {
  const prompt = `Viết một đoạn tóm tắt ngắn gọn (khoảng 2-3 câu) về tình hình dinh dưỡng trong tuần qua cho ${member.name}, ${member.age} tuổi, với mục tiêu là "${member.goal}". Đưa ra một lời khuyên tích cực và một gợi ý nhỏ để cải thiện cho tuần tới. Giọng văn thân thiện và khích lệ.`;

  try {
    // FIX: Use ai.models.generateContent for text generation.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // FIX: Extract text from the response using the .text property.
    return response.text;
  } catch (error) {
    console.error(`Error generating nutrition report for ${member.name}:`, error);
    throw new Error("Không thể tạo báo cáo dinh dưỡng.");
  }
};

/**
 * Initializes and starts a new chat session with a pre-defined system instruction.
 * @returns A Chat object for interactive conversation.
 */
export const startChat = (): Chat => {
  // FIX: Use ai.chats.create to start a new chat session.
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: 'Bạn là một trợ lý AI chuyên về dinh dưỡng và sức khỏe gia đình Việt. Hãy trả lời các câu hỏi một cách thân thiện, chính xác và cung cấp các lời khuyên hữu ích, an toàn. Tên bạn là "Trợ lý Dinh dưỡng".',
    },
  });
  return chat;
};
