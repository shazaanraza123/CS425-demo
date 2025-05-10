import React from 'react';
import { ExpenseSummary } from '../../types';

interface ExpenseChartProps {
  data: ExpenseSummary[];
}

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-6 flex w-full rounded-lg overflow-hidden">
        {data.map((item, index) => (
          <div
            key={item.category}
            className={`${colors[index % colors.length]} h-full`}
            style={{ width: `${item.percentage}%` }}
            title={`${item.category}: $${item.amount.toFixed(2)} (${item.percentage.toFixed(1)}%)`}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center space-x-2">
            <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-sm`} />
            <div className="text-sm">
              <span className="font-medium">{item.category}</span>
              <span className="text-gray-500 ml-1">
                ${item.amount.toFixed(0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;