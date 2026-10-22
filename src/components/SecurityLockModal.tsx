import React, { useState } from 'react';
import { Shield, Fingerprint, Delete, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SecurityLockModalProps {
  isOpen: boolean;
  onUnlock: () => void;
  correctPin?: string;
}

export const SecurityLockModal: React.FC<SecurityLockModalProps> = ({
  isOpen,
  onUnlock,
  correctPin = '1234',
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [bioSuccess, setBioSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          setTimeout(() => {
            setPin('');
            onUnlock();
          }, 150);
        } else {
          setErrorMsg('PIN incorreto. Tente novamente ou use a biometria.');
          setTimeout(() => {
            setPin('');
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleBiometrics = () => {
    setBioSuccess(true);
    setTimeout(() => {
      setBioSuccess(false);
      setPin('');
      onUnlock();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Security Badge */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-500/5">
          <Shield className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-white mb-1">
          Cofre AuraFinance Bloqueado
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Seus dados bancários e relatórios estão protegidos com criptografia ponta a ponta.
        </p>

        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? 'bg-emerald-400 scale-110 shadow-sm shadow-emerald-400/50'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 mb-4 animate-shake">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {bioSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-4 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Autenticação biométrica confirmada!</span>
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-14 rounded-xl bg-slate-900/90 border border-slate-800 text-lg font-mono font-medium text-white hover:bg-slate-800 active:bg-slate-700 transition-colors flex items-center justify-center focus:outline-none"
            >
              {num}
            </button>
          ))}
          
          {/* Biometrics button */}
          <button
            onClick={handleBiometrics}
            className="h-14 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400 hover:bg-slate-800 active:bg-slate-700 transition-colors flex items-center justify-center focus:outline-none"
            title="Autenticar com Biometria"
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          {/* Zero */}
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-xl bg-slate-900/90 border border-slate-800 text-lg font-mono font-medium text-white hover:bg-slate-800 active:bg-slate-700 transition-colors flex items-center justify-center focus:outline-none"
          >
            0
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="h-14 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 active:bg-slate-700 transition-colors flex items-center justify-center focus:outline-none"
            title="Apagar dígito"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Bypass */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] text-slate-500">
            PIN padrão de demonstração: <strong className="text-slate-300 font-mono">1234</strong>
          </p>
          <button
            onClick={onUnlock}
            className="text-xs text-emerald-400 hover:underline transition-colors mt-1"
          >
            Desbloquear Imediatamente
          </button>
        </div>
      </div>
    </div>
  );
};
