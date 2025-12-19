
import { GoogleGenAI } from "@google/genai";

export async function getAnalysisFromAI(results: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    당신은 세계적인 리더십 코치입니다. 다음의 'Balance Leadership' 진단 결과를 분석하고 전문적인 피드백을 한국어로 작성해주세요.
    
    진단 데이터:
    ${JSON.stringify(results, null, 2)}
    
    피드백 포함 사항:
    1. 현재 리더십 스타일의 강점 (가장 점수가 높은 영역 중심)
    2. 개선이 필요한 영역 (가장 점수가 낮은 영역 중심)
    3. 구체적인 행동 실천 가이드 3가지
    4. 향후 성장을 위한 추천 역량 개발 방향
    
    친절하고 전문적인 어조로 작성해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "AI 분석을 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.";
  }
}
