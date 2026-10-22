export type AccountType = 'CHECKING' | 'CREDIT_CARD' | 'INVESTMENT' | 'SAVINGS' | 'CASH';

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountType: AccountType;
  accountNumberMasked: string;
  balance: number; // In BRL
  creditLimit?: number;
  creditUsed?: number;
  color: string;
  logoInitial: string;
  openFinanceConnected: boolean;
  consentExpiresAt?: string;
  lastSyncedAt: string;
  syncStatus: 'SYNCED' | 'SYNCING' | 'ERROR';
}

export type TransactionType = 'EXPENSE' | 'INCOME' | 'TRANSFER';

export type TransactionCategory = 
  | 'Alimentação'
  | 'Supermercado'
  | 'Moradia'
  | 'Transporte'
  | 'Lazer'
  | 'Saúde'
  | 'Educação'
  | 'Compras'
  | 'Assinaturas'
  | 'Salário'
  | 'Investimentos'
  | 'Serviços'
  | 'Outros';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number; // positive number
  date: string; // ISO date YYYY-MM-DD
  time?: string; // HH:mm
  status: 'COMPLETED' | 'PENDING';
  isRecurring?: boolean;
  notes?: string;
  tags?: string[];
  bankTxId?: string; // Open Finance transaction reference
}

export interface CategoryBudget {
  category: TransactionCategory;
  allocatedAmount: number;
  period: string; // YYYY-MM
}

export interface MonthlyFinancialReport {
  period: string; // YYYY-MM e.g. "2026-10"
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage (0 to 100)
  previousMonthExpenseDiff: number; // percentage change vs prev month
  expensesByCategory: {
    category: TransactionCategory;
    total: number;
    percentage: number;
    transactionCount: number;
  }[];
  topExpenses: Transaction[];
  recurringExpenses: {
    name: string;
    category: TransactionCategory;
    monthlyAmount: number;
  }[];
  aiInsights: {
    type: 'positive' | 'warning' | 'tip';
    title: string;
    message: string;
  }[];
  generatedAt: string;
}

export interface SecuritySettings {
  pinEnabled: boolean;
  pinCode?: string;
  biometricsEnabled: boolean;
  privacyMode: boolean; // hide balances
  autoLockMinutes: number; // 0 = disabled
  lastUnlockedTimestamp: number;
  auditLogs: {
    id: string;
    action: string;
    timestamp: string;
    ipOrDevice: string;
  }[];
}
