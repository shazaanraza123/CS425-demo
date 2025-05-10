import React, { useState } from 'react';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';

const AddIncome: React.FC = () => {
  const navigate = useNavigate();
  const { addIncomeSource } = useData();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !amount || !frequency) {
      setError('Please fill in all required fields');
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setIsSubmitting(true);
    try {
      addIncomeSource({
        name,
        amount: Number(amount),
        frequency: frequency as any,
        description,
      });
      navigate('/income');
    } catch (err) {
      setError('Failed to add income source. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="mb-8">
          <Link to="/income" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Income
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Add New Income Source</h1>
        </div>
        <Card className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="name"
                label="Name"
                placeholder="e.g., Salary, Freelance Work"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
            </div>
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
              <Select
                id="frequency"
                label="Frequency"
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'bi-weekly', label: 'Bi-weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'annually', label: 'Annually' },
                ]}
                value={frequency}
                onChange={setFrequency}
                required
                fullWidth
              />
            </div>
            <div>
              <Input
                id="description"
                label="Description (optional)"
                placeholder="Additional details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button type="submit" isLoading={isSubmitting}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Income
              </Button>
              <Link to="/income">
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

export default AddIncome; 