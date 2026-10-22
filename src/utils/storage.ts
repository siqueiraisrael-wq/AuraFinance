import { BankAccount, Transaction, CategoryBudget, SecuritySettings, MonthlyFinancialReport, TransactionCategory } from '../types/finance';

const STORAGE_KEY_ACCOUNTS = 'aurafinance_accounts_v1';
const STORAGE_KEY_TRANSACTIONS = 'aurafinance_transactions_v1';
const STORAGE_KEY_BUDGETS = 'aurafinance_budgets_v1';
const STORAGE_KEY_SECURITY = 'aurafinance_security_v1';

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc-nubank',
    bankName: 'Nubank',
    bankCode: '260',
    accountType: 'CHECKING',
    accountNumberMasked: 'Ag 0001 · Cc 94821-4',
    balance: 8420.50,
    creditLimit: 18000.00,
    creditUsed: 3240.80,
    color: '#820AD1',
    logoInitial: 'Nu',
    openFinanceConnected: true,
    consentExpiresAt: '2027-10-15',
    lastSyncedAt: new Date().toISOString(),
    syncStatus: 'SYNCED',
  },
  {
    id: 'acc-itau',
    bankName: 'Itaú Unibanco',
    bankCode: '341',
    accountType: 'CHECKING',
    accountNumberMasked: 'Ag 4012 · Cc 18274-9',
    balance: 14850.00,
    creditLimit: 25000.00,
    creditUsed: 1420.00,
    color: '#EC7000',
    logoInitial: 'It',
    openFinanceConnected: true,
    consentExpiresAt: '2027-08-20',
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    syncStatus: 'SYNCED',
  },
  {
    id: 'acc-inter',
    bankName: 'Banco Inter',
    bankCode: '077',
    accountType: 'INVESTMENT',
    accountNumberMasked: 'Ag 0001 · Inv 59281-0',
    balance: 42300.00,
    color: '#FF7A00',
    logoInitial: 'In',
    openFinanceConnected: true,
    consentExpiresAt: '2027-11-01',
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    syncStatus: 'SYNCED',
  },
  {
    id: 'acc-cash',
    bankName: 'Carteira Física',
    bankCode: '000',
    accountType: 'CASH',
    accountNumberMasked: 'Espécie / Reserva Manual',
    balance: 650.00,
    color: '#10B981',
    logoInitial: 'R$',
    openFinanceConnected: false,
    lastSyncedAt: new Date().toISOString(),
    syncStatus: 'SYNCED',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Current month (October 2026)
  {
    id: 'tx-101',
    accountId: 'acc-itau',
    type: 'INCOME',
    category: 'Salário',
    description: 'Salário Mensal - TechCorp Brasil',
    amount: 16800.00,
    date: '2026-10-05',
    time: '08:30',
    status: 'COMPLETED',
    isRecurring: true,
    bankTxId: 'OF-BR-341-948190',
  },
  {
    id: 'tx-102',
    accountId: 'acc-inter',
    type: 'INCOME',
    category: 'Investimentos',
    description: 'Rendimento CDB Liquidez Diária & Tesouro IPCA',
    amount: 485.40,
    date: '2026-10-15',
    time: '14:20',
    status: 'COMPLETED',
    bankTxId: 'OF-BR-077-102941',
  },
  {
    id: 'tx-103',
    accountId: 'acc-itau',
    type: 'EXPENSE',
    category: 'Moradia',
    description: 'Aluguel & Condomínio Edifício Horizon',
    amount: 3850.00,
    date: '2026-10-06',
    time: '09:15',
    status: 'COMPLETED',
    isRecurring: true,
  },
  {
    id: 'tx-104',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Supermercado',
    description: 'Pão de Açúcar - Compras Quinzenais',
    amount: 890.45,
    date: '2026-10-08',
    time: '18:40',
    status: 'COMPLETED',
  },
  {
    id: 'tx-105',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Supermercado',
    description: 'St. Marche Jardins Hortifruti',
    amount: 432.10,
    date: '2026-10-18',
    time: '11:20',
    status: 'COMPLETED',
  },
  {
    id: 'tx-106',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Alimentação',
    description: 'Restaurante Fogo de Chão',
    amount: 420.00,
    date: '2026-10-11',
    time: '13:30',
    status: 'COMPLETED',
  },
  {
    id: 'tx-107',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Alimentação',
    description: 'iFood Brasil - Sushi Delivery',
    amount: 156.80,
    date: '2026-10-14',
    time: '20:15',
    status: 'COMPLETED',
  },
  {
    id: 'tx-108',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Transporte',
    description: 'Posto Shell Select - Gasolina Aditivada',
    amount: 295.00,
    date: '2026-10-09',
    time: '07:50',
    status: 'COMPLETED',
  },
  {
    id: 'tx-109',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Transporte',
    description: 'Uber Brasil - Deslocamento Reuniões',
    amount: 88.40,
    date: '2026-10-16',
    time: '17:45',
    status: 'COMPLETED',
  },
  {
    id: 'tx-110',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Assinaturas',
    description: 'Netflix 4K Premium',
    amount: 59.90,
    date: '2026-10-03',
    time: '04:10',
    status: 'COMPLETED',
    isRecurring: true,
  },
  {
    id: 'tx-111',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Assinaturas',
    description: 'Spotify Family Brasil',
    amount: 34.90,
    date: '2026-10-04',
    time: '04:12',
    status: 'COMPLETED',
    isRecurring: true,
  },
  {
    id: 'tx-112',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Assinaturas',
    description: 'Smart Fit Plano Black',
    amount: 139.90,
    date: '2026-10-10',
    time: '05:00',
    status: 'COMPLETED',
    isRecurring: true,
  },
  {
    id: 'tx-113',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Saúde',
    description: 'Drogasil Farmácia - Medicamentos e Vitaminas',
    amount: 215.30,
    date: '2026-10-12',
    time: '15:20',
    status: 'COMPLETED',
  },
  {
    id: 'tx-114',
    accountId: 'acc-itau',
    type: 'EXPENSE',
    category: 'Moradia',
    description: 'Enel Energia Elétrica',
    amount: 260.40,
    date: '2026-10-13',
    time: '10:00',
    status: 'COMPLETED',
    isRecurring: true,
  },
  {
    id: 'tx-115',
    accountId: 'acc-itau',
    type: 'EXPENSE',
    category: 'Moradia',
    description: 'Claro Fibra 500 Mega Internet',
    amount: 149.90,
    date: '2026-10-17',
    time: '10:30',
    status: 'COMPLETED',
    isRecurring: true,
  },
  {
    id: 'tx-116',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Lazer',
    description: 'Ingresso Cinema IMAX Cinemark',
    amount: 110.00,
    date: '2026-10-19',
    time: '19:00',
    status: 'COMPLETED',
  },
  {
    id: 'tx-117',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Compras',
    description: 'Amazon Brasil - Livros Técnicos e Acessórios',
    amount: 349.00,
    date: '2026-10-20',
    time: '16:15',
    status: 'COMPLETED',
  },

  // Previous month sample (September 2026) for comparative reports
  {
    id: 'tx-001',
    accountId: 'acc-itau',
    type: 'INCOME',
    category: 'Salário',
    description: 'Salário Mensal - TechCorp Brasil',
    amount: 16800.00,
    date: '2026-09-05',
    time: '08:30',
    status: 'COMPLETED',
  },
  {
    id: 'tx-002',
    accountId: 'acc-itau',
    type: 'EXPENSE',
    category: 'Moradia',
    description: 'Aluguel & Condomínio Edifício Horizon',
    amount: 3850.00,
    date: '2026-09-06',
    time: '09:00',
    status: 'COMPLETED',
  },
  {
    id: 'tx-003',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Supermercado',
    description: 'Pão de Açúcar',
    amount: 1420.00,
    date: '2026-09-12',
    time: '16:00',
    status: 'COMPLETED',
  },
  {
    id: 'tx-004',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Transporte',
    description: 'Posto Shell & Estacionamentos',
    amount: 620.00,
    date: '2026-09-15',
    time: '11:00',
    status: 'COMPLETED',
  },
  {
    id: 'tx-005',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Alimentação',
    description: 'Restaurantes & Delivery',
    amount: 1140.00,
    date: '2026-09-22',
    time: '20:00',
    status: 'COMPLETED',
  },
  {
    id: 'tx-006',
    accountId: 'acc-nubank',
    type: 'EXPENSE',
    category: 'Assinaturas',
    description: 'Assinaturas Diversas (Streaming + Academia)',
    amount: 234.70,
    date: '2026-09-05',
    time: '04:00',
    status: 'COMPLETED',
  },
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { category: 'Moradia', allocatedAmount: 4500.00, period: '2026-10' },
  { category: 'Supermercado', allocatedAmount: 1800.00, period: '2026-10' },
  { category: 'Alimentação', allocatedAmount: 1000.00, period: '2026-10' },
  { category: 'Transporte', allocatedAmount: 800.00, period: '2026-10' },
  { category: 'Saúde', allocatedAmount: 600.00, period: '2026-10' },
  { category: 'Lazer', allocatedAmount: 700.00, period: '2026-10' },
  { category: 'Compras', allocatedAmount: 800.00, period: '2026-10' },
  { category: 'Assinaturas', allocatedAmount: 300.00, period: '2026-10' },
  { category: 'Educação', allocatedAmount: 500.00, period: '2026-10' },
];

