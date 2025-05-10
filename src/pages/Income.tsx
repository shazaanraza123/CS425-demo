import React, { useState } from 'react';
import { PlusCircle, RefreshCcw, Trash2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';

const Income: React.FC = () => {
  const { incomeSources, addIncomeSource, deleteIncomeSource } = useData();
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      
      // Reset form
      setName('');
      setAmount('');
      setDescription('');
      setIsSubmitting(false);
    } catch (err) {
      setError('Failed to add income source. Please try again.');
      setIsSubmitting(false);
    }
  };

  const calculateMonthlyEquivalent = (source: { amount: number; frequency: string }): number => {
    let monthlyAmount = source.amount;
    switch (source.frequency) {
      case 'daily':
        monthlyAmount *= 30;
        break;
      case 'weekly':
        monthlyAmount *= 4.33;
        break;
      case 'bi-weekly':
        monthlyAmount *= 2.17;
        break;
      case 'quarterly':
        monthlyAmount /= 3;
        break;
      case 'annually':
        monthlyAmount /= 12;
        break;
    }
    return monthlyAmount;
  };

  const totalMonthlyIncome = incomeSources.reduce(
    (total, source) => total + calculateMonthlyEquivalent(source),
    0
  );

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Income Sources</h1>
            <p className="mt-1 text-gray-600">Manage your income sources</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card title="Add Income Source" className="lg:col-span-1">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                label="Name"
                placeholder="e.g., Salary, Freelance Work"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
              
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
              
              <Input
                id="description"
                label="Description (optional)"
                placeholder="Additional details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
              
              <Button type="submit" isLoading={isSubmitting} fullWidth>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Income Source
              </Button>
            </form>
          </Card>

          <Card title="Your Income Sources" className="lg:col-span-2">
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 font-medium">Total Monthly Income</p>
              <p className="text-2xl font-bold text-green-800">${totalMonthlyIncome.toFixed(2)}</p>
            </div>

            {incomeSources.length > 0 ? (
              <div className="space-y-4">
                {incomeSources.map((source) => {
                  const monthlyEquivalent = calculateMonthlyEquivalent(source);
                  
                  return (
                    <div key={source.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{source.name}</h3>
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-gray-600">
                            ${source.amount.toFixed(2)} {source.frequency}
                          </p>
                          <div className="mx-2 text-gray-300">•</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <RefreshCcw className="h-3 w-3 mr-1" />
                            ${monthlyEquivalent.toFixed(2)} monthly
                          </div>
                        </div>
                        {source.description && (
                          <p className="mt-1 text-sm text-gray-500">{source.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteIncomeSource(source.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No income sources added yet.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Income;