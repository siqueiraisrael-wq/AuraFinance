import React from 'react';
import { Shield, Eye, EyeOff, RefreshCw, Lock, Plus } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onLockVault: () => void;
  onOpenNewTransaction: () => void;
  isSyncing: boolean;
  onSyncAll: () => void;
  lastSyncedAt: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  privacyMode,
  onTogglePrivacy,
  onLockVault,
  onOpenNewTransaction,
  isSyncing,
  onSyncAll,
  lastSyncedAt,
}) => {
  const formatSyncTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Agora';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Aura<span className="text-emerald-400">Finance</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4–5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'dashboard' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => onSelectTab('transactions')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'transactions' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            Transações
          </button>
          <button
            onClick={() => onSelectTab('banks')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'banks' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            Contas & Open Finance
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'reports' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            Relatórios Automáticos
          </button>
          <button
            onClick={() => onSelectTab('budgets')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'budgets' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
            }`}
          >
            Orçamentos
          </button>
        </nav>

        {/* Zone 3: 1 primary action & utility controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Real-time Sync Status Button */}
          <button
            onClick={onSyncAll}
            disabled={isSyncing}
            title={`Sincronização em tempo real ativa. Última às ${formatSyncTime(lastSyncedAt)}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden xl:inline text-slate-400 font-mono text-[11px]">
              Sync {formatSyncTime(lastSyncedAt)}
            </span>
          </button>

          {/* Privacy Mask Toggle */}
          <button
            onClick={onTogglePrivacy}
            title={privacyMode ? 'Mostrar valores' : 'Ocultar valores (Modo Privacidade)'}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            aria-label="Alternar modo privacidade"
          >
            {privacyMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Vault Lock Button */}
          <button
            onClick={onLockVault}
            title="Bloquear cofre de segurança"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            aria-label="Bloquear cofre de segurança"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Transação</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
