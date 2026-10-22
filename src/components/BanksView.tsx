import React from 'react';
import { 
  Building2, 
  RefreshCw, 
  Plus, 
  FileSpreadsheet, 
  ShieldCheck, 
  Calendar, 
  Trash2,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
import { BankAccount } from '../types/finance';
import { formatBRL, formatDate } from '../utils/formatters';

interface BanksViewProps {
  accounts: BankAccount[];
  privacyMode: boolean;
  onOpenConnectBank: () => void;
  onOpenImportOFX: () => void;
  onSyncAccount: (id: string) => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  onDeleteAccount: (id: string) => void;
  onRenewConsent: (id: string) => void;
}

export const BanksView: React.FC<BanksViewProps> = ({
  accounts,
  privacyMode,
  onOpenConnectBank,
  onOpenImportOFX,
  onSyncAccount,
  onSyncAll,
  isSyncing,
  onDeleteAccount,
  onRenewConsent,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header and Action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Contas & Open Finance Brasil</h2>
          <p className="text-xs text-slate-400">
            Gerencie integrações bancárias diretas, consentimentos e sincronização contínua
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSyncAll}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sincronizar Todas</span>
          </button>
          <button
            onClick={onOpenImportOFX}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
            <span>Importar Extrato OFX/CSV</span>
          </button>
          <button
            onClick={onOpenConnectBank}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Conectar Nova Instituição</span>
          </button>
        </div>
      </div>

      {/* Security Assurance Banner */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-semibold text-emerald-300 block">
              Padrão Oficial Open Finance Brasil (Resolução Conjunta nº 1/2020 BACEN)
            </span>
            <span className="text-slate-300">
              O AuraFinance conecta-se via APIs abertas e oficiais apenas em modo leitura, com criptografia de ponta a ponta.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span>Diretório BCB Ativo</span>
        </div>
      </div>

      {/* Connected Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((acc) => {
          const isCard = acc.accountType === 'CREDIT_CARD';
          const creditUsagePercent = isCard && acc.creditLimit
            ? Math.min(100, Math.round(((acc.creditUsed || 0) / acc.creditLimit) * 100))
            : 0;

          return (
            <div
              key={acc.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{ backgroundColor: acc.color }}
                    >
                      {acc.logoInitial}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{acc.bankName}</h3>
                      <p className="text-[11px] text-slate-400">{acc.accountNumberMasked}</p>
                    </div>
                  </div>

                  {acc.openFinanceConnected ? (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Conectado</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      Manual
                    </span>
                  )}
                </div>

                {/* Balances */}
                <div className="mb-4">
                  <span className="text-xs text-slate-400 block mb-0.5">
                    {isCard ? 'Fatura Aberta Atual' : 'Saldo em Conta'}
                  </span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {isCard
                      ? formatBRL(acc.creditUsed || 0, privacyMode)
                      : formatBRL(acc.balance, privacyMode)}
                  </div>

                  {isCard && acc.creditLimit && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Limite Total: {formatBRL(acc.creditLimit, privacyMode)}</span>
                        <span>{creditUsagePercent}% utilizado</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            creditUsagePercent > 80 ? 'bg-rose-500' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${creditUsagePercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Open Finance Metadata */}
                {acc.openFinanceConnected && (
                  <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Consentimento até:</span>
                      </span>
                      <span className="text-slate-300 font-mono">
                        {acc.consentExpiresAt ? formatDate(acc.consentExpiresAt, 'short') : 'Indeterminado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Última Sincronização:</span>
                      </span>
                      <span className="text-slate-300 font-mono">
                        {new Date(acc.lastSyncedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {acc.openFinanceConnected ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSyncAccount(acc.id)}
                      disabled={acc.syncStatus === 'SYNCING'}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${acc.syncStatus === 'SYNCING' ? 'animate-spin text-emerald-400' : ''}`} />
                      <span>{acc.syncStatus === 'SYNCING' ? 'Sincronizando...' : 'Sincronizar'}</span>
                    </button>
                    <button
                      onClick={() => onRenewConsent(acc.id)}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      Renovar
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500">Lançamentos manuais</span>
                )}

                <button
                  onClick={() => onDeleteAccount(acc.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Desconectar ou remover conta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
