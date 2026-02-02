
import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_PATIENTS, ICONS } from './constants';
import { Patient, SurvivalRecord, AIAnalysisResult, MealStatus, BowelStatus } from './types';
import { PatientCard } from './components/PatientCard';
import { ConditionForm } from './components/ConditionForm';
import { TrendsChart } from './components/TrendsChart';
import { AIConsultant } from './components/AIConsultant';
import { analyzeHealthTrends } from './services/geminiService';

const mealStatusLabels: Record<MealStatus, string> = {
  [MealStatus.EXCELLENT]: '매우 좋음',
  [MealStatus.GOOD]: '좋음',
  [MealStatus.FAIR]: '보통',
  [MealStatus.POOR]: '부족함'
};

const bowelStatusLabels: Record<BowelStatus, string> = {
  [BowelStatus.NORMAL]: '정상',
  [BowelStatus.CONSTIPATED]: '변비',
  [BowelStatus.DIARRHEA]: '설사',
  [BowelStatus.NONE]: '없음'
};

const App: React.FC = () => {
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(MOCK_PATIENTS[0]);
  const [records, setRecords] = useState<SurvivalRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  // Generate some mock history for the selected patient
  const generateMockHistory = useCallback((patientId: string) => {
    const history: SurvivalRecord[] = [];
    const today = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      history.push({
        id: `r-${i}`,
        patientId,
        date: d.toISOString().split('T')[0],
        respiratoryRate: 18 + Math.floor(Math.random() * 10),
        mealStatus: [MealStatus.EXCELLENT, MealStatus.GOOD, MealStatus.FAIR][Math.floor(Math.random() * 3)],
        mealAmount: 60 + Math.floor(Math.random() * 40),
        exerciseMinutes: 15 + Math.floor(Math.random() * 45),
        bowelStatus: BowelStatus.NORMAL,
        sleepHours: 7 + Math.floor(Math.random() * 4),
        notes: '정상적인 치료 세션 진행됨.',
        therapistId: 't1'
      });
    }
    setRecords(history);
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      generateMockHistory(selectedPatient.id);
      setAiAnalysis(null);
    }
  }, [selectedPatient, generateMockHistory]);

  const handleAddRecord = (data: Partial<SurvivalRecord>) => {
    const newRecord: SurvivalRecord = {
      id: Date.now().toString(),
      patientId: selectedPatient!.id,
      date: new Date().toISOString().split('T')[0],
      therapistId: 't1',
      respiratoryRate: data.respiratoryRate || 20,
      mealStatus: data.mealStatus as any,
      mealAmount: data.mealAmount || 0,
      exerciseMinutes: data.exerciseMinutes || 0,
      bowelStatus: data.bowelStatus as any,
      sleepHours: data.sleepHours || 0,
      notes: data.notes || ''
    };
    setRecords([...records, newRecord]);
    setShowForm(false);
  };

  const handleRunAnalysis = async () => {
    if (!selectedPatient || records.length === 0) return;
    setIsAnalyzing(true);
    const result = await analyzeHealthTrends(records, selectedPatient.name);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar: Patient List */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center space-x-2 px-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <ICONS.Activity className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">CP-Tracker</h1>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">대상 아동 명단</h2>
          {patients.map(p => (
            <PatientCard
              key={p.id}
              patient={p}
              isSelected={selectedPatient?.id === p.id}
              onSelect={setSelectedPatient}
            />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        {selectedPatient ? (
          <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">진료 중인 아동</span>
                  <span className="text-slate-400 text-sm">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-800">{selectedPatient.name} 아동 건강 대시보드</h2>
                <p className="text-slate-500 mt-1">{selectedPatient.diagnosis} | 전문 재활 치료용 관리 도구</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleRunAnalysis}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center"
                >
                  <ICONS.Stethoscope className="w-4 h-4 mr-2" />
                  AI 컨디션 분석
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center"
                >
                  <ICONS.Calendar className="w-4 h-4 mr-2" />
                  데일리 기록 추가
                </button>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left & Middle columns */}
              <div className="lg:col-span-2 space-y-8">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '평균 호흡수', value: `${records.length > 0 ? Math.round(records.reduce((acc, r) => acc + r.respiratoryRate, 0) / records.length) : 0} bpm`, icon: <ICONS.Heart className="text-red-500" />, color: 'bg-red-50' },
                    { label: '최근 식사량', value: `${records.length > 0 ? records[records.length-1]?.mealAmount : 0}%`, icon: <ICONS.Coffee className="text-orange-500" />, color: 'bg-orange-50' },
                    { label: '평균 운동량', value: `${records.length > 0 ? Math.round(records.reduce((acc, r) => acc + r.exerciseMinutes, 0) / records.length) : 0}분`, icon: <ICONS.Activity className="text-blue-500" />, color: 'bg-blue-50' },
                    { label: '평균 수면', value: `${records.length > 0 ? (records.reduce((acc, r) => acc + r.sleepHours, 0) / records.length).toFixed(1) : 0}시간`, icon: <ICONS.Check className="text-green-500" />, color: 'bg-green-50' },
                  ].map((stat, i) => (
                    <div key={i} className={`${stat.color} p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center text-center`}>
                      <div className="p-2 bg-white rounded-full mb-2 shadow-sm">{stat.icon}</div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                      <span className="text-lg font-black text-slate-800">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Trend Charts */}
                <TrendsChart records={records} />

                {/* Recent Logs Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">최근 Survival Condition 상세 기록</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-3">날짜</th>
                          <th className="px-6 py-3">호흡수</th>
                          <th className="px-6 py-3">식사 상태</th>
                          <th className="px-6 py-3">운동 시간</th>
                          <th className="px-6 py-3">배변 상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[...records].reverse().slice(0, 10).map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-700">{record.date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold ${record.respiratoryRate > 30 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                {record.respiratoryRate} bpm
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-600">{mealStatusLabels[record.mealStatus]}</span>
                                <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                  <div className="bg-orange-500 h-full" style={{ width: `${record.mealAmount}%` }} />
                                </div>
                                <span className="text-[10px] text-slate-400 mt-0.5">{record.mealAmount}% 섭취</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-600">{record.exerciseMinutes}분</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${record.bowelStatus === BowelStatus.NORMAL ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                {bowelStatusLabels[record.bowelStatus]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right column: AI analysis */}
              <div className="space-y-8">
                <AIConsultant analysis={aiAnalysis} loading={isAnalyzing} />

                {/* Patient Profile Quick Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">비상 연락망 및 보호자</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                      <span className="text-slate-400">보호자 성함</span>
                      <span className="font-medium">{selectedPatient.guardianName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                      <span className="text-slate-400">연락처</span>
                      <span className="font-medium">{selectedPatient.contact}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">최근 치료일</span>
                      <span className="font-medium">2025.05.20</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-2 border border-slate-600 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                    상세 병력 로그 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <ICONS.Activity className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-bold">아동을 선택해주세요</h2>
            <p className="max-w-xs mt-2">좌측 명단에서 관리하고자 하는 아동을 선택하면 상세 survival condition 차트와 AI 분석을 확인하실 수 있습니다.</p>
          </div>
        )}

        {/* Modal Overlay for Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
              <ConditionForm
                onSubmit={handleAddRecord}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
