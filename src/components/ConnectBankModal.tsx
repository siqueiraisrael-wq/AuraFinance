import React, { useState } from 'react';
import { X, Building2, Check, ArrowRight, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import { BankAccount } from '../types/finance';

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBankConnected: (newAccount: BankAccount) => void;
}

interface BankOption {
  code: string;
  name: string;
  color: string;
  initial: string;
  types: ('CHECKING' | 'CREDIT_CARD' | 'INVESTMENT' | 'SAVINGS')[];
  description: string;
}

const SUPPORTED_BANKS: BankOption[] = [
  { code: '260', name: 'Nubank', color: '#820AD1', initial: 'Nu', types: ['CHECKING', 'CREDIT_CARD'], description: 'Conta Digital & Cartão Roxinho / Ultravioleta' },
  { code: '341', name: 'Itaú Unibanco', color: '#EC7000', initial: 'It', types: ['CHECKING', 'CREDIT_CARD'], description: 'Itaú Personnalité & Cartões Uniclass' },
  { code: '001', name: 'Banco do Brasil', color: '#003882', initial: 'BB', types: ['CHECKING', 'CREDIT_CARD'], description: 'Conta Corrente & Ourocard' },
  { code: '237', name: 'Bradesco', color: '#CC092F', initial: 'Br', types: ['CHECKING', 'CREDIT_CARD'], description: 'Bradesco Prime & Cartões Elo/Visa' },
  { code: '033', name: 'Santander Brasil', color: '#EC0000', initial: 'San', types: ['CHECKING', 'CREDIT_CARD'], description: 'Santander Select & Cartões SX' },
  { code: '077', name: 'Banco Inter', color: '#FF7A00', initial: 'In', types: ['CHECKING', 'INVESTMENT'], description: 'Super App Global & Inter Invest' },
  { code: '336', name: 'C6 Bank', color: '#242424', initial: 'C6', types: ['CHECKING', 'CREDIT_CARD'], description: 'C6 Carbon & Conta Global BRL/USD' },
  { code: '208', name: 'BTG Pactual', color: '#001E62', initial: 'BTG', types: ['INVESTMENT', 'CHECKING'], description: 'Banking & Maior Banco de Investimentos' },
  { code: '104', name: 'Caixa Econômica', color: '#005CA9', initial: 'CX', types: ['CHECKING', 'SAVINGS'], description: 'Poupança & Conta Corrente Caixa' },
  { code: '102', name: 'XP Investimentos', color: '#111111', initial: 'XP', types: ['INVESTMENT'], description: 'Renda Fixa, Ações e Fundos Exclusivos' },
];

export const ConnectBankModal: React.FC<ConnectBankModalProps> = ({
  isOpen,
  onClose,
  onBankConnected,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  const [accountType, setAccountType] = useState<'CHECKING' | 'CREDIT_CARD' | 'INVESTMENT' | 'SAVINGS'>('CHECKING');
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectBank = (bank: BankOption) => {
    setSelectedBank(bank);
    setAccountType(bank.types[0]);
    setStep(2);
  };

  const handleConfirmConsent = () => {
    if (!selectedBank) return;
    setIsAuthorizing(true);
    setStep(3);

    // Simulate Open Finance Brasil BCB OAuth handshake
    setTimeout(() => {
      setIsAuthorizing(false);
      const newAcc: BankAccount = {
        id: `acc-${selectedBank.name.toLowerCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`,
        bankName: selectedBank.name,
        bankCode: selectedBank.code,
        accountType: accountType,
        accountNumberMasked: `Ag 0001 · ${accountType === 'CREDIT_CARD' ? 'Cartão Final 8492' : 'Cc 49821-3'}`,
        balance: accountType === 'CREDIT_CARD' ? 0 : Math.floor(Math.random() * 8000) + 1500,
        creditLimit: accountType === 'CREDIT_CARD' ? 12000 : undefined,
        creditUsed: accountType === 'CREDIT_CARD' ? 2450 : undefined,
        color: selectedBank.color,
        logoInitial: selectedBank.initial,
        openFinanceConnected: true,
        consentExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastSyncedAt: new Date().toISOString(),
        syncStatus: 'SYNCED',
      };

      onBankConnected(newAcc);
      setTimeout(() => {
        handleReset();
        onClose();
      }, 1000);
    }, 1800);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedBank(null);
    setIsAuthorizing(false);
    setSearchTerm('');
  };

  const filteredBanks = SUPPORTED_BANKS.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Conexão Bancária Open Finance</h3>
              <p className="text-xs text-slate-400">Regulamentado pelo Banco Central do Brasil</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Select Bank */}
        {step === 1 && (
          <div className="p-6">
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Selecione sua instituição financeira
            </label>
            <input
              type="text"
              placeholder="Buscar por nome ou código (ex: Nubank, Itaú, 341)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-4"
            />

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => handleSelectBank(bank)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-inner"
                      style={{ backgroundColor: bank.color }}
                    >
                      {bank.initial}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                        {bank.name}
                      </div>
                      <div className="text-xs text-slate-400">{bank.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Conexão direta criptografada com certificados digitais ICP-Brasil.</span>
            </div>
          </div>
        )}

        {/* Step 2: Consent and scopes */}
        {step === 2 && selectedBank && (
          <div className="p-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: selectedBank.color }}
              >
                {selectedBank.initial}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{selectedBank.name}</h4>
                <p className="text-xs text-slate-400">Código de compensação {selectedBank.code}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Tipo de Conta a Integrar
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('CHECKING')}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                    accountType === 'CHECKING'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Conta Corrente / Salário
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('CREDIT_CARD')}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                    accountType === 'CREDIT_CARD'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cartão de Crédito
                </button>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-xs space-y-2 mb-6">
              <span className="font-semibold text-slate-200 block mb-1">
                Permissões solicitadas (Apenas Leitura):
              </span>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Consulta de saldos e limites de crédito em tempo real</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Extrato de transações dos últimos 90 dias com categorização</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Validade do consentimento: 12 meses (revogável a qualquer momento)</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmConsent}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Autorizar via Open Finance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Authorizing & Syncing */}
        {step === 3 && (
          <div className="p-8 text-center flex flex-col items-center">
            {isAuthorizing ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <h4 className="text-base font-semibold text-white mb-1">
                  Estabelecendo Conexão Segura
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Validando token OAuth 2.0 no diretório de participantes do Banco Central do Brasil...
                </p>
                <div className="w-full max-w-xs bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-3/4 animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold text-white mb-1">
                  Conta Conectada com Sucesso!
                </h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Suas transações e saldos foram importados e sincronizados com alta segurança.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
