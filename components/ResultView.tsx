
import React, { useEffect, useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell
} from 'recharts';
import { CATEGORIES } from '../constants';
import { getAnalysisFromAI } from '../services/geminiService';

interface ResultViewProps {
  answers: Record<number, number>;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ answers, onReset }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const processedData = CATEGORIES.map(cat => {
    const subFactors = cat.subFactors.map(sf => {
      const score = sf.questionIds.reduce((sum, qId) => sum + (answers[qId] || 0), 0);
      return {
        label: sf.label,
        score: score, // Max 15 per subfactor (3 questions * 5 points)
      };
    });
    
    const totalCategoryScore = subFactors.reduce((sum, sf) => sum + sf.score, 0);

    return {
      name: cat.name,
      color: cat.color,
      total: totalCategoryScore,
      subFactors: subFactors
    };
  });

  // Radar chart needs flattened data
  const radarData = processedData.flatMap(cat => cat.subFactors.map(sf => ({
    subject: sf.label,
    A: sf.score,
    fullMark: 15,
  })));

  useEffect(() => {
    const analyze = async () => {
      setLoading(true);
      const res = await getAnalysisFromAI(processedData);
      setAiAnalysis(res || "");
      setLoading(false);
    };
    analyze();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Balance Leadership 진단 결과</h1>
        <p className="text-slate-500 text-lg">귀하의 리더십 균형과 특성을 한눈에 확인하세요.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Radar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
            <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
            종합 역량 다이어그램
          </h3>
          <div className="flex-grow min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 15]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Totals */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
            <span className="w-2 h-6 bg-purple-600 rounded-full mr-3"></span>
            핵심 영역별 점수
          </h3>
          <div className="flex-grow min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData} layout="vertical">
                <XAxis type="number" domain={[0, 60]} hide />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip />
                <Bar dataKey="total" radius={[0, 10, 10, 0]}>
                  {processedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Detailed Feedback */}
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" />
            <path d="M12,6a6,6,0,1,0,6,6A6,6,0,0,0,12,6Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,12,16Z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold mb-8 text-slate-900 flex items-center">
          <span className="bg-blue-100 p-2 rounded-lg mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          AI 리더십 코칭 리포트
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">심층 분석 데이터를 생성 중입니다...</p>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {aiAnalysis}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.print()}
          className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          결과 PDF 저장 / 인쇄
        </button>
        <button
          onClick={onReset}
          className="bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          다시 진단하기
        </button>
      </div>
    </div>
  );
};

export default ResultView;
