
import { GoogleGenAI, Chat, Type, GenerateContentResponse } from "@google/genai";
import { FoodItem, MealSuggestion, FamilyMember } from '../types';

// FIX: Initialize GoogleGenAI with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const model = 'gemini-2.5-flash';

export const suggestMeals = async (foodItems: FoodItem[]): Promise<MealSuggestion[]> => {
  const ingredients = foodItems.map(item => `${item.name} (${item.quantity})`).join(', ');

  const prompt = `Dựa vào danh sách nguyên liệu có sẵn sau đây, hãy gợi ý 3 thực đơn. 
Nguyên liệu: ${ingredients}.
Với mỗi thực đơn, hãy cung cấp tên món ăn, mô tả ngắn, danh sách nguyên liệu chính cần dùng từ danh sách trên, công thức đơn giản, và giá trị dinh dưỡng ước tính (calo, đạm, carb, béo).
Hãy trả lời bằng tiếng Việt.`;

  try {
    // FIX: Use ai.models.generateContent with a response schema for structured JSON output.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredientsNeeded: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recipe: { type: Type.STRING },
              nutrition: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.STRING },
                  protein: { type: Type.STRING },
                  carbs: { type: Type.STRING },
                  fat: { type: Type.STRING },
                },
                required: ['calories', 'protein', 'carbs', 'fat'],
              },
            },
            required: ['name', 'description', 'ingredientsNeeded', 'recipe', 'nutrition'],
          },
        },
      },
    });
    
    // FIX: Access the .text property and parse the JSON.
    const jsonString = response.text;
    const suggestions = JSON.parse(jsonString);
    return suggestions;

  } catch (error) {
    console.error("Error suggesting meals:", error);
    throw new Error("Không thể nhận gợi ý từ AI. Vui lòng thử lại.");
  }
};


export const startChat = (): Chat => {
  // FIX: Use ai.chats.create to initialize a chat session.
  const chat = ai.chats.create({
    model: model,
    config: {
        systemInstruction: 'Bạn là một trợ lý dinh dưỡng AI thân thiện và hữu ích. Bạn có thể cung cấp công thức nấu ăn, thông tin dinh dưỡng và trả lời các câu hỏi về ăn uống lành mạnh. Câu trả lời của bạn phải rõ ràng, súc tích và mang tính khích lệ. Hãy trả lời bằng tiếng Việt.',
    }
  });
  return chat;
};

export const generateNutritionReportSummary = async (member: FamilyMember): Promise<string> => {
    const prompt = `Phân tích hồ sơ người dùng sau và tạo một bản tóm tắt báo cáo dinh dưỡng hàng tuần. 
    Người dùng: ${member.name}, Tuổi: ${member.age}, Mục tiêu: ${member.goal}. 
    Bản tóm tắt phải mang tính khích lệ và cung cấp một hoặc hai mẹo đơn giản để giúp họ đạt được mục tiêu. Giữ bản tóm tắt dưới 50 từ và trả lời bằng tiếng Việt.`;

    try {
        // FIX: Use ai.models.generateContent to get a text summary.
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        // FIX: Access the .text property for the response.
        return response.text;
    } catch (error) {
        console.error(`Error generating report for ${member.name}:`, error);
        return "Không thể tạo nhận xét từ AI do lỗi.";
    }
}
