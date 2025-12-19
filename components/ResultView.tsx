
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { CATEGORIES } from '../constants';

interface ResultViewProps {
  answers: Record<number, number>;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ answers, onReset }) => {
  const processedData = CATEGORIES.map(cat => {
    const subFactors = cat.subFactors.map(sf => {
      const scores = sf.questionIds.map(qId => answers[qId] || 0);
      const totalScore = scores.reduce((a, b) => a + b, 0);
      return {
        label: sf.label,
        score: totalScore,
        questionIds: sf.questionIds,
        individualScores: scores,
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

  const radarData = processedData.flatMap(cat => cat.subFactors.map(sf => ({
    subject: sf.label,
    A: sf.score,
    fullMark: 15,
  })));

  const getDevelopmentDirection = (categoryName: string) => {
    switch (categoryName) {
      case "논리적 설득 (Logical Persuasion)":
        return "데이터 기반의 설득력을 강화하고, 복잡한 정보를 구조화하여 전달하는 훈련이 필요합니다. 명확한 결론 도출 역량을 키우세요.";
      case "카리스마 (Charisma)":
        return "자신감 있는 비언어적 소통과 확신에 찬 메시지 전달력을 높여야 합니다. 긍정적인 영향력으로 팀의 동기를 부여하는 연습이 중요합니다.";
      case "자각 유도 (Self-Awareness)":
        return "코칭형 리더십으로 전환하기 위해 질문 기법과 적극적 경청 기술을 연마해야 합니다. 상대방 스스로 답을 찾게 하는 여유가 필요합니다.";
      case "감성 합일 (Emotional Unity)":
        return "정서적 유대감을 형성하는 공감 능력을 키우고, 조직의 비전을 감성적인 스토리텔링으로 녹여내는 역량을 개발하세요.";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Balance Leadership 진단 리포트</h1>
        <p className="text-slate-500 text-lg">측정된 데이터를 기반으로 리더십 밸런스를 분석합니다.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Radar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
            <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
            종합 리더십 프로파일
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
            <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
            4대 핵심 역량 지표
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

      {/* Detailed Score Mapping */}
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <h3 className="text-2xl font-bold mb-8 text-slate-900 border-b pb-4">상세 스코어 산출 내역</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {processedData.map((cat) => (
            <div key={cat.name} className="space-y-4">
              <h4 className="font-bold text-lg flex items-center" style={{ color: cat.color }}>
                {cat.name}
              </h4>
              <div className="space-y-3 bg-slate-50 p-6 rounded-2xl">
                {cat.subFactors.map((sf) => (
                  <div key={sf.label} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium w-32">{sf.label}</span>
                    <span className="font-mono bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
                      {sf.score} = {sf.individualScores.join('+')} ({sf.questionIds.join('+')})
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 mt-2 flex justify-between font-bold">
                  <span>총점</span>
                  <span style={{ color: cat.color }}>{cat.total} / 60</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Development Direction */}
      <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl mb-12">
        <h3 className="text-2xl font-bold mb-8 flex items-center">
          <svg className="w-8 h-8 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          향후 역량 개발 방향
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {processedData.map((cat) => (
            <div key={cat.name} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h4 className="font-bold text-lg mb-3" style={{ color: cat.color }}>{cat.name}</h4>
              <p className="text-slate-300 leading-relaxed text-sm">
                {getDevelopmentDirection(cat.name)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4 no-print">
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

      <style>{`
        @media print {
          .no-print { display: none; }
          body { background: white; }
          .shadow-xl, .shadow-2xl { shadow: none; border: 1px solid #eee; }
        }
      `}</style>
    </div>
  );
};

export default ResultView;
