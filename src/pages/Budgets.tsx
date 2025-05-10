import React, { useState } from 'react';
import { BarChart, PlusCircle, AlertCircle, Trash2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useData } from '../context/DataContext';

const Budgets: React.FC = () => {
  const { 
    categories, 
    budgets, 
    addBudget, 
    deleteBudget,
    getBudgetStatus, 
    getCategoryById 
  } = useData();
  
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [limitAmount, setLimitAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  });
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const budgetStatus = getBudgetStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!categoryId || !limitAmount || !startDate || !endDate || !alertThreshold) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(Number(limitAmount)) || Number(limitAmount) <= 0) {
      setError('Please enter a valid budget limit');
      return;
    }

    if (isNaN(Number(alertThreshold)) || Number(alertThreshold) < 0 || Number(alertThreshold) > 100) {
      setError('Alert threshold must be between 0 and 100');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date');
      return;
    }

    setIsSubmitting(true);

    try {
      addBudget({
        categoryId,
        limitAmount: Number(limitAmount),
        startDate,
        endDate,
        alertThreshold: Number(alertThreshold),
      });
      
      // Reset form
      setLimitAmount('');
      setAlertThreshold('80');
      setIsSubmitting(false);
    } catch (err) {
      setError('Failed to add budget. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
            <p className="mt-1 text-gray-600">Set and manage your spending limits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card title="Create New Budget" className="lg:col-span-1">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                id="category"
                label="Category"
                options={categories.map(category => ({
                  value: category.id,
                  label: category.name,
                }))}
                value={categoryId}
                onChange={setCategoryId}
                required
                fullWidth
              />
              
              <Input
                id="limitAmount"
                type="number"
                label="Monthly Limit"
                placeholder="0.00"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                fullWidth
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="startDate"
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  fullWidth
                />
                
                <Input
                  id="endDate"
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  fullWidth
                />
              </div>
              
              <Input
                id="alertThreshold"
                type="number"
                label="Alert Threshold (%)"
                placeholder="80"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                min="0"
                max="100"
                required
                fullWidth
              />
              
              <Button type="submit" isLoading={isSubmitting} fullWidth>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </form>
          </Card>

          <Card title="Current Budgets" className="lg:col-span-2">
            {budgetStatus.length > 0 ? (
              <div className="space-y-6">
                {budgetStatus.map((budget, index) => {
                  // Determine color based on percentage
                  let colorClass = 'bg-green-500';
                  let textColorClass = 'text-green-700';
                  let bgColorClass = 'bg-green-50';
                  let iconColorClass = 'text-green-500';
                  let showAlert = false;
                  
                  if (budget.percentage >= 90) {
                    colorClass = 'bg-red-500';
                    textColorClass = 'text-red-700';
                    bgColorClass = 'bg-red-50';
                    iconColorClass = 'text-red-500';
                    showAlert = true;
                  } else if (budget.percentage >= 75) {
                    colorClass = 'bg-yellow-500';
                    textColorClass = 'text-yellow-700';
                    bgColorClass = 'bg-yellow-50';
                    iconColorClass = 'text-yellow-500';
                    showAlert = true;
                  }

                  const budgetObj = budgets.find(b => getCategoryById(b.categoryId)?.name === budget.category);

                  return (
                    <div key={index} className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{budget.category}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(budgetObj?.startDate || '').toLocaleDateString()} - {new Date(budgetObj?.endDate || '').toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-900 font-medium">
                              ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                            </span>
                            {budgetObj && (
                              <button
                                onClick={() => deleteBudget(budgetObj.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colorClass} transition-all duration-500 ease-in-out`}
                              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                            />
                          </div>
                          <div className="mt-1">
                            <span className="text-sm text-gray-500">
                              {budget.percentage.toFixed(1)}% of budget used
                            </span>
                          </div>
                        </div>

                        {showAlert && (
                          <div className={`mt-3 p-2 rounded-md ${bgColorClass} flex items-start`}>
                            <AlertCircle className={`h-4 w-4 ${iconColorClass} mt-0.5 mr-2 flex-shrink-0`} />
                            <span className={`text-sm ${textColorClass}`}>
                              {budget.percentage >= 100
                                ? "You've exceeded your budget limit!"
                                : "You're approaching your budget limit!"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No budgets found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first budget.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Budgets;