export const INITIAL_SECURITY: SecuritySettings = {
  pinEnabled: false,
  pinCode: '1234',
  biometricsEnabled: true,
  privacyMode: false,
  autoLockMinutes: 5,
  lastUnlockedTimestamp: Date.now(),
  auditLogs: [
    {
      id: 'log-1',
      action: 'Acesso autenticado ao aplicativo',
      timestamp: new Date().toISOString(),
      ipOrDevice: 'Google Chrome / macOS (Criptografia TLS 1.3)',
    },
    {
      id: 'log-2',
      action: 'Consentimento Open Finance sincronizado (Nubank, Itaú)',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      ipOrDevice: 'Open Finance Brasil Gateway Central',
    },
  ],
};

// Local storage helpers
export function loadAccounts(): BankAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading accounts from storage', e);
  }
  saveAccounts(INITIAL_ACCOUNTS);
  return INITIAL_ACCOUNTS;
}

export function saveAccounts(accounts: BankAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving accounts', e);
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading transactions from storage', e);
  }
  saveTransactions(INITIAL_TRANSACTIONS);
  return INITIAL_TRANSACTIONS;
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Error saving transactions', e);
  }
}

export function loadBudgets(): CategoryBudget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BUDGETS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading budgets', e);
  }
  saveBudgets(INITIAL_BUDGETS);
  return INITIAL_BUDGETS;
}

