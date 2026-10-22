import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { BankAccount, Transaction, TransactionCategory, TransactionType } from '../types/finance';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onSave: (tx: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES: TransactionCategory[] = [
  'Alimentação',
  'Supermercado',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Compras',
  'Assinaturas',
  'Salário',
  'Investimentos',
  'Serviços',
  'Outros',
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSave,
}) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Alimentação');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;
    if (!description.trim()) return;

    onSave({
      accountId: accountId || accounts[0]?.id || 'acc-cash',
      type,
      category: type === 'INCOME' && category === 'Alimentação' ? 'Salário' : category,
      description: description.trim(),
      amount: cleanAmount,
      date,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'COMPLETED',
      isRecurring,
      notes: notes.trim() || undefined,
    });

    // Reset and close
    setDescription('');
    setAmountStr('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white">Nova Movimentação Financeira</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selector (Despesa, Receita, Transferência) */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'EXPENSE'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setType('TRANSFER')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'TRANSFER'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transferência
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Valor (R$) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0,00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-lg font-mono font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Descrição do Lançamento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Supermercado, Almoço de trabalho, Pix recebido..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Account & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Conta / Banco *
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} ({acc.accountType === 'CREDIT_CARD' ? 'Cartão' : 'Conta'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Recurring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Data do Evento
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-4 sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950 w-4 h-4 cursor-pointer"
                />
                <span>Despesa / Receita Recorrente Fixa</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Observações (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Dividido com 2 amigos, número do comprovante..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Transação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
