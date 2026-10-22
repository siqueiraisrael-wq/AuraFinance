import React from 'react';
import { LayoutDashboard, ReceiptText, Plus, BarChart3, Building2 } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewTransaction: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewTransaction,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around no-print safe-area-pb">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 transition-colors ${
          currentTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap">Início</span>
      </button>

      <button
        onClick={() => onSelectTab('transactions')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 transition-colors ${
          currentTab === 'transactions' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <ReceiptText className="w-5 h-5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap">Extrato</span>
      </button>

      {/* Center Action Button */}
      <div className="relative -top-3">
        <button
          onClick={onOpenNewTransaction}
          className="w-12 h-12 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform"
          aria-label="Adicionar nova transação"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      <button
        onClick={() => onSelectTab('reports')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 transition-colors ${
          currentTab === 'reports' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BarChart3 className="w-5 h-5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap">Relatórios</span>
      </button>

      <button
        onClick={() => onSelectTab('banks')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 transition-colors ${
          currentTab === 'banks' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Building2 className="w-5 h-5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap">Contas</span>
      </button>
    </nav>
  );
};