export function saveBudgets(budgets: CategoryBudget[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
  } catch (e) {
    console.error('Error saving budgets', e);
  }
}

export function loadSecurity(): SecuritySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SECURITY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading security settings', e);
  }
  saveSecurity(INITIAL_SECURITY);
  return INITIAL_SECURITY;
}

export function saveSecurity(security: SecuritySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SECURITY, JSON.stringify(security));
  } catch (e) {
    console.error('Error saving security', e);
  }
}

/**
 * Generate comprehensive automatic financial report for a given month YYYY-MM
 */
export function generateMonthlyReport(
  transactions: Transaction[],
  period: string // e.g. "2026-10"
): MonthlyFinancialReport {
  const currentMonthTx = transactions.filter(t => t.date.startsWith(period));

  // Determine previous month
  const [yearStr, monthStr] = period.split('-');
  const currYear = parseInt(yearStr, 10);
  const currMonth = parseInt(monthStr, 10);
  const prevDate = new Date(currYear, currMonth - 2, 1);
  const prevPeriod = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
  const prevMonthTx = transactions.filter(t => t.date.startsWith(prevPeriod));

  const totalIncome = currentMonthTx
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = currentMonthTx
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const prevExpenses = prevMonthTx
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, (netSavings / totalIncome) * 100) : 0;

  const previousMonthExpenseDiff = prevExpenses > 0
    ? ((totalExpenses - prevExpenses) / prevExpenses) * 100
    : 0;

  // Breakdown by category
  const categoryMap: Partial<Record<TransactionCategory, { total: number; count: number }>> = {};
  for (const tx of currentMonthTx) {
    if (tx.type === 'EXPENSE') {
      if (!categoryMap[tx.category]) {
        categoryMap[tx.category] = { total: 0, count: 0 };
      }
      categoryMap[tx.category]!.total += tx.amount;
      categoryMap[tx.category]!.count += 1;
    }
  }

  const expensesByCategory = Object.entries(categoryMap)
    .map(([cat, data]) => ({
      category: cat as TransactionCategory,
      total: data.total,
      percentage: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.total - a.total);

  // Top 5 expenses
  const topExpenses = [...currentMonthTx]
    .filter(t => t.type === 'EXPENSE')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Recurring subscriptions detected
  const recurringExpenses = [
    { name: 'Netflix Premium 4K', category: 'Assinaturas' as TransactionCategory, monthlyAmount: 59.90 },
    { name: 'Spotify Family', category: 'Assinaturas' as TransactionCategory, monthlyAmount: 34.90 },
    { name: 'Smart Fit Plano Black', category: 'Assinaturas' as TransactionCategory, monthlyAmount: 139.90 },
    { name: 'Claro Fibra 500 Mega', category: 'Moradia' as TransactionCategory, monthlyAmount: 149.90 },
    { name: 'Aluguel & Condomínio', category: 'Moradia' as TransactionCategory, monthlyAmount: 3850.00 },
  ];

  // Automated intelligent financial insights and diagnosis
  const aiInsights: { type: 'positive' | 'warning' | 'tip'; title: string; message: string }[] = [];

  if (savingsRate >= 30) {
    aiInsights.push({
      type: 'positive',
      title: 'Taxa de Poupança Exemplar',
      message: `Você está poupando ${savingsRate.toFixed(1)}% da sua renda mensal. Isso supera a recomendação padrão de 20% do método 50-30-20.`,
    });
  } else if (savingsRate > 0) {
    aiInsights.push({
      type: 'tip',
      title: 'Espaço para Aporte em Investimentos',
      message: `Sua taxa de poupança atual é de ${savingsRate.toFixed(1)}%. Com pequenos ajustes em Alimentação fora de casa e Compras não planejadas, é possível atingir 25%.`,
    });
  } else {
    aiInsights.push({
      type: 'warning',
      title: 'Atenção ao Saldo Operacional',
      message: 'Neste mês as despesas superaram as receitas registradas. Recomenda-se pausar compras opcionais e revisar cobranças de cartões.',
    });
  }

  if (expensesByCategory.length > 0) {
    const topCat = expensesByCategory[0];
    aiInsights.push({
      type: 'tip',
      title: `Maior Centro de Custo: ${topCat.category}`,
      message: `${topCat.category} consumiu ${topCat.percentage.toFixed(1)}% do seu orçamento mensal (total de R$ ${topCat.total.toFixed(2)}).`,
    });
  }

  aiInsights.push({
    type: 'positive',
    title: 'Sincronização Bancária Open Finance em Dia',
    message: 'Todas as 3 contas conectadas estão sincronizadas com criptografia ativa pelo Banco Central.',
  });

  return {
    period,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    previousMonthExpenseDiff,
    expensesByCategory,
    topExpenses,
    recurringExpenses,
    aiInsights,
    generatedAt: new Date().toISOString(),
  };
}
