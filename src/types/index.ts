export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  date: string;
  description?: string;
  categoryId: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually';
  description?: string;
  userId: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  limitAmount: number;
  startDate: string;
  endDate: string;
  alertThreshold: number;
}

export interface Report {
  id: string;
  generatedAt: string;
  type: 'expense' | 'income' | 'budget';
  data: string;
  userId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ExpenseSummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface BudgetStatus {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
}