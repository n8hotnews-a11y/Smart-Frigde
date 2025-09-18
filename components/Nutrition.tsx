import React, { useState, useEffect } from 'react';
import { FamilyMember, NutritionReportData } from '../types';
import { generateNutritionReportSummary } from '../services/geminiService';
import NutritionReport from './NutritionReport';

interface NutritionProps {
  familyMembers: FamilyMember[];
}

const Nutrition: React.FC<NutritionProps> = ({ familyMembers }) => {
  const [reports, setReports] = useState<NutritionReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateReports = async () => {
      if (!familyMembers || familyMembers.length === 0) return;

      setIsLoading(true);
      
      const reportPromises = familyMembers.map(async (member) => {
        try {
          const summary = await generateNutritionReportSummary(member);
          // Mocking numeric data as we don't have meal logging
          return {
            memberId: member.id,
            period: 'weekly' as const,
            averageCalories: Math.floor(Math.random() * 500) + 1800,
            averageProtein: Math.floor(Math.random() * 20) + 70,
            averageCarbs: Math.floor(Math.random() * 50) + 200,
            averageFat: Math.floor(Math.random() * 20) + 60,
            goalProgress: Math.floor(Math.random() * 50) + 25,
            summary: summary,
          };
        } catch (error) {
          console.error(`Failed to generate report for ${member.name}`, error);
          // Add a report with an error message
          return {
            memberId: member.id,
            period: 'weekly' as const,
            averageCalories: 0,
            averageProtein: 0,
            averageCarbs: 0,
            averageFat: 0,
            goalProgress: 0,
            summary: "Không thể tạo báo cáo do có lỗi xảy ra.",
          };
        }
      });

      const generatedReports = await Promise.all(reportPromises);
      setReports(generatedReports);
      setIsLoading(false);
    };

    generateReports();
  }, [familyMembers]);

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-2xl font-bold text-stone-800">Báo cáo Dinh dưỡng</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-stone-700 mb-3">Tổng quan gia đình</h2>
        <p className="text-sm text-stone-600 mb-4">
          Đây là báo cáo dinh dưỡng hàng tuần được tạo bởi AI, dựa trên mục tiêu của mỗi thành viên.
        </p>
        <NutritionReport 
          familyMembers={familyMembers}
          reports={reports}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Nutrition;
