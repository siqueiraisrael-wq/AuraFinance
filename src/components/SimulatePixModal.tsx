import React, { useState } from 'react';
import { X, Zap, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BankAccount, Transaction } from '../types/finance';
import { formatBRL } from '../utils/formatters';

interface SimulatePixModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onTriggerPix: (tx: Omit<Transaction, 'id'>) => void;
}

export const SimulatePixModal: React.FC<SimulatePixModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onTriggerPix,
}) => {
  const [direction, setDirection] = useState<'RECEIVE' | 'SEND'>('RECEIVE');
  const [payerName, setPayerName] = useState('Mariana Costa');
  const [amountStr, setAmountStr] = useState('350.00');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [description, setDescription] = useState('Transferência Pix Instantânea');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountStr);
    if (isNaN(val) || val <= 0) return;

    setIsSuccess(true);
    setTimeout(() => {
      onTriggerPix({
        accountId: accountId || accounts[0]?.id || 'acc-nubank',
        type: direction === 'RECEIVE' ? 'INCOME' : 'EXPENSE',
        category: direction === 'RECEIVE' ? 'Salário' : 'Outros',
        description: `${direction === 'RECEIVE' ? 'Pix Recebido de' : 'Pix Enviado para'} ${payerName} - ${description}`,
        amount: val,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'COMPLETED',
        bankTxId: `PIX-BCB-${Date.now().toString().slice(-8)}`,
      });
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  const quickPresets = [
    { label: 'Pix Recebido Freelance', direction: 'RECEIVE' as const, name: 'Studio Criativo Tech', val: 2400.00, desc: 'Desenvolvimento Web' },
    { label: 'Pix Recebido Almoço', direction: 'RECEIVE' as const, name: 'Carlos Eduardo', val: 45.00, desc: 'Divisão restaurante' },
    { label: 'Pix Pago Farmácia', direction: 'SEND' as const, name: 'Drogaria São Paulo', val: 112.50, desc: 'Medicamentos prescritos' },
    { label: 'Pix Pago Padaria', direction: 'SEND' as const, name: 'Padaria Bella Paulista', val: 32.80, desc: 'Café da manhã' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Simulador Pix em Tempo Real</h3>
              <p className="text-xs text-slate-400">Teste eventos de notificação e conciliação bancária</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1">
              Pix Processado em 0.2s!
            </h4>
            <p className="text-xs text-slate-400">
              Notificação enviada e saldo atualizado em tempo real.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSimulate} className="p-6 space-y-4">
            {/* Direction Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setDirection('RECEIVE')}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  direction === 'RECEIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Receber Pix (+)</span>
              </button>
              <button
                type="button"
                onClick={() => setDirection('SEND')}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  direction === 'SEND'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Pagar Pix (-)</span>
              </button>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Cenários Rápidos:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDirection(p.direction);
                      setPayerName(p.name);
                      setAmountStr(p.val.toFixed(2));
                      setDescription(p.desc);
                    }}
                    className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 hover:text-white text-left transition-colors"
                  >
                    <div className="font-medium truncate">{p.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{formatBRL(p.val)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-base font-mono font-semibold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Contact Name & Account */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {direction === 'RECEIVE' ? 'Pagador (Nome)' : 'Favorecido (Nome)'}
                </label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Conta Creditada/Debitada
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName}
                    </option>
                  ))}
                </select>
              </div>
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
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Disparar Evento Pix Agora</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
