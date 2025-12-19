
import React from 'react';
import { Question } from '../types';

interface QuestionItemProps {
  question: Question;
  value: number;
  onChange: (id: number, value: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, value, onChange }) => {
  const options = [
    { label: "전혀 아니다", value: 1 },
    { label: "대체로 아니다", value: 2 },
    { label: "보통이다", value: 3 },
    { label: "대체로 그렇다", value: 4 },
    { label: "매우 그렇다", value: 5 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:border-blue-300">
      <p className="text-lg font-semibold text-slate-800 mb-6 leading-relaxed">
        <span className="text-blue-600 mr-2 font-bold">{question.id}.</span>
        {question.text}
      </p>
      
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(question.id, opt.value)}
            className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-200 group ${
              value === opt.value
                ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`text-xl font-bold mb-1 ${value === opt.value ? 'text-white' : 'text-slate-700'}`}>
              {opt.value}
            </span>
            <span className="text-[10px] md:text-xs text-center font-medium opacity-80">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionItem;
