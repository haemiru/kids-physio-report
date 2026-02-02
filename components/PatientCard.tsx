
import React from 'react';
import { Patient } from '../types';

interface PatientCardProps {
  patient: Patient;
  isSelected: boolean;
  onSelect: (p: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(patient)}
      className={`w-full flex items-center p-4 rounded-xl border-2 transition-all text-left ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white shadow-sm hover:shadow-md'
      }`}
    >
      <img
        src={patient.imageUrl}
        alt={patient.name}
        className="w-14 h-14 rounded-full object-cover mr-4"
      />
      <div>
        <h3 className="font-bold text-slate-800">{patient.name} ({patient.age}세)</h3>
        <p className="text-xs text-slate-500">{patient.diagnosis}</p>
        <p className="text-[10px] text-slate-400 mt-1">보호자: {patient.guardianName}</p>
      </div>
    </button>
  );
};
