/* ============================================================
   PhysiqueLab — charts.js
   Configuração e utilitários para Chart.js.
   Importado e utilizado por history.js.
   ============================================================ */

/** Paleta de cores para as métricas */
export const CHART_COLORS = {
  weight:   { line: '#00d4ff', fill: 'rgba(0,212,255,0.12)' },
  bodyfat:  { line: '#ffab40', fill: 'rgba(255,171,64,0.12)' },
  leanmass: { line: '#00e676', fill: 'rgba(0,230,118,0.12)' },
  bmi:      { line: '#b388ff', fill: 'rgba(179,136,255,0.12)' }
};

/** Labels para cada métrica */
export const CHART_LABELS = {
  weight:   'Peso (kg)',
  bodyfat:  '% Gordura',
  leanmass: 'Massa Magra (kg)',
  bmi:      'IMC'
};

/**
 * Retorna as opções base do Chart.js para o estilo dark do PhysiqueLab.
 * @param {string} metric - chave da métrica
 * @returns {Object} options para Chart.js
 */
export function getChartOptions(metric) {
  const color = CHART_COLORS[metric] || CHART_COLORS.weight;
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(11,19,32,0.95)',
        borderColor: 'rgba(0,212,255,0.25)',
        borderWidth: 1,
        titleColor: '#7a9ab8',
        bodyColor: '#ddeeff',
        bodyFont: { family: "'Rajdhani', sans-serif", size: 14, weight: '600' },
        titleFont: { family: "'Inter', sans-serif", size: 11 },
        padding: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#3a566e',
          font: { family: "'Inter', sans-serif", size: 10 }
        },
        border: { display: false }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#3a566e',
          font: { family: "'Inter', sans-serif", size: 10 },
          maxTicksLimit: 6
        },
        border: { display: false }
      }
    },
    elements: {
      point: {
        radius: 4, hoverRadius: 7,
        backgroundColor: color.line,
        borderColor: 'rgba(6,10,15,.9)',
        borderWidth: 2,
        hoverBorderColor: color.line,
        hoverBorderWidth: 2
      },
      line: {
        tension: 0.35,
        borderWidth: 2,
        borderColor: color.line,
        backgroundColor: color.fill,
        fill: true
      }
    }
  };
}

/**
 * Extrai o valor de uma métrica de um registro do histórico.
 * @param {Object} record - registro do histórico
 * @param {string} metric - chave da métrica
 * @returns {number|null}
 */
export function extractMetricValue(record, metric) {
  switch (metric) {
    case 'weight':   return record.weight || null;
    case 'bodyfat':  return record.results?.bodyFatPercent ?? null;
    case 'leanmass': return record.results?.leanMass ?? null;
    case 'bmi':      return record.results?.bmi ?? null;
    default:         return null;
  }
}

/**
 * Formata uma data ISO para exibição curta no eixo X.
 * @param {string} isoDate
 * @returns {string}
 */
export function formatChartDate(isoDate) {
  if (!isoDate) return '--';
  const d = new Date(isoDate);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
