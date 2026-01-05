
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry } from "../types";

export const getAIHealthInsights = async (entries: LogEntry[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API 密鑰未設置，無法獲取 AI 分析。";
  }

  if (entries.length === 0) {
    return "尚無數據可供分析。請先開始記錄您的飲水與排尿量。";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare data for context
  const recentLogs = entries.slice(0, 50).map(e => ({
    time: e.timestamp,
    type: e.type,
    amount: e.amount,
    note: e.note || ""
  }));

  const prompt = `
    以下是我的每日飲水及排尿記錄（最近 50 筆）：
    ${JSON.stringify(recentLogs)}

    請根據這些數據提供一段簡短的健康建議（不超過 200 字）。
    請關注：
    1. 飲水頻率是否均勻。
    2. 飲水量與排尿量是否平衡（水分攝入通常應略大於尿量，因為還有汗液與呼吸蒸發）。
    3. 基於記錄中的備註，是否有任何特殊模式。
    4. 給予具體的、鼓勵性的行動建議。
    請使用正體中文回答，口氣像是一個專業且親切的健康管理師。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "無法生成分析結果。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "獲取 AI 分析時發生錯誤，請稍後再試。";
  }
};
