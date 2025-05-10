import React, { useState } from 'react';
import { PlusCircle, Search, Filter, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useData } from '../context/DataContext';

const Expenses: React.FC = () => {
  const { expenses, categories, getCategoryById, deleteExpense } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) || true;
    const matchesCategory = categoryFilter ? expense.categoryId === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.amount - a.amount;
      case 'lowest':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="mt-1 text-gray-600">Manage and track your expenses</p>
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

        <Card className="mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map(category => ({
                    value: category.id,
                    label: category.name,
                  })),
                ]}
                value={categoryFilter}
                onChange={setCategoryFilter}
                fullWidth
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'highest', label: 'Highest Amount' },
                  { value: 'lowest', label: 'Lowest Amount' },
                ]}
                value={sortOrder}
                onChange={(value) => setSortOrder(value as any)}
                fullWidth
              />
            </div>
          </div>
        </Card>

        <Card>
          {sortedExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedExpenses.map((expense) => {
                    const category = getCategoryById(expense.categoryId);
                    return (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {category?.name || 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                          {expense.description || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                          -${expense.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {expenses.length > 0 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first expense.'}
              </p>
              {expenses.length === 0 && (
                <div className="mt-6">
                  <Link to="/expenses/new">
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Expenses;