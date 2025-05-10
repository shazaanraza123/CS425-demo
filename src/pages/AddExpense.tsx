import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addExpense } = useData();
  
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || !date || !categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      addExpense({
        amount: Number(amount),
        date,
        description,
        categoryId,
      });
      
      navigate('/expenses');
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="mb-8">
          <Link to="/expenses" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Expenses
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Add New Expense</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="amount"
                type="number"
                label="Amount"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                fullWidth
              />
            </div>

            <div>
              <Input
                id="date"
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
              />
            </div>

            <div>
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
            </div>

            <div>
              <Input
                id="description"
                label="Description (optional)"
                placeholder="Description of the expense"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button type="submit" isLoading={isSubmitting}>
                Add Expense
              </Button>
              <Link to="/expenses">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddExpense;