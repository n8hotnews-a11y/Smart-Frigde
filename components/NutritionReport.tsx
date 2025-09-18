import React from 'react';
import { FamilyMember, NutritionReportData } from '../types';

interface NutritionReportProps {
  familyMembers: FamilyMember[];
  reports: NutritionReportData[];
  isLoading: boolean;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div 
      className="bg-orange-500 h-2.5 rounded-full" 
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const NutritionReport: React.FC<NutritionReportProps> = ({ familyMembers, reports, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
        <p className="text-stone-500 mt-3">AI đang phân tích dữ liệu...</p>
      </div>
    );
  }

  if (reports.length === 0 && familyMembers.length > 0) {
    return (
      <div className="text-center py-4">
        <p className="text-stone-500">Chưa có dữ liệu báo cáo. Tính năng này sẽ hoạt động khi bạn bắt đầu ghi lại bữa ăn.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map(report => {
        const member = familyMembers.find(m => m.id === report.memberId);
        if (!member) return null;

        return (
          <div key={report.memberId} className="bg-stone-50 p-4 rounded-lg">
            <h4 className="font-semibold text-stone-800">{member.name} - <span className="font-normal text-orange-600">{member.goal}</span></h4>
            
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-600">Tiến độ mục tiêu</span>
                  <span className="font-medium text-orange-600">{report.goalProgress}%</span>
                </div>
                <ProgressBar progress={report.goalProgress} />
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-stone-600">
                  <p>Calo / ngày: <span className="font-medium text-stone-800">{report.averageCalories}</span></p>
                  <p>Đạm / ngày: <span className="font-medium text-stone-800">{report.averageProtein}g</span></p>
                  <p>Carb / ngày: <span className="font-medium text-stone-800">{report.averageCarbs}g</span></p>
                  <p>Béo / ngày: <span className="font-medium text-stone-800">{report.averageFat}g</span></p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-sm text-stone-700 italic">"{report.summary}"</p>
                <p className="text-right text-xs text-gray-400 mt-1">- Nhận xét từ Trợ lý AI -</p>
              </div>
            </div>
          </div>
        );
      })}
       <p className="text-xs text-center text-gray-400 pt-2">* Dữ liệu báo cáo hiện tại là giả lập để minh họa tính năng. Dữ liệu thực tế sẽ được cập nhật khi bạn ghi lại bữa ăn hàng ngày.</p>
    </div>
  );
};

export default NutritionReport;