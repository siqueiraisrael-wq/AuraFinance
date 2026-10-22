import { Transaction, TransactionCategory, TransactionType } from '../types/finance';

/**
 * Format number to Brazilian Real (R$) currency with optional privacy masking
 */
export function formatBRL(value: number, privacyMode: boolean = false): string {
  if (privacyMode) {
    return 'R$ ••••••';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, includeSign: boolean = false): string {
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(value));

  if (includeSign) {
    if (value > 0) return `+${formatted}%`;
    if (value < 0) return `-${formatted}%`;
  }
  return `${formatted}%`;
}

/**
 * Format ISO date string (YYYY-MM-DD) to friendly PT-BR representation
 */
export function formatDate(dateStr: string, mode: 'short' | 'long' | 'day-month' = 'short'): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month, day);

  if (mode === 'short') {
    return dateObj.toLocaleDateString('pt-BR');
  }

  if (mode === 'day-month') {
    return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Smart automatic categorizer based on merchant description keywords
 */
export function autoCategorizeDescription(description: string): { category: TransactionCategory; type: TransactionType } {
  const upper = description.toUpperCase();

  // Income heuristics
  if (upper.includes('SALARIO') || upper.includes('FOLHA') || upper.includes('PRO-LABORE') || upper.includes('REMUNERACAO') || upper.includes('TED RECEBIDA') || upper.includes('PIX RECEBIDO - EMPRESA') || upper.includes('DIVIDENDOS')) {
    return { category: 'Salário', type: 'INCOME' };
  }
  if (upper.includes('RENDIMENTO') || upper.includes('CDB') || upper.includes('TESOURO') || upper.includes('DIVIDENDO') || upper.includes('RESGATE')) {
    return { category: 'Investimentos', type: 'INCOME' };
  }

  // Supermarket
  if (upper.includes('MERCADO') || upper.includes('SUPERMERCADO') || upper.includes('PAO DE ACUCAR') || upper.includes('CARREFOUR') || upper.includes('ASSAI') || upper.includes('ATACADAO') || upper.includes('HORTIFRUTI') || upper.includes('EXTRA') || upper.includes('BIG')) {
    return { category: 'Supermercado', type: 'EXPENSE' };
  }

  // Food & Dining
  if (upper.includes('IFOOD') || upper.includes('RESTAURANTE') || upper.includes('PADARIA') || upper.includes('BURGER') || upper.includes('MCDONALD') || upper.includes('SUBWAY') || upper.includes('PIZZARIA') || upper.includes('LANCHONETE') || upper.includes('CAFE') || upper.includes('STARBUCKS') || upper.includes('BAR')) {
    return { category: 'Alimentação', type: 'EXPENSE' };
  }

  // Transport
  if (upper.includes('UBER') || upper.includes('99APP') || upper.includes('POSTO') || upper.includes('GASOLINA') || upper.includes('SHELL') || upper.includes('IPIRANGA') || upper.includes('PETROBRAS') || upper.includes('ESTACIONAMENTO') || upper.includes('SEM PARAR') || upper.includes('VELOE') || upper.includes('METRO') || upper.includes('PEDAGIO')) {
    return { category: 'Transporte', type: 'EXPENSE' };
  }

  // Housing
  if (upper.includes('ALUGUEL') || upper.includes('CONDOMINIO') || upper.includes('ENEL') || upper.includes('CPFL') || upper.includes('SABESP') || upper.includes('LUZ') || upper.includes('AGUA') || upper.includes('GAS') || upper.includes('IPTU') || upper.includes('CLARO') || upper.includes('VIVO') || upper.includes('INTERNET')) {
    return { category: 'Moradia', type: 'EXPENSE' };
  }

  // Subscriptions & Digital
  if (upper.includes('NETFLIX') || upper.includes('SPOTIFY') || upper.includes('AMAZON PRIME') || upper.includes('HBO') || upper.includes('DISNEY') || upper.includes('APPLE.COM') || upper.includes('GOOGLE STORAGE') || upper.includes('YOUTUBE') || upper.includes('CHATGPT') || upper.includes('SMART FIT') || upper.includes('GYMPASS')) {
    return { category: 'Assinaturas', type: 'EXPENSE' };
  }

  // Health
  if (upper.includes('FARMACIA') || upper.includes('DROGASIL') || upper.includes('RAIA') || upper.includes('DROGARIA') || upper.includes('HOSPITAL') || upper.includes('CONSULTA') || upper.includes('LABORATORIO') || upper.includes('DENTISTA') || upper.includes('UNIMED') || upper.includes('AMIL')) {
    return { category: 'Saúde', type: 'EXPENSE' };
  }

  // Shopping & Clothes
  if (upper.includes('MERCADOLIVRE') || upper.includes('AMAZON') || upper.includes('SHOPEE') || upper.includes('ZARA') || upper.includes('RENNER') || upper.includes('RIACHUELO') || upper.includes('MAGAZINE LUIZA') || upper.includes('KABUM')) {
    return { category: 'Compras', type: 'EXPENSE' };
  }

  // Education
  if (upper.includes('FACULDADE') || upper.includes('CURSO') || upper.includes('ALURA') || upper.includes('UDEMY') || upper.includes('ESCOLA') || upper.includes('LIVRARIA')) {
    return { category: 'Educação', type: 'EXPENSE' };
  }

  // Leisure
  if (upper.includes('CINEMA') || upper.includes('INGRESSO') || upper.includes('HOTEL') || upper.includes('AIRBNB') || upper.includes('SHOW') || upper.includes('VIAGEM') || upper.includes('GOL') || upper.includes('AZUL LINHAS')) {
    return { category: 'Lazer', type: 'EXPENSE' };
  }

  return { category: 'Outros', type: 'EXPENSE' };
}

/**
 * Client-side parser for OFX or CSV bank extract files
 */
export function parseBankStatement(fileContent: string, accountId: string): Transaction[] {
  const results: Transaction[] = [];
  const lines = fileContent.split(/\r?\n/);

  // Check if it's OFX
  if (fileContent.includes('<OFX>') || fileContent.includes('<STMTTRN>')) {
    const transactionBlocks = fileContent.split(/<STMTTRN>/i).slice(1);
    for (const block of transactionBlocks) {
      const typeMatch = block.match(/<TRNTYPE>(.*?)(\r|\n|<)/i);
      const dateMatch = block.match(/<DTPOSTED>(\d{8})/i);
      const amountMatch = block.match(/<TRNAMT>([-+]?[0-9]*\.?[0-9]+)/i);
      const memoMatch = block.match(/<MEMO>(.*?)(\r|\n|<)/i);
      const fitidMatch = block.match(/<FITID>(.*?)(\r|\n|<)/i);

      if (amountMatch && dateMatch) {
        const rawAmount = parseFloat(amountMatch[1]);
        const rawDate = dateMatch[1]; // YYYYMMDD
        const formattedDate = `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`;
        const description = (memoMatch ? memoMatch[1].trim() : 'Transação Bancária') || 'Transação Importada';
        const isIncome = rawAmount > 0 || (typeMatch && typeMatch[1].toUpperCase() === 'CREDIT');
        const absAmount = Math.abs(rawAmount);

        const smart = autoCategorizeDescription(description);

        results.push({
          id: `tx-ofx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          accountId,
          type: isIncome ? 'INCOME' : smart.type,
          category: isIncome ? 'Salário' : smart.category,
          description,
          amount: absAmount,
          date: formattedDate,
          time: '12:00',
          status: 'COMPLETED',
          bankTxId: fitidMatch ? fitidMatch[1].trim() : undefined,
        });
      }
    }
    return results;
  }

  // Otherwise try parsing as CSV (Data, Descrição, Valor)
  let separator = ',';
  if (lines[0] && lines[0].includes(';')) separator = ';';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(separator);
    if (parts.length >= 3) {
      // Clean up quotes
      const cleanParts = parts.map(p => p.replace(/^["']|["']$/g, '').trim());
      const rawDate = cleanParts[0];
      const desc = cleanParts[1] || 'Transação CSV';
      const rawVal = cleanParts[2].replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
      const numVal = parseFloat(rawVal);

      if (!isNaN(numVal)) {
        let isoDate = new Date().toISOString().split('T')[0];
        // Handle DD/MM/YYYY or YYYY-MM-DD
        if (rawDate.includes('/')) {
          const dParts = rawDate.split('/');
          if (dParts.length === 3) {
            isoDate = `${dParts[2].padStart(4, '20')}-${dParts[1].padStart(2, '0')}-${dParts[0].padStart(2, '0')}`;
          }
        } else if (rawDate.includes('-')) {
          isoDate = rawDate;
        }

        const isIncome = numVal > 0;
        const smart = autoCategorizeDescription(desc);

        results.push({
          id: `tx-csv-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          accountId,
          type: isIncome ? 'INCOME' : 'EXPENSE',
          category: isIncome ? (smart.type === 'INCOME' ? smart.category : 'Outros') : smart.category,
          description: desc,
          amount: Math.abs(numVal),
          date: isoDate,
          time: '10:30',
          status: 'COMPLETED',
        });
      }
    }
  }

  return results;
}
