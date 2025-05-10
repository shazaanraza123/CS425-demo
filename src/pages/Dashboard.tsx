import React from 'react';
import { PlusCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ExpenseChart from '../components/charts/ExpenseChart';
import BudgetChart from '../components/charts/BudgetChart';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    expenses, 
    budgets, 
    incomeSources,
    getExpenseSummary, 
    getBudgetStatus,
    getTotalIncome,
    getTotalExpenses
  } = useData();

  const expenseSummary = getExpenseSummary();
  const budgetStatus = getBudgetStatus();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/expenses/new">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
              <div className="p-1.5 rounded-full bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">${totalIncome.toFixed(2)}</span>
              <span className="ml-1 text-xs text-gray-500">/month</span>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>{incomeSources.length} source{incomeSources.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
              <div className="p-1.5 rounded-full bg-red-50">
                <TrendingUp className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</span>
              <span className="ml-1 text-xs text-gray-500">/30 days</span>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <div className="flex items-center text-red-500">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                <span>{expenses.length} transaction{expenses.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Balance</h3>
              <div className="p-1.5 rounded-full bg-blue-50">
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">${(totalIncome - totalExpenses).toFixed(2)}</span>
              <span className="ml-1 text-xs text-gray-500">/month</span>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <div className={`flex items-center ${totalIncome > totalExpenses ? 'text-green-500' : 'text-red-500'}`}>
                {totalIncome > totalExpenses ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>Positive balance</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <span>Negative balance</span>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Active Budgets</h3>
              <div className="p-1.5 rounded-full bg-purple-50">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">{budgets.length}</span>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Link to="/budgets" className="text-blue-600 hover:text-blue-500">
                Manage budgets
              </Link>
            </div>
          </Card>
        </div>

        {/* Charts and recent expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card title="Expense Breakdown" className="lg:col-span-2">
            <ExpenseChart data={expenseSummary} />
          </Card>

          <Card title="Budget Status" className="lg:col-span-1">
            <BudgetChart data={budgetStatus} />
          </Card>
          
          <Card title="Recent Expenses" className="lg:col-span-3">
            {recentExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentExpenses.map((expense) => {
                      const category = expense.categoryId;
                      return (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {category}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                            {expense.description || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                            -${expense.amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No recent expenses found.</p>
                <Link to="/expenses/new" className="mt-2 inline-block text-blue-600 hover:text-blue-500">
                  Add your first expense
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;