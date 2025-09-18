import React, { useState, useEffect } from 'react';
import { FamilyMember, NutritionReportData, Tab } from '../types';
import { generateNutritionReportSummary } from '../services/geminiService';
import NutritionReport from './NutritionReport';

// FIX: Define props for the Nutrition component to receive state from App.tsx
interface NutritionProps {
  familyMembers: FamilyMember[];
  setActiveTab: (tab: Tab) => void;
}

const Nutrition: React.FC<NutritionProps> = ({ familyMembers, setActiveTab }) => {
  const [reports, setReports] = useState<NutritionReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (familyMembers.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const generatedReports = await Promise.all(
        familyMembers.map(async (member) => {
          // Generate AI summary
          const summary = await generateNutritionReportSummary(member);
          
          // NOTE: Other report data is mocked for demonstration purposes.
          // In a real application, this data would come from a database of logged meals.
          return {
            memberId: member.id,
            period: 'weekly' as 'weekly' | 'monthly',
            averageCalories: Math.floor(Math.random() * 500) + 1800,
            averageProtein: Math.floor(Math.random() * 30) + 80,
            averageCarbs: Math.floor(Math.random() * 50) + 200,
            averageFat: Math.floor(Math.random() * 20) + 60,
            goalProgress: Math.floor(Math.random() * 40) + 50,
            summary: summary,
          };
        })
      );
      setReports(generatedReports);
      setIsLoading(false);
    };

    fetchReports();
  }, [familyMembers]);

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-2xl font-bold text-stone-800">Báo cáo Dinh dưỡng</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-stone-700 mb-3">Thành viên gia đình</h2>
        {familyMembers.length > 0 ? (
          <div className="space-y-3">
            {familyMembers.map(member => (
              <div key={member.id} className="p-3 bg-stone-50 rounded-md">
                <p className="font-medium text-stone-800">{member.name} <span className="text-sm font-normal text-stone-500">- {member.age} tuổi</span></p>
                <p className="text-sm text-stone-600">Mục tiêu: <span className="font-semibold text-orange-700">{member.goal}</span></p>
              </div>
            ))}
          </div>
        ) : (
            <p className="text-sm text-stone-500">Chưa có thành viên nào được thêm vào.</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-stone-700 mb-3">Phân tích hàng tuần</h2>
        <NutritionReport familyMembers={familyMembers} reports={reports} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Nutrition;
