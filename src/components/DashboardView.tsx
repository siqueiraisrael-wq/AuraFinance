import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  Plus, 
  Building2, 
  FileSpreadsheet, 
  Zap, 
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BankAccount, Transaction, MonthlyFinancialReport } from '../types/finance';
import { formatBRL, formatDate } from '../utils/formatters';

interface DashboardViewProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  report: MonthlyFinancialReport;
  privacyMode: boolean;
  onOpenNewTransaction: () => void;
  onOpenConnectBank: () => void;
  onOpenImportOFX: () => void;
  onOpenSimulatePix: () => void;
  onSyncAccount: (accId: string) => void;
  onNavigateToTransactions: () => void;
  onNavigateToReports: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  accounts,
  transactions,
  report,
  privacyMode,
  onOpenNewTransaction,
  onOpenConnectBank,
  onOpenImportOFX,
  onOpenSimulatePix,
  onSyncAccount,
  onNavigateToTransactions,
  onNavigateToReports,
}) => {
  // Consolidated net worth
  const totalBalance = accounts.reduce((acc, a) => {
    if (a.accountType === 'CREDIT_CARD') {
      return acc - (a.creditUsed || 0);
    }
    return acc + a.balance;
  }, 0);

  // Recent 6 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // SVG Chart points for current month daily flow
  const daysInMonth = 30;
  const dailyData: { day: number; expense: number; income: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    const datePrefix = `${report.period}-${dayStr}`;
    const dayTx = transactions.filter(t => t.date === datePrefix);
    const dayExp = dayTx.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    const dayInc = dayTx.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    dailyData.push({ day: d, expense: dayExp, income: dayInc });
  }

  const maxVal = Math.max(...dailyData.map(d => Math.max(d.expense, d.income)), 1000);
  const chartHeight = 140;
  const chartWidth = 600;

  // Build SVG path
  const expensePoints = dailyData.map((d, i) => {
    const x = (i / (daysInMonth - 1)) * chartWidth;
    const y = chartHeight - (d.expense / maxVal) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  const incomePoints = dailyData.map((d, i) => {
    const x = (i / (daysInMonth - 1)) * chartWidth;
    const y = chartHeight - (d.income / maxVal) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-medium">
            Open Finance Ativo · Conexão Criptografada TLS 1.3
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenConnectBank}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conectar Banco</span>
          </button>
          <button
            onClick={onOpenImportOFX}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
            <span>Importar Extrato OFX/CSV</span>
          </button>
          <button
            onClick={onOpenSimulatePix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simular Pix</span>
          </button>
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Movimentação</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Patrimônio Líquido Total</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white mb-1">
            {formatBRL(totalBalance, privacyMode)}
          </div>
          <div className="text-xs text-slate-400">
            {accounts.length} contas e carteiras ativas
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Receitas do Mês</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400 mb-1">
            {formatBRL(report.totalIncome, privacyMode)}
          </div>
          <div className="text-xs text-slate-400">
            Salário, dividendos e rendimentos
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Despesas do Mês</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-rose-300 mb-1">
            {formatBRL(report.totalExpenses, privacyMode)}
          </div>
          <div className="text-xs text-slate-400">
            {report.previousMonthExpenseDiff !== 0 && (
              <span>
                {report.previousMonthExpenseDiff > 0 ? '+' : ''}
                {report.previousMonthExpenseDiff.toFixed(1)}% vs mês anterior
              </span>
            )}
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Taxa de Poupança</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white mb-2">
            {privacyMode ? '••%' : `${report.savingsRate.toFixed(1)}%`}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(report.savingsRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content 2-Column: Accounts & Cash Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bank Accounts Overview (1 col on desktop) */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Contas Conectadas</h3>
              <button
                onClick={onOpenConnectBank}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                + Adicionar
              </button>
            </div>

            <div className="space-y-3">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold"
                        style={{ backgroundColor: acc.color }}
                      >
                        {acc.logoInitial}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{acc.bankName}</div>
                        <div className="text-[11px] text-slate-400">{acc.accountNumberMasked}</div>
                      </div>
                    </div>
                    {acc.openFinanceConnected && (
                      <button
                        onClick={() => onSyncAccount(acc.id)}
                        disabled={acc.syncStatus === 'SYNCING'}
                        title="Sincronizar conta agora"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${acc.syncStatus === 'SYNCING' ? 'animate-spin text-emerald-400' : ''}`} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-[11px] text-slate-400">
                      {acc.accountType === 'CREDIT_CARD' ? 'Fatura Aberta' : 'Saldo'}
                    </span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {acc.accountType === 'CREDIT_CARD'
                        ? formatBRL(acc.creditUsed || 0, privacyMode)
                        : formatBRL(acc.balance, privacyMode)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Segurança Open Finance</span>
            <span className="text-emerald-400 font-mono text-[11px]">BCB Homologado</span>
          </div>
        </div>

        {/* Cash Flow Interactive Chart & Automated Diagnostics (2 cols on desktop) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Fluxo Financeiro Diário</h3>
                <p className="text-xs text-slate-400">Receitas vs Despesas ao longo do mês</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Receitas
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Despesas
                </span>
              </div>
            </div>

            {/* SVG Visual Area Chart */}
            <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800/80 overflow-hidden mb-4">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-36 overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                <line x1="0" y1="10" x2={chartWidth} y2="10" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke="#1e293b" />

                {/* Income Line */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={incomePoints}
                />

                {/* Expense Line */}
                <polyline
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={expensePoints}
                />
              </svg>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
                <span>Dia 01</span>
                <span>Dia 10</span>
                <span>Dia 20</span>
                <span>Dia 30</span>
              </div>
            </div>

            {/* Automated Insight Banner */}
            {report.aiInsights[0] && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="font-semibold text-emerald-300 mb-1">
                  {report.aiInsights[0].title}
                </div>
                <div className="text-slate-300 leading-relaxed">
                  {report.aiInsights[0].message}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Relatório Executivo Automático do mês gerado
            </span>
            <button
              onClick={onNavigateToReports}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>Ver Relatório Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Últimas Movimentações Conciliadas</h3>
            <p className="text-xs text-slate-400">Transações sincronizadas automaticamente via Open Finance</p>
          </div>
          <button
            onClick={onNavigateToTransactions}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Ver Extrato Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-2.5 font-normal">Data</th>
                <th className="pb-2.5 font-normal">Descrição</th>
                <th className="pb-2.5 font-normal">Categoria</th>
                <th className="pb-2.5 font-normal">Conta</th>
                <th className="pb-2.5 font-normal text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentTransactions.map((tx) => {
                const acc = accounts.find(a => a.id === tx.accountId);
                const isIncome = tx.type === 'INCOME';

                return (
                  <tr key={tx.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(tx.date, 'day-month')}
                    </td>
                    <td className="py-3 font-medium text-white max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 text-slate-300 whitespace-nowrap">
                      {tx.category}
                    </td>
                    <td className="py-3 text-slate-400 whitespace-nowrap">
                      {acc ? acc.bankName : 'Carteira'}
                    </td>
                    <td
                      className={`py-3 text-right font-mono font-semibold whitespace-nowrap ${
                        isIncome ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {isIncome ? '+ ' : '- '}
                      {formatBRL(tx.amount, privacyMode)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
