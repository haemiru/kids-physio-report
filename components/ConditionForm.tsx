
import React, { useState } from 'react';
import { MealStatus, BowelStatus, SurvivalRecord } from '../types';
import { ICONS } from '../constants';

interface ConditionFormProps {
  onSubmit: (data: Partial<SurvivalRecord>) => void;
  onCancel: () => void;
}

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

export const ConditionForm: React.FC<ConditionFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    respiratoryRate: 22,
    mealStatus: MealStatus.GOOD,
    mealAmount: 80,
    exerciseMinutes: 30,
    bowelStatus: BowelStatus.NORMAL,
    sleepHours: 8,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Survival Condition 기록 추가</h2>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <ICONS.Check className="rotate-45" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vital: Respiratory Rate */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">호흡수 (분당 횟수)</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="10"
              max="60"
              value={formData.respiratoryRate}
              onChange={(e) => setFormData({...formData, respiratoryRate: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-lg font-bold text-blue-600 w-12 text-center">{formData.respiratoryRate}</span>
          </div>
        </div>

        {/* Vital: Exercise */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">운동 시간 (분)</label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={formData.exerciseMinutes}
              onChange={(e) => setFormData({...formData, exerciseMinutes: parseInt(e.target.value)})}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-slate-50"
            />
          </div>
        </div>

        {/* Nutrition: Meal Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">식사 컨디션</label>
          <select
            value={formData.mealStatus}
            onChange={(e) => setFormData({...formData, mealStatus: e.target.value as MealStatus})}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-slate-50"
          >
            {Object.values(MealStatus).map(status => (
              <option key={status} value={status}>{mealStatusLabels[status]}</option>
            ))}
          </select>
        </div>

        {/* Nutrition: Meal Amount */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">식사량 (%)</label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="0"
              max="100"
              value={formData.mealAmount}
              onChange={(e) => setFormData({...formData, mealAmount: parseInt(e.target.value)})}
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-slate-50"
            />
          </div>
        </div>

        {/* Health: Bowel Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">배변 상태</label>
          <select
            value={formData.bowelStatus}
            onChange={(e) => setFormData({...formData, bowelStatus: e.target.value as BowelStatus})}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-slate-50"
          >
            {Object.values(BowelStatus).map(status => (
              <option key={status} value={status}>{bowelStatusLabels[status]}</option>
            ))}
          </select>
        </div>

        {/* Health: Sleep */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">수면 시간 (시간)</label>
          <input
            type="number"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) => setFormData({...formData, sleepHours: parseFloat(e.target.value)})}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-slate-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">치료 및 관찰 특이사항</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="치료 과정이나 일상에서 발견된 아동의 변화를 자유롭게 기록하세요..."
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-slate-50"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-md shadow-blue-200"
        >
          기록 저장하기
        </button>
      </div>
    </form>
  );
};
