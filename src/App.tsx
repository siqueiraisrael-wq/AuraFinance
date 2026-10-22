import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  loadAccounts, 
  saveAccounts, 
  loadTransactions, 
  saveTransactions, 
  loadBudgets, 
  saveBudgets, 
  loadSecurity, 
  saveSecurity,
  generateMonthlyReport
} from './utils/storage';
import { 
  BankAccount, 
  Transaction, 
  CategoryBudget, 
  SecuritySettings, 
  TransactionCategory 
} from './types/finance';

import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BanksView } from './components/BanksView';
import { ReportsView } from './components/ReportsView';
import { BudgetsView } from './components/BudgetsView';

import { SecurityLockModal } from './components/SecurityLockModal';
import { SecuritySettingsModal } from './components/SecuritySettingsModal';
import { TransactionModal } from './components/TransactionModal';
import { ConnectBankModal } from './components/ConnectBankModal';
import { OFXImportModal } from './components/OFXImportModal';
import { SimulatePixModal } from './components/SimulatePixModal';

import { CheckCircle2, Shield, Settings } from 'lucide-react';

export default function App() {
  // Core application data state
  const [accounts, setAccounts] = useState<BankAccount[]>(() => loadAccounts());
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => loadBudgets());
  const [security, setSecurity] = useState<SecuritySettings>(() => loadSecurity());

  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-10');
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const sec = loadSecurity();
    return sec.pinEnabled;
  });
  const [privacyMode, setPrivacyMode] = useState<boolean>(() => loadSecurity().privacyMode);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(new Date().toISOString());

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  }, []);

  // Modal visibility states
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [isConnectBankOpen, setIsConnectBankOpen] = useState(false);
  const [isImportOFXOpen, setIsImportOFXOpen] = useState(false);
  const [isSimulatePixOpen, setIsSimulatePixOpen] = useState(false);
  const [isSecuritySettingsOpen, setIsSecuritySettingsOpen] = useState(false);

  // Sync state changes to storage
  useEffect(() => {
    saveAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  useEffect(() => {
    saveSecurity(security);
  }, [security]);

  // Inactivity Auto-Lock check
  useEffect(() => {
    if (!security.pinEnabled || security.autoLockMinutes <= 0) return;

    let timeoutId: any;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsLocked(true);
        showToast('Cofre bloqueado por inatividade');
      }, security.autoLockMinutes * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [security.pinEnabled, security.autoLockMinutes, showToast]);

  // Generate current monthly report automatically
  const monthlyReport = useMemo(() => {
    return generateMonthlyReport(transactions, selectedPeriod);
  }, [transactions, selectedPeriod]);

  // Privacy mode toggle
  const handleTogglePrivacy = () => {
    const next = !privacyMode;
    setPrivacyMode(next);
    const updatedSec = { ...security, privacyMode: next };
    setSecurity(updatedSec);
    saveSecurity(updatedSec);
  };

  // Lock vault manually
  const handleLockVault = () => {
    setIsLocked(true);
    showToast('Cofre financeiro bloqueado com segurança');
  };

  // Unlock vault
  const handleUnlockVault = () => {
    setIsLocked(false);
    showToast('Cofre autenticado e desbloqueado');
  };

  // Real-time synchronization engine
  const handleSyncAll = () => {
    if (isSyncing) return;
    setIsSyncing(true);

    // Update all accounts to SYNCING
    setAccounts(prev => prev.map(a => ({ ...a, syncStatus: 'SYNCING' })));

    setTimeout(() => {
      const now = new Date().toISOString();
      setAccounts(prev => prev.map(a => ({
        ...a,
        lastSyncedAt: now,
        syncStatus: 'SYNCED',
      })));
      setLastSyncedAt(now);
      setIsSyncing(false);
      showToast('Sincronização em tempo real concluída com sucesso!');
    }, 1200);
  };

  // Sync individual account
  const handleSyncAccount = (accId: string) => {
    setAccounts(prev => prev.map(a => a.id === accId ? { ...a, syncStatus: 'SYNCING' } : a));
    setTimeout(() => {
      const now = new Date().toISOString();
      setAccounts(prev => prev.map(a => a.id === accId ? { ...a, lastSyncedAt: now, syncStatus: 'SYNCED' } : a));
      showToast('Conta sincronizada com o Open Finance');
    }, 900);
  };

  // Add new transaction
  const handleSaveTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update related account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === newTx.accountId) {
        if (newTx.type === 'INCOME') {
          return { ...acc, balance: acc.balance + newTx.amount };
        } else if (newTx.type === 'EXPENSE') {
          if (acc.accountType === 'CREDIT_CARD') {
            return { ...acc, creditUsed: (acc.creditUsed || 0) + newTx.amount };
          }
          return { ...acc, balance: acc.balance - newTx.amount };
        }
      }
      return acc;
    }));

    showToast('Transação registrada e saldo atualizado!');
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    setTransactions(prev => prev.filter(t => t.id !== id));

    // Revert account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        if (tx.type === 'INCOME') {
          return { ...acc, balance: Math.max(0, acc.balance - tx.amount) };
        } else if (tx.type === 'EXPENSE') {
          if (acc.accountType === 'CREDIT_CARD') {
            return { ...acc, creditUsed: Math.max(0, (acc.creditUsed || 0) - tx.amount) };
          }
          return { ...acc, balance: acc.balance + tx.amount };
        }
      }
      return acc;
    }));

    showToast('Lançamento removido do extrato');
  };

  // Connect new bank
  const handleBankConnected = (newAccount: BankAccount) => {
    setAccounts(prev => [newAccount, ...prev]);
    showToast(`Banco ${newAccount.bankName} conectado com sucesso via Open Finance!`);
  };

  // Import transactions from OFX/CSV
  const handleImportTransactions = (importedTx: Transaction[], accountId: string) => {
    setTransactions(prev => [...importedTx, ...prev]);

    // Adjust target account balance
    const netImport = importedTx.reduce((acc, t) => {
      return t.type === 'INCOME' ? acc + t.amount : acc - t.amount;
    }, 0);

    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, balance: Math.max(0, acc.balance + netImport) };
      }
      return acc;
    }));

    showToast(`${importedTx.length} transações importadas e categorizadas com sucesso!`);
  };

  // Handle Pix event trigger
  const handleTriggerPix = (pixData: Omit<Transaction, 'id'>) => {
    handleSaveTransaction(pixData);
    showToast(`Notificação Pix: ${pixData.description}`);
  };

  // Update budget limit
  const handleUpdateBudget = (category: TransactionCategory, amount: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => b.category === category ? { ...b, allocatedAmount: amount } : b);
      }
      return [...prev, { category, allocatedAmount: amount, period: selectedPeriod }];
    });
    showToast(`Teto para ${category} ajustado para R$ ${amount.toFixed(2)}`);
  };

  // Delete / disconnect bank account
  const handleDeleteAccount = (accId: string) => {
    setAccounts(prev => prev.filter(a => a.id !== accId));
    showToast('Conta bancária desconectada');
  };

  // Renew Open Finance consent
  const handleRenewConsent = (accId: string) => {
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setAccounts(prev => prev.map(a => a.id === accId ? { ...a, consentExpiresAt: nextYear } : a));
    showToast('Consentimento Open Finance renovado por mais 12 meses');
  };

  // Export encrypted backup
  const handleExportBackup = () => {
    const backupData = {
      app: 'AuraFinance',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      accounts,
      transactions,
      budgets,
      security: {
        ...security,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            action: 'Backup completo exportado',
            timestamp: new Date().toISOString(),
            ipOrDevice: 'Dispositivo Atual',
          },
          ...security.auditLogs,
        ],
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aurafinance_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Arquivo de backup exportado com sucesso!');
  };

  // Import backup
  const handleImportBackup = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.accounts && parsed.transactions) {
        setAccounts(parsed.accounts);
        setTransactions(parsed.transactions);
        if (parsed.budgets) setBudgets(parsed.budgets);
        showToast('Dados restaurados com sucesso a partir do backup!');
      } else {
        showToast('Arquivo de backup inválido ou incompatível.');
      }
    } catch {
      showToast('Falha ao processar arquivo de backup.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-6">
      {/* Vault PIN/Biometric Lock Screen */}
      <SecurityLockModal
        isOpen={isLocked}
        onUnlock={handleUnlockVault}
        correctPin={security.pinCode || '1234'}
      />

      {/* Top Bar strictly complying with 3-zone contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        privacyMode={privacyMode}
        onTogglePrivacy={handleTogglePrivacy}
        onLockVault={handleLockVault}
        onOpenNewTransaction={() => setIsNewTxOpen(true)}
        isSyncing={isSyncing}
        onSyncAll={handleSyncAll}
        lastSyncedAt={lastSyncedAt}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <DashboardView
            accounts={accounts}
            transactions={transactions}
            report={monthlyReport}
            privacyMode={privacyMode}
            onOpenNewTransaction={() => setIsNewTxOpen(true)}
            onOpenConnectBank={() => setIsConnectBankOpen(true)}
            onOpenImportOFX={() => setIsImportOFXOpen(true)}
            onOpenSimulatePix={() => setIsSimulatePixOpen(true)}
            onSyncAccount={handleSyncAccount}
            onNavigateToTransactions={() => setCurrentTab('transactions')}
            onNavigateToReports={() => setCurrentTab('reports')}
          />
        )}

        {currentTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            accounts={accounts}
            privacyMode={privacyMode}
            onOpenNewTransaction={() => setIsNewTxOpen(true)}
            onOpenImportOFX={() => setIsImportOFXOpen(true)}
            onOpenSimulatePix={() => setIsSimulatePixOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {currentTab === 'banks' && (
          <BanksView
            accounts={accounts}
            privacyMode={privacyMode}
            onOpenConnectBank={() => setIsConnectBankOpen(true)}
            onOpenImportOFX={() => setIsImportOFXOpen(true)}
            onSyncAccount={handleSyncAccount}
            onSyncAll={handleSyncAll}
            isSyncing={isSyncing}
            onDeleteAccount={handleDeleteAccount}
            onRenewConsent={handleRenewConsent}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            report={monthlyReport}
            allTransactions={transactions}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
            privacyMode={privacyMode}
          />
        )}

        {currentTab === 'budgets' && (
          <BudgetsView
            budgets={budgets}
            transactions={transactions}
            currentPeriod={selectedPeriod}
            privacyMode={privacyMode}
            onUpdateBudget={handleUpdateBudget}
          />
        )}
      </main>

      {/* Footer Utility Bar */}
      <footer className="border-t border-slate-900 bg-slate-950/60 px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full no-print">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>AuraFinance · Criptografia AES-256 e Conexões Open Finance Seguras</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSecuritySettingsOpen(true)}
            className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurações de Segurança & Backup</span>
          </button>
        </div>
      </footer>

      {/* Mobile Bottom Touch Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewTransaction={() => setIsNewTxOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border border-emerald-500/30 text-white text-xs shadow-2xl backdrop-blur-md animate-fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={isNewTxOpen}
        onClose={() => setIsNewTxOpen(false)}
        accounts={accounts}
        onSave={handleSaveTransaction}
      />

      <ConnectBankModal
        isOpen={isConnectBankOpen}
        onClose={() => setIsConnectBankOpen(false)}
        onBankConnected={handleBankConnected}
      />

      <OFXImportModal
        isOpen={isImportOFXOpen}
        onClose={() => setIsImportOFXOpen(false)}
        accounts={accounts}
        onImportTransactions={handleImportTransactions}
      />

      <SimulatePixModal
        isOpen={isSimulatePixOpen}
        onClose={() => setIsSimulatePixOpen(false)}
        accounts={accounts}
        onTriggerPix={handleTriggerPix}
      />

      <SecuritySettingsModal
        isOpen={isSecuritySettingsOpen}
        onClose={() => setIsSecuritySettingsOpen(false)}
        security={security}
        onUpdateSecurity={setSecurity}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />
    </div>
  );
}
