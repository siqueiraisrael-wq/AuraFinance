import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, ArrowRight } from 'lucide-react';
import { BankAccount, Transaction } from '../types/finance';
import { parseBankStatement, formatBRL } from '../utils/formatters';

interface OFXImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onImportTransactions: (transactions: Transaction[], accountId: string) => void;
}

export const OFXImportModal: React.FC<OFXImportModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onImportTransactions,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [parsedList, setParsedList] = useState<Transaction[]>([]);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setFileContent(content);
        const parsed = parseBankStatement(content, selectedAccountId);
        setParsedList(parsed);
        setStep('preview');
      }
    };
    reader.readAsText(file);
  };

  const handlePasteDemo = (type: 'nubank' | 'itau') => {
    let sample = '';
    if (type === 'nubank') {
      sample = `Data,Descrição,Valor
2026-10-18,Pão de Açúcar Mercado,-320.50
2026-10-19,Uber Viagem Centro,-34.20
2026-10-20,Restaurante Paris 6,-180.00
2026-10-21,Drogasil Medicamentos,-89.90
2026-10-22,Transferência Pix Recebida,1500.00`;
      setFileName('extrato_nubank_outubro.csv');
    } else {
      sample = `<OFX>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261019
<TRNAMT>-149.90
<FITID>ITAU-948102
<MEMO>CLARO FIBRA INTERNET
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261020
<TRNAMT>-210.00
<FITID>ITAU-948103
<MEMO>POSTO IPIRANGA GASOLINA
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20261021
<TRNAMT>850.00
<FITID>ITAU-948104
<MEMO>PIX RECEBIDO JOAO SILVA
</STMTTRN>
</OFX>`;
      setFileName('extrato_itau_ofx.ofx');
    }

    setFileContent(sample);
    const parsed = parseBankStatement(sample, selectedAccountId);
    setParsedList(parsed);
    setStep('preview');
  };

  const handleConfirmImport = () => {
    if (parsedList.length > 0) {
      onImportTransactions(parsedList, selectedAccountId);
      onClose();
      setStep('upload');
      setFileContent('');
      setParsedList([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Importar Extrato Bancário</h3>
              <p className="text-xs text-slate-400">Compatível com arquivos .OFX e .CSV de qualquer banco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'upload' ? (
          <div className="p-6">
            {/* Account Selector */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Conta de Destino para as Transações
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} - {acc.accountNumberMasked} ({formatBRL(acc.balance)})
                  </option>
                ))}
              </select>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-950/50 mb-4 group cursor-pointer relative">
              <input
                type="file"
                accept=".ofx,.csv,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 mx-auto mb-3 transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-white mb-1">
                Clique para selecionar ou arraste o arquivo aqui
              </p>
              <p className="text-xs text-slate-400">
                Formatos suportados: Extrato OFX bancário ou Planilha CSV
              </p>
            </div>

            {/* Quick Demo Pre-fill */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                Ou teste instantaneamente com exemplos reais:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePasteDemo('nubank')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Carregar Exemplo CSV Nubank
                </button>
                <button
                  type="button"
                  onClick={() => handlePasteDemo('itau')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Carregar Exemplo OFX Itaú
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-slate-400">Arquivo identificado</span>
                <h4 className="text-sm font-semibold text-white">{fileName}</h4>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {parsedList.length} transações detectadas
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 mb-5 pr-1">
              {parsedList.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{tx.description}</span>
                    <span className="text-[11px] text-slate-400">
                      {tx.date} · Categoria: <strong className="text-slate-300">{tx.category}</strong>
                    </span>
                  </div>
                  <span
                    className={`font-mono font-semibold ${
                      tx.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'} {formatBRL(tx.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Importar {parsedList.length} Transações</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
