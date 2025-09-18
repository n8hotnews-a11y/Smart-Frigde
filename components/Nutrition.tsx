
import React, { useState, useEffect } from 'react';
import { FamilyMember, NutritionReportData } from '../types';
import NutritionReport from './NutritionReport';
import { generateNutritionReportSummary } from '../services/geminiService';

interface NutritionProps {
  familyMembers: FamilyMember[];
}

const Nutrition: React.FC<NutritionProps> = ({ familyMembers }) => {
  const [reports, setReports] = useState<NutritionReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to generate mock data and fetch AI summary
  const generateReports = async () => {
    if (familyMembers.length === 0) return;

    setIsLoading(true);
    setError(null);
    try {
      const generatedReports = await Promise.all(
        familyMembers.map(async (member) => {
          const summary = await generateNutritionReportSummary(member);
          // Mocking other data for demonstration
          return {
            memberId: member.id,
            period: 'weekly' as 'weekly' | 'monthly',
            averageCalories: Math.floor(Math.random() * 500) + 1800,
            averageProtein: Math.floor(Math.random() * 30) + 70,
            averageCarbs: Math.floor(Math.random() * 50) + 200,
            averageFat: Math.floor(Math.random() * 20) + 60,
            goalProgress: Math.floor(Math.random() * 40) + 50,
            summary: summary,
          };
        })
      );
      setReports(generatedReports);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Không thể tạo báo cáo dinh dưỡng.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate reports on initial load
  useEffect(() => {
    generateReports();
  }, [familyMembers]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-stone-800">Dinh dưỡng</h1>
        <button
          onClick={generateReports}
          disabled={isLoading}
          className="text-sm bg-orange-100 text-orange-800 font-semibold py-1 px-3 rounded-full hover:bg-orange-200 disabled:opacity-50"
        >
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>
      <p className="text-stone-600 mb-6">Theo dõi và phân tích tình hình dinh dưỡng của cả gia đình với sự trợ giúp của AI.</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <NutritionReport 
        familyMembers={familyMembers}
        reports={reports}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Nutrition;
