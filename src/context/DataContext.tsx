import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  Expense, 
  Category, 
  Budget, 
  IncomeSource,
  ExpenseSummary,
  BudgetStatus
} from '../types';

// Sample categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Housing', description: 'Rent, mortgage, repairs' },
  { id: '2', name: 'Transportation', description: 'Car payments, gas, public transit' },
  { id: '3', name: 'Food', description: 'Groceries, dining out' },
  { id: '4', name: 'Utilities', description: 'Electricity, water, internet' },
  { id: '5', name: 'Entertainment', description: 'Movies, games, hobbies' },
  { id: '6', name: 'Healthcare', description: 'Insurance, medications, doctor visits' },
  { id: '7', name: 'Personal', description: 'Clothing, haircuts, gym' },
  { id: '8', name: 'Education', description: 'Tuition, books, courses' },
];

interface DataContextType {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  incomeSources: IncomeSource[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'userId'>) => void;
  addIncomeSource: (income: Omit<IncomeSource, 'id' | 'userId'>) => void;
  getExpenseSummary: () => ExpenseSummary[];
  getBudgetStatus: () => BudgetStatus[];
  getCategoryById: (id: string) => Category | undefined;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  deleteExpense: (id: string) => void;
  deleteBudget: (id: string) => void;
  deleteIncomeSource: (id: string) => void;
}

const DataContext = createContext<DataContextType>({
  expenses: [],
  categories: [],
  budgets: [],
  incomeSources: [],
  addExpense: () => {},
  addBudget: () => {},
  addIncomeSource: () => {},
  getExpenseSummary: () => [],
  getBudgetStatus: () => [],
  getCategoryById: () => undefined,
  getTotalIncome: () => 0,
  getTotalExpenses: () => 0,
  deleteExpense: () => {},
  deleteBudget: () => {},
  deleteIncomeSource: () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user ? user.id : '';

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);

  // Load data from localStorage when component mounts or user changes
  useEffect(() => {
    if (userId) {
      const storedExpenses = localStorage.getItem(`expenses_${userId}`);
      const storedBudgets = localStorage.getItem(`budgets_${userId}`);
      const storedIncomeSources = localStorage.getItem(`incomeSources_${userId}`);
      
      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
      if (storedIncomeSources) setIncomeSources(JSON.parse(storedIncomeSources));
    } else {
      // Clear data when no user is logged in
      setExpenses([]);
      setBudgets([]);
      setIncomeSources([]);
    }
  }, [userId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses));
      localStorage.setItem(`budgets_${userId}`, JSON.stringify(budgets));
      localStorage.setItem(`incomeSources_${userId}`, JSON.stringify(incomeSources));
    }
  }, [expenses, budgets, incomeSources, userId]);

  const addExpense = (expense: Omit<Expense, 'id' | 'userId'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      userId,
    };
    setExpenses([...expenses, newExpense]);
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'userId'>) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      userId,
    };
    setBudgets([...budgets, newBudget]);
  };

  const addIncomeSource = (income: Omit<IncomeSource, 'id' | 'userId'>) => {
    const newIncome = {
      ...income,
      id: Date.now().toString(),
      userId,
    };
    setIncomeSources([...incomeSources, newIncome]);
  };

  const getExpenseSummary = (): ExpenseSummary[] => {
    const summary: Record<string, number> = {};
    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    
    expenses.forEach(expense => {
      const category = getCategoryById(expense.categoryId)?.name || 'Unknown';
      summary[category] = (summary[category] || 0) + expense.amount;
    });
    
    return Object.entries(summary).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense ? (amount / totalExpense) * 100 : 0,
    }));
  };

  const getBudgetStatus = (): BudgetStatus[] => {
    return budgets.map(budget => {
      const spent = expenses
        .filter(expense => expense.categoryId === budget.categoryId)
        .reduce((total, expense) => total + expense.amount, 0);
      
      return {
        category: getCategoryById(budget.categoryId)?.name || 'Unknown',
        spent,
        limit: budget.limitAmount,
        percentage: budget.limitAmount ? (spent / budget.limitAmount) * 100 : 0,
      };
    });
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };

  const getTotalIncome = (): number => {
    return incomeSources.reduce((total, source) => {
      // Convert all incomes to monthly equivalents for simplification
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
      return total + monthlyAmount;
    }, 0);
  };

  const getTotalExpenses = (): number => {
    // Calculate total expenses from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return expenses
      .filter(expense => new Date(expense.date) >= thirtyDaysAgo)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const deleteIncomeSource = (id: string) => {
    setIncomeSources(incomeSources.filter(source => source.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        expenses,
        categories,
        budgets,
        incomeSources,
        addExpense,
        addBudget,
        addIncomeSource,
        getExpenseSummary,
        getBudgetStatus,
        getCategoryById,
        getTotalIncome,
        getTotalExpenses,
        deleteExpense,
        deleteBudget,
        deleteIncomeSource,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);