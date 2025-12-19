
import React, { useState, useMemo } from 'react';
import { QUESTIONS } from './constants';
import QuestionItem from './components/QuestionItem';
import ResultView from './components/ResultView';

const ITEMS_PER_PAGE = 8;

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  const totalPages = Math.ceil(QUESTIONS.length / ITEMS_PER_PAGE);

  const handleAnswer = (id: number, value: number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const currentQuestions = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return QUESTIONS.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  const canGoNext = useMemo(() => {
    return currentQuestions.every(q => answers[q.id] !== undefined);
  }, [currentQuestions, answers]);

  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsComplete(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetAll = () => {
    setIsStarted(false);
    setCurrentPage(0);
    setAnswers({});
    setIsComplete(false);
  };

  if (isComplete) {
    return <ResultView answers={answers} onReset={resetAll} />;
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-blue-50 rounded-full">
              <svg className="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Balance Leadership</h1>
          <h2 className="text-xl font-medium text-slate-500 mb-8">리더십 밸런스 역량 진단</h2>
          <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl mb-10">
            <p className="text-slate-600 leading-relaxed flex items-start">
              <span className="text-blue-500 font-bold mr-2">✓</span>
              본 진단은 총 48문항으로 구성되어 있으며 약 5~10분 정도 소요됩니다.
            </p>
            <p className="text-slate-600 leading-relaxed flex items-start">
              <span className="text-blue-500 font-bold mr-2">✓</span>
              현재 자신의 평소 행동과 가장 가까운 항목을 선택해 주세요.
            </p>
            <p className="text-slate-600 leading-relaxed flex items-start">
              <span className="text-blue-500 font-bold mr-2">✓</span>
              진단 결과는 논리, 카리스마, 자각, 감성의 4대 영역으로 분석됩니다.
            </p>
          </div>
          <button
            onClick={() => setIsStarted(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1"
          >
            진단 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Header with Progress */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
              Page {currentPage + 1} / {totalPages}
            </span>
            <span className="text-sm font-medium text-slate-400">
              {Object.keys(answers).length} / {QUESTIONS.length} Questions Answered
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        {currentQuestions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={handleAnswer}
          />
        ))}

        <div className="flex items-center justify-between pt-10">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              currentPage === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-white hover:shadow-md'
            }`}
          >
            이전
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`px-12 py-4 rounded-2xl font-bold transition-all shadow-xl ${
              canGoNext
                ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-1'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {currentPage === totalPages - 1 ? '결과 확인하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
