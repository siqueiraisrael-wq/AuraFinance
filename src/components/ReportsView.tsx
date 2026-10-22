import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles,
  Repeat,
  ArrowUpRight
} from 'lucide-react';
import { MonthlyFinancialReport, Transaction, TransactionCategory } from '../types/finance';
import { formatBRL, formatDate, formatPercent } from '../utils/formatters';

interface ReportsViewProps {
  report: MonthlyFinancialReport;
  allTransactions: Transaction[];
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  privacyMode: boolean;
}

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  'Moradia': '#3b82f6',
  'Supermercado': '#10b981',
  'Alimentação': '#f59e0b',
  'Transporte': '#8b5cf6',
  'Saúde': '#ec4899',
  'Lazer': '#06b6d4',
  'Compras': '#f43f5e',
  'Assinaturas': '#a855f7',
  'Educação': '#6366f1',
  'Salário': '#10b981',
  'Investimentos': '#14b8a6',
  'Serviços': '#64748b',
  'Outros': '#94a3b8',
};

export const ReportsView: React.FC<ReportsViewProps> = ({
  report,
  allTransactions,
  selectedPeriod,
  onSelectPeriod,
  privacyMode,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Available periods from transaction history
  const availablePeriods = Array.from(
    new Set(allTransactions.map(t => t.date.substring(0, 7)))
  ).sort().reverse();

  // Print report trigger
  const handlePrint = () => {
    window.print();
  };

  // Export CSV report
  const handleExportCSV = () => {
    const lines = [
      `RELATÓRIO FINANCEIRO MENSAL - AURAFINANCE (${report.period})`,
      `Gerado em: ${new Date(report.generatedAt).toLocaleString('pt-BR')}`,
      '',
      `RESUMO EXECUTIVO`,
      `Receitas Totais;${report.totalIncome.toFixed(2)}`,
      `Despesas Totais;${report.totalExpenses.toFixed(2)}`,
      `Saldo Líquido;${report.netSavings.toFixed(2)}`,
      `Taxa de Poupança;${report.savingsRate.toFixed(1)}%`,
      `Variação vs Mês Anterior;${report.previousMonthExpenseDiff.toFixed(1)}%`,
      '',
      `DESPESAS POR CATEGORIA`,
      `Categoria;Valor (R$);Participação (%);Quantidade de Lançamentos`,
      ...report.expensesByCategory.map(
        c => `${c.category};${c.total.toFixed(2)};${c.percentage.toFixed(1)}%;${c.transactionCount}`
      ),
      '',
      `MAIORES GASTOS DO MÊS`,
      `Data;Descrição;Categoria;Valor (R$)`,
      ...report.topExpenses.map(
        t => `${t.date};"${t.description.replace(/"/g, '""')}";${t.category};${t.amount.toFixed(2)}`
      ),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + lines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_mensal_${report.period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format period for display (e.g. "2026-10" -> "Outubro de 2026")
  const formatPeriodName = (p: string) => {
    const [y, m] = p.split('-');
    const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
    return dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Build SVG Donut Chart Paths
  const radius = 80;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print-container">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white capitalize">
              Relatório Mensal: {formatPeriodName(selectedPeriod)}
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Automático
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Diagnóstico de saúde financeira gerado automaticamente a partir das contas conectadas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => onSelectPeriod(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {availablePeriods.map(p => (
                <option key={p} value={p} className="bg-slate-900 text-white">
                  {formatPeriodName(p)}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Title Block (Only visible on print) */}
      <div className="hidden print:block mb-6 border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">AuraFinance - Relatório Executivo Mensal</h1>
        <p className="text-sm text-slate-600">
          Período: {formatPeriodName(selectedPeriod)} · Emitido em {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 print:text-slate-600">Receitas Totais</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
            {formatBRL(report.totalIncome, privacyMode)}
          </div>
          <div className="text-[11px] text-slate-400 print:text-slate-500">
            Salário e rendimentos conciliados
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 print:text-slate-600">Despesas Totais</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300 mb-1">
            {formatBRL(report.totalExpenses, privacyMode)}
          </div>
          <div className="text-[11px] text-slate-400 print:text-slate-500">
            {report.previousMonthExpenseDiff !== 0 ? (
              <span>{formatPercent(report.previousMonthExpenseDiff, true)} vs mês anterior</span>
            ) : (
              <span>Sem comparativo anterior</span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 print:text-slate-600">Saldo Líquido</span>
            <span className="text-xs font-mono text-slate-400">Receita - Despesa</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white print:text-slate-900 mb-1">
            {formatBRL(report.netSavings, privacyMode)}
          </div>
          <div className="text-[11px] text-slate-400 print:text-slate-500">
            {report.netSavings >= 0 ? 'Superávit no período' : 'Déficit no período'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 print:text-slate-600">Taxa de Poupança</span>
            <span className="text-xs font-mono text-emerald-400">Meta: 20%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white print:text-slate-900 mb-2">
            {privacyMode ? '••%' : `${report.savingsRate.toFixed(1)}%`}
          </div>
          <div className="w-full bg-slate-800 print:bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(report.savingsRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Automated Diagnostic Insights Section */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white print:text-slate-900">
            Diagnóstico Automático de Hábitos & Economia
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {report.aiInsights.map((insight, idx) => {
            const isPos = insight.type === 'positive';
            const isWarn = insight.type === 'warning';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 print:bg-slate-50 print:border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isPos && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isWarn && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    {!isPos && !isWarn && <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />}
                    <h4 className="text-xs font-semibold text-white print:text-slate-900 truncate">
                      {insight.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 print:text-slate-600 leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown by Category: Donut Chart & Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Donut Chart */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white print:text-slate-900">
              Distribuição por Categoria
            </h3>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="relative w-56 h-56 my-2">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth={strokeWidth}
              />

              {/* Segments */}
              {report.expensesByCategory.map((catItem) => {
                const strokeDasharray = `${(catItem.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                cumulativePercent += catItem.percentage;
                const color = CATEGORY_COLORS[catItem.category] || '#94a3b8';
                const isHovered = hoveredCategory === catItem.category;

                return (
                  <circle
                    key={catItem.category}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(catItem.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] text-slate-400">Total Gasto</span>
              <span className="text-sm font-bold font-mono text-white print:text-slate-900">
                {formatBRL(report.totalExpenses, privacyMode)}
              </span>
              {hoveredCategory && (
                <span className="text-[10px] text-emerald-400 font-medium truncate max-w-[110px] mt-0.5">
                  {hoveredCategory}
                </span>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-2">
            Passe o cursor sobre os arcos para inspecionar cada categoria
          </p>
        </div>

        {/* Category Table */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white print:text-slate-900">
              Detalhamento de Gastos Mensais
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {report.expensesByCategory.length} categorias
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-600 font-medium">
                  <th className="pb-2.5 font-normal">Categoria</th>
                  <th className="pb-2.5 font-normal text-right">Lançamentos</th>
                  <th className="pb-2.5 font-normal text-right">Participação</th>
                  <th className="pb-2.5 font-normal text-right">Total (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                {report.expensesByCategory.map((c) => {
                  const color = CATEGORY_COLORS[c.category] || '#94a3b8';
                  const isHovered = hoveredCategory === c.category;

                  return (
                    <tr
                      key={c.category}
                      onMouseEnter={() => setHoveredCategory(c.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`transition-colors ${
                        isHovered ? 'bg-slate-800/50 print:bg-slate-100' : 'hover:bg-slate-950/40'
                      }`}
                    >
                      <td className="py-2.5 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium text-white print:text-slate-900">{c.category}</span>
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-400 print:text-slate-600">
                        {c.transactionCount}
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-300 print:text-slate-700">
                        {c.percentage.toFixed(1)}%
                      </td>
                      <td className="py-2.5 text-right font-mono font-semibold text-white print:text-slate-900">
                        {formatBRL(c.total, privacyMode)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top 5 Expenses & Recurring Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Expenses */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white print:text-slate-900">
              Top 5 Maiores Gastos do Mês
            </h3>
            <span className="text-xs text-slate-400">Impactos prioritários</span>
          </div>

          <div className="space-y-2.5">
            {report.topExpenses.map((t, idx) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 print:bg-slate-50 print:border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 font-semibold w-4">
                    0{idx + 1}.
                  </span>
                  <div>
                    <div className="font-medium text-white print:text-slate-900 truncate max-w-xs">
                      {t.description}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatDate(t.date, 'short')} · {t.category}
                    </div>
                  </div>
                </div>
                <div className="font-mono font-semibold text-rose-300 print:text-rose-600 whitespace-nowrap">
                  {formatBRL(t.amount, privacyMode)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions & Recurring Charges */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white print:text-slate-900">
                Assinaturas & Custos Recorrentes
              </h3>
            </div>
            <span className="text-xs text-slate-400">Cobranças mensais fixas</span>
          </div>

          <div className="space-y-2.5">
            {report.recurringExpenses.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 print:bg-slate-50 print:border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-medium text-white print:text-slate-900">{rec.name}</div>
                  <div className="text-[11px] text-slate-400">{rec.category} · Cobrança mensal</div>
                </div>
                <div className="font-mono font-semibold text-slate-200 print:text-slate-800">
                  {formatBRL(rec.monthlyAmount, privacyMode)} /mês
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
