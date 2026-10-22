import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, Edit3, Plus, X } from 'lucide-react';
import { CategoryBudget, Transaction, TransactionCategory } from '../types/finance';
import { formatBRL } from '../utils/formatters';

interface BudgetsViewProps {
  budgets: CategoryBudget[];
  transactions: Transaction[];
  currentPeriod: string;
  privacyMode: boolean;
  onUpdateBudget: (category: TransactionCategory, amount: number) => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  budgets,
  transactions,
  currentPeriod,
  privacyMode,
  onUpdateBudget,
}) => {
  const [editingCat, setEditingCat] = useState<TransactionCategory | null>(null);
  const [editAmountStr, setEditAmountStr] = useState<string>('');

  // Calculate current month expenses per category
  const currentMonthExpenses = transactions.filter(
    t => t.type === 'EXPENSE' && t.date.startsWith(currentPeriod)
  );

  const categorySpentMap: Partial<Record<TransactionCategory, number>> = {};
  for (const t of currentMonthExpenses) {
    categorySpentMap[t.category] = (categorySpentMap[t.category] || 0) + t.amount;
  }

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const totalSpentInBudgetCategories = budgets.reduce((acc, b) => {
    return acc + (categorySpentMap[b.category] || 0);
  }, 0);

  const totalRemaining = Math.max(0, totalAllocated - totalSpentInBudgetCategories);
  const totalBudgetPercentage = totalAllocated > 0
    ? Math.round((totalSpentInBudgetCategories / totalAllocated) * 100)
    : 0;

  const handleStartEdit = (b: CategoryBudget) => {
    setEditingCat(b.category);
    setEditAmountStr(b.allocatedAmount.toString());
  };

  const handleSaveEdit = (category: TransactionCategory) => {
    const val = parseFloat(editAmountStr);
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget(category, val);
    }
    setEditingCat(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Metas & Orçamentos Mensais</h2>
          <p className="text-xs text-slate-400">
            Defina limites por categoria de consumo para prevenir estouros de orçamento
          </p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Orçamento Total Planejado</span>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {formatBRL(totalAllocated, privacyMode)}
          </div>
          <div className="text-xs text-slate-400">Distribuído em {budgets.length} categorias</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Consumido até Agora</span>
          <div className="text-2xl font-bold font-mono text-rose-300 mb-1">
            {formatBRL(totalSpentInBudgetCategories, privacyMode)}
          </div>
          <div className="text-xs text-slate-400">{totalBudgetPercentage}% do limite geral</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Disponível para Gastar</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
            {formatBRL(totalRemaining, privacyMode)}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all ${
                totalBudgetPercentage > 90 ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, totalBudgetPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const spent = categorySpentMap[b.category] || 0;
          const percentage = b.allocatedAmount > 0 ? Math.round((spent / b.allocatedAmount) * 100) : 0;
          const isOver = percentage >= 100;
          const isWarning = percentage >= 80 && !isOver;
          const isEditing = editingCat === b.category;

          return (
            <div
              key={b.category}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <Target className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{b.category}</h3>
                  </div>

                  {isOver && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Estourado</span>
                    </span>
                  )}
                  {isWarning && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      <span>Atenção</span>
                    </span>
                  )}
                  {!isOver && !isWarning && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>No Limite</span>
                    </span>
                  )}
                </div>

                {/* Progress & Values */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Gasto Atual</span>
                      <span className="font-mono text-base font-semibold text-white">
                        {formatBRL(spent, privacyMode)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Teto Mensal</span>
                      <span className="font-mono text-base font-semibold text-slate-300">
                        {formatBRL(b.allocatedAmount, privacyMode)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{percentage}% utilizado</span>
                    <span>
                      {isOver
                        ? `Excedido em ${formatBRL(spent - b.allocatedAmount, privacyMode)}`
                        : `Resta ${formatBRL(b.allocatedAmount - spent, privacyMode)}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit allocation form */}
              <div className="pt-3 border-t border-slate-800/80">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-2 text-xs font-semibold text-slate-500">R$</span>
                      <input
                        type="number"
                        step="50"
                        value={editAmountStr}
                        onChange={(e) => setEditAmountStr(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveEdit(b.category)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 text-xs font-semibold hover:bg-emerald-300 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingCat(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(b)}
                    className="w-full py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-slate-800/80 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Ajustar Teto de Gastos</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
