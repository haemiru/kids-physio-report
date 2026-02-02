
import React from 'react';
import { AIAnalysisResult } from '../types';
import { ICONS } from '../constants';

interface AIConsultantProps {
  analysis: AIAnalysisResult | null;
  loading: boolean;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 animate-pulse">
        <ICONS.Activity className="text-indigo-600 animate-spin" />
        <p className="text-indigo-700 font-medium">Gemini AI가 건강 추이를 분석 중입니다...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center">
        <p className="text-slate-500">데이터를 분석하려면 분석 버튼을 클릭하세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-indigo-100 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white flex items-center space-x-2">
        <ICONS.Stethoscope className="w-5 h-5" />
        <h3 className="font-bold">AI 발달 재활 어드바이저</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <section>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">종합 건강 요약</h4>
          <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
        </section>

        {analysis.warnings.length > 0 && (
          <section>
            <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center">
               <span className="mr-2">⚠️</span> 주의가 필요한 사항
            </h4>
            <ul className="space-y-2">
              {analysis.warnings.map((w, idx) => (
                <li key={idx} className="bg-red-50 text-red-700 p-2 rounded-lg text-sm border-l-4 border-red-400">
                  {w}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-2">💡</span> 치료 및 관리 추천
          </h4>
          <ul className="space-y-3">
            {analysis.recommendations.map((r, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700">
                <div className="mt-1 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-[10px]">{idx + 1}</span>
                </div>
                <p>{r}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
