import React, { useState } from 'react';
import { X, Shield, Lock, Download, Upload, CheckCircle2, History } from 'lucide-react';
import { SecuritySettings } from '../types/finance';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  security: SecuritySettings;
  onUpdateSecurity: (newSec: SecuritySettings) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  onClose,
  security,
  onUpdateSecurity,
  onExportBackup,
  onImportBackup,
}) => {
  const [activeTab, setActiveTab] = useState<'security' | 'backup' | 'audit'>('security');
  const [pinInput, setPinInput] = useState(security.pinCode || '1234');
  const [pinEnabled, setPinEnabled] = useState(security.pinEnabled);
  const [biometricsEnabled, setBiometricsEnabled] = useState(security.biometricsEnabled);
  const [autoLockMinutes, setAutoLockMinutes] = useState(security.autoLockMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4) return;

    const updated: SecuritySettings = {
      ...security,
      pinEnabled,
      pinCode: pinInput,
      biometricsEnabled,
      autoLockMinutes,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          action: 'Configurações de segurança atualizadas',
          timestamp: new Date().toISOString(),
          ipOrDevice: 'Dispositivo Atual (AES-256 GCM)',
        },
        ...security.auditLogs,
      ],
    };

    onUpdateSecurity(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Segurança & Privacidade</h3>
              <p className="text-xs text-slate-400">Proteção de dados, cofre biométrico e backups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-emerald-400 text-emerald-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Bloqueio & PIN
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'backup'
                ? 'border-emerald-400 text-emerald-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Backup & Restauração
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-emerald-400 text-emerald-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Auditoria & Sessões
          </button>
        </div>

        {/* Tab 1: PIN & Biometrics */}
        {activeTab === 'security' && (
          <form onSubmit={handleSaveSecurity} className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-sm font-semibold text-white block">Exigir PIN para Acesso</span>
                <span className="text-xs text-slate-400">Bloqueia a tela ao abrir o app ou após inatividade</span>
              </div>
              <input
                type="checkbox"
                checked={pinEnabled}
                onChange={(e) => setPinEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900 cursor-pointer"
              />
            </div>

            {pinEnabled && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Código PIN Numérico (4 Dígitos)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-32 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-lg tracking-widest text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-300">Permitir Biometria (Touch ID / Face ID)</span>
                  <input
                    type="checkbox"
                    checked={biometricsEnabled}
                    onChange={(e) => setBiometricsEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bloqueio Automático por Inatividade
                  </label>
                  <select
                    value={autoLockMinutes}
                    onChange={(e) => setAutoLockMinutes(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={1}>Após 1 minuto</option>
                    <option value={5}>Após 5 minutos (Recomendado)</option>
                    <option value={15}>Após 15 minutos</option>
                    <option value={0}>Nunca bloquear automaticamente</option>
                  </select>
                </div>
              </div>
            )}

            {savedSuccess && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
              >
                Fechar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Backup & Restore */}
        {activeTab === 'backup' && (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <Download className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">Exportar Backup Completo</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Gera um arquivo .json seguro contendo todas as contas, extratos, relatórios e metas configuradas.
                </p>
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo de Backup</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <Upload className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">Restaurar Dados</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Carregue um arquivo de backup previamente exportado para restabelecer seus dados.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-sky-400" />
                  <span>Selecionar Arquivo .json</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Registro de Atividades de Segurança
              </h4>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {security.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-200 font-medium mb-1">
                    <span>{log.action}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{log.ipOrDevice}</span>
                    <span>{new Date(log.timestamp).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
