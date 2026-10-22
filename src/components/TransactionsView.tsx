import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Trash2, 
  Plus, 
  FileSpreadsheet, 
  Zap, 
  ArrowUpDown
} from 'lucide-react';
import { BankAccount, Transaction, TransactionCategory, TransactionType } from '../types/finance';
import { formatBRL, formatDate } from '../utils/formatters';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  privacyMode: boolean;
  onOpenNewTransaction: () => void;
  onOpenImportOFX: () => void;
  onOpenSimulatePix: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  accounts,
  privacyMode,
  onOpenNewTransaction,
  onOpenImportOFX,
  onOpenSimulatePix,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [accountFilter, setAccountFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filter & sort
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesNotes = tx.notes ? tx.notes.toLowerCase().includes(query) : false;
        if (!matchesDesc && !matchesNotes) return false;
      }
      if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
      if (categoryFilter !== 'ALL' && tx.category !== categoryFilter) return false;
      if (accountFilter !== 'ALL' && tx.accountId !== accountFilter) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter, accountFilter, sortBy]);

  // Aggregate stats for filtered items
  const totalFilteredIncome = filteredTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((s, t) => s + t.amount, 0);

  const totalFilteredExpense = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0);

  // Export filtered transactions to CSV
  const handleExportCSV = () => {
    const headers = ['Data', 'Conta', 'Tipo', 'Categoria', 'Descrição', 'Valor (BRL)', 'ID Open Finance'];
    const rows = filteredTransactions.map(t => {
      const acc = accounts.find(a => a.id === t.accountId);
      return [
        t.date,
        acc ? acc.bankName : 'Carteira',
        t.type,
        t.category,
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount.toFixed(2),
        t.bankTxId || 'MANUAL',
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `extrato_aurafinance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = Array.from(new Set(transactions.map(t => t.category))).sort();

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header and Action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Extrato & Transações</h2>
          <p className="text-xs text-slate-400">
            Histórico completo e sincronizado em tempo real de todas as contas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenImportOFX}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
            <span>Importar Extrato</span>
          </button>
          <button
            onClick={onOpenSimulatePix}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simular Pix</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Movimentação</span>
          </button>
        </div>
      </div>

      {/* Summary Filter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Entradas Filtradas</span>
          <span className="font-mono text-sm font-semibold text-emerald-400">
            {formatBRL(totalFilteredIncome, privacyMode)}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Saídas Filtradas</span>
          <span className="font-mono text-sm font-semibold text-rose-300">
            {formatBRL(totalFilteredExpense, privacyMode)}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Saldo Líquido</span>
          <span className="font-mono text-sm font-semibold text-white">
            {formatBRL(totalFilteredIncome - totalFilteredExpense, privacyMode)}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por descrição, estabelecimento ou anotação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors whitespace-nowrap ${
                typeFilter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setTypeFilter('EXPENSE')}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors whitespace-nowrap ${
                typeFilter === 'EXPENSE'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Despesas
            </button>
            <button
              onClick={() => setTypeFilter('INCOME')}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors whitespace-nowrap ${
                typeFilter === 'INCOME'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Receitas
            </button>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="date-desc">Mais Recentes Primeiro</option>
              <option value="date-asc">Mais Antigas Primeiro</option>
              <option value="amount-desc">Maior Valor</option>
              <option value="amount-asc">Menor Valor</option>
            </select>
          </div>
        </div>

        {/* Secondary Category & Account Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Categoria:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Conta Bancária:</span>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Todas as Contas</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.bankName}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || typeFilter !== 'ALL' || categoryFilter !== 'ALL' || accountFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('ALL');
                setCategoryFilter('ALL');
                setAccountFilter('ALL');
              }}
              className="text-xs text-emerald-400 hover:underline transition-colors ml-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-400 mb-2">Nenhuma movimentação encontrada com os filtros selecionados.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('ALL');
                setCategoryFilter('ALL');
                setAccountFilter('ALL');
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              Restaurar todos os lançamentos
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-950/40">
                  <th className="py-3 px-4 font-normal">Data</th>
                  <th className="py-3 px-4 font-normal">Descrição & Origem</th>
                  <th className="py-3 px-4 font-normal">Categoria</th>
                  <th className="py-3 px-4 font-normal">Conta</th>
                  <th className="py-3 px-4 font-normal text-right">Valor</th>
                  <th className="py-3 px-4 font-normal text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredTransactions.map((tx) => {
                  const acc = accounts.find(a => a.id === tx.accountId);
                  const isIncome = tx.type === 'INCOME';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {formatDate(tx.date, 'short')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white max-w-sm truncate">
                          {tx.description}
                        </div>
                        {tx.bankTxId && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Ref: {tx.bankTxId}
                          </div>
                        )}
                        {tx.notes && (
                          <div className="text-[11px] text-slate-400 italic">
                            {tx.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {tx.category}
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          {acc && (
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: acc.color }}
                            />
                          )}
                          <span>{acc ? acc.bankName : 'Carteira'}</span>
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-semibold whitespace-nowrap ${
                          isIncome ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}
                        {formatBRL(tx.amount, privacyMode)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Remover transação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
