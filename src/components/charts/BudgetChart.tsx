import React from 'react';
import { BudgetStatus } from '../../types';

interface BudgetChartProps {
  data: BudgetStatus[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No budget data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((budget) => {
        // Determine color based on percentage
        let colorClass = 'bg-green-500';
        if (budget.percentage >= 90) {
          colorClass = 'bg-red-500';
        } else if (budget.percentage >= 75) {
          colorClass = 'bg-yellow-500';
        }

        return (
          <div key={budget.category} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{budget.category}</span>
              <span>
                ${budget.spent.toFixed(0)} / ${budget.limit.toFixed(0)}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClass} transition-all duration-500 ease-in-out`}
                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetChart;