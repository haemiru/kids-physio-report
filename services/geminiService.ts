
import { GoogleGenAI, Type } from "@google/genai";
import { SurvivalRecord, AIAnalysisResult } from "../types";

export const analyzeHealthTrends = async (records: SurvivalRecord[], patientName: string): Promise<AIAnalysisResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recordsContext = records.map(r => 
    `Date: ${r.date}, Resp Rate: ${r.respiratoryRate}, Meal: ${r.mealStatus} (${r.mealAmount}%), Exercise: ${r.exerciseMinutes}min, Bowel: ${r.bowelStatus}, Sleep: ${r.sleepHours}hrs`
  ).join('\n');

  const prompt = `
    다음은 뇌성마비 아동인 ${patientName}의 7일간의 건강 기록입니다.
    "생존 조건 체크(Survival Condition Checks)"(활력 징후, 식단, 운동, 배변)에 집중하여 분석해 주세요.
    
    모든 분석 내용(요약, 경고, 추천 사항)은 반드시 **한국어**로 작성해야 합니다.
    
    분석 결과에는 다음이 포함되어야 합니다:
    1. 전문적인 종합 건강 요약 (summary)
    2. 잠재적인 건강 우려 사항이나 비정상적인 패턴에 대한 경고 (warnings)
    3. 재활 치료사를 위한 실질적인 권장 조치 3-4가지 (recommendations)

    기록 데이터:
    ${recordsContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Professional summary of the child's current health status in Korean." },
            warnings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of potential health concerns or abnormal patterns in Korean."
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable steps for the therapist in Korean."
            }
          },
          required: ["summary", "warnings", "recommendations"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as AIAnalysisResult;
    }
    return null;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};
