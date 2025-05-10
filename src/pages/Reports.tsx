import React, { useState } from 'react';
import { PieChart, BarChart2, Calendar, Download } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useData } from '../context/DataContext';
import ExpenseChart from '../components/charts/ExpenseChart';
import BudgetChart from '../components/charts/BudgetChart';

const Reports: React.FC = () => {
  const { 
    expenses, 
    getExpenseSummary, 
    getBudgetStatus,
    categories
  } = useData();
  
  const [reportType, setReportType] = useState('expenses');
  const [period, setPeriod] = useState('month');
  
  // Get filtered expenses based on the selected period
  const getFilteredExpenses = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return expenses.filter(expense => new Date(expense.date) >= startDate);
  };
  
  const filteredExpenses = getFilteredExpenses();
  
  // Calculate total expense amount for the period
  const totalExpenseAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Get expense summary by category
  const expenseSummary = getExpenseSummary().filter(summary => {
    return filteredExpenses.some(expense => {
      const category = categories.find(c => c.id === expense.categoryId);
      return category?.name === summary.category;
    });
  });
  
  // Get budget status
  const budgetStatus = getBudgetStatus();
  
  // Get highest spending category
  const highestSpendingCategory = expenseSummary.length > 0 
    ? expenseSummary.reduce((prev, current) => (prev.amount > current.amount) ? prev : current)
    : null;
  
  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
            <p className="mt-1 text-gray-600">Analyze your financial data and spending patterns</p>
          </div>
        </div>

        <Card className="mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Select
                options={[
                  { value: 'expenses', label: 'Expense Analysis' },
                  { value: 'budgets', label: 'Budget Status' },
                ]}
                value={reportType}
                onChange={setReportType}
                fullWidth
              />
            </div>
            <div className="flex-1">
              <Select
                options={[
                  { value: 'week', label: 'Last 7 Days' },
                  { value: 'month', label: 'Last 30 Days' },
                  { value: 'quarter', label: 'Last 3 Months' },
                  { value: 'year', label: 'Last 12 Months' },
                ]}
                value={period}
                onChange={setPeriod}
                fullWidth
              />
            </div>
            <Button variant="outline" className="flex-shrink-0">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </Card>

        {reportType === 'expenses' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50 mr-4">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                    <p className="text-2xl font-semibold text-gray-900">${totalExpenseAmount.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-50 mr-4">
                    <PieChart className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
                    <p className="text-2xl font-semibold text-gray-900">{filteredExpenses.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-50 mr-4">
                    <BarChart2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Top Category</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {highestSpendingCategory ? highestSpendingCategory.category : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Expense Breakdown by Category">
              {expenseSummary.length > 0 ? (
                <div className="mt-4">
                  <ExpenseChart data={expenseSummary} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <PieChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No expenses found for the selected period.
                  </p>
                </div>
              )}
            </Card>
          </>
        ) : (
          <Card title="Budget Status">
            {budgetStatus.length > 0 ? (
              <div className="mt-4">
                <BudgetChart data={budgetStatus} />
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No budget data available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't set up any budgets yet.
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;