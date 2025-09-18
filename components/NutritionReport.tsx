
import React from 'react';
import { FamilyMember, NutritionReportData } from '../types';

interface NutritionReportProps {
  familyMembers: FamilyMember[];
  reports: NutritionReportData[];
  isLoading: boolean;
}

const ReportCard: React.FC<{ member: FamilyMember; report?: NutritionReportData }> = ({ member, report }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <h3 className="text-xl font-bold text-stone-800">{member.name}</h3>
    <p className="text-sm text-stone-500 mb-3">Mục tiêu: {member.goal}</p>
    
    {report ? (
      <>
        <div className="mb-3">
          <p className="font-semibold">Tóm tắt từ AI:</p>
          <p className="italic text-stone-700 bg-stone-100 p-2 rounded-md">"{report.summary}"</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="font-semibold">Calories TB:</span> {report.averageCalories} kcal</p>
          <p><span className="font-semibold">Đạm TB:</span> {report.averageProtein}g</p>
          <p><span className="font-semibold">Carbs TB:</span> {report.averageCarbs}g</p>
          <p><span className="font-semibold">Béo TB:</span> {report.averageFat}g</p>
        </div>

        <div className="mt-3">
          <p className="font-semibold mb-1">Tiến độ mục tiêu:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${report.goalProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-right mt-1">{report.goalProgress}%</p>
        </div>
      </>
    ) : (
      <p className="text-stone-500">Chưa có dữ liệu báo cáo.</p>
    )}
  </div>
);

const LoadingSkeleton = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
    </div>
);


const NutritionReport: React.FC<NutritionReportProps> = ({ familyMembers, reports, isLoading }) => {
  if (isLoading && reports.length === 0) {
    return (
      <div className="space-y-4">
        {familyMembers.map(member => <LoadingSkeleton key={member.id} />)}
      </div>
    );
  }

  if (familyMembers.length === 0) {
    return <p className="text-center text-stone-500 mt-8">Chưa có thành viên nào trong gia đình.</p>;
  }

  return (
    <div className="space-y-4">
      {familyMembers.map(member => {
        const report = reports.find(r => r.memberId === member.id);
        return <ReportCard key={member.id} member={member} report={report} />;
      })}
    </div>
  );
};

export default NutritionReport;
