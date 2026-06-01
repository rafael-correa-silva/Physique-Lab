/* ============================================================
   PhysiqueLab — history.js
   Histórico de avaliações, gráficos de evolução, comparação.
   ============================================================ */

import { AppState }                                    from './state.js';
import { removeFromHistory, loadHistory, saveHistory } from './storage.js';
import {
  getChartOptions, extractMetricValue,
  formatChartDate, CHART_LABELS, CHART_COLORS
} from './charts.js';
import { REGION_LABELS }                               from './ui.js';

/* ── Estado do gráfico ───────────────────────────────────── */
let _chart       = null;
let _activeMetric = 'weight';
let _chartInited  = false;

/* ═══════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ═══════════════════════════════════════════════════════════ */
export function initHistory() {
  _setupChartTabs();
  _setupCompare();
  renderHistory();

  // Lazy init do chart quando a seção entrar na viewport
  const section = document.getElementById('history');
  if (!section) return;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !_chartInited) {
      _chartInited = true;
      _initChart();
      obs.disconnect();
    }
  }, { threshold: 0.1 });
  obs.observe(section);
}

/* ═══════════════════════════════════════════════════════════
   RENDERIZAÇÃO DA LISTA DE HISTÓRICO
   ═══════════════════════════════════════════════════════════ */
export function renderHistory() {
  const list    = document.getElementById('history-list');
  const history = AppState.history;

  if (!list) return;

  if (!history.length) {
    list.innerHTML = `
      <div class="empty-state">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>Nenhuma avaliação salva ainda</p>
      </div>`;
    document.getElementById('compare-btn')?.style && (document.getElementById('compare-btn').style.display = 'none');
    document.getElementById('compare-block')?.style && (document.getElementById('compare-block').style.display = 'none');
    return;
  }

  list.innerHTML = history
    .slice()
    .reverse()
    .map((rec, revIdx) => {
      const realIdx = history.length - 1 - revIdx;
      return _buildHistoryItem(rec, realIdx, history.length - revIdx);
    })
    .join('');

  // Toggle expand
  list.querySelectorAll('.history-item-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const item = hdr.closest('.history-item');
      item.classList.toggle('expanded');
    });
  });

  // Deletar
  list.querySelectorAll('.btn-icon-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      if (isNaN(idx)) return;
      if (!confirm('Remover esta avaliação do histórico?')) return;
      AppState.history = removeFromHistory(idx);
      renderHistory();
      if (_chartInited) _updateChart();
      _updateCompareSelects();
    });
  });

  // Compare button visibility
  const cmpBtn = document.getElementById('compare-btn');
  if (cmpBtn) cmpBtn.style.display = history.length >= 2 ? '' : 'none';

  if (_chartInited) _updateChart();
  _updateCompareSelects();
}

function _buildHistoryItem(rec, realIndex, num) {
  const date = rec.date
    ? new Date(rec.date).toLocaleDateString('pt-BR', {
        weekday:'short', day:'2-digit', month:'short', year:'numeric'
      })
    : '--';

  const w   = rec.weight       ? `${rec.weight} kg`                : null;
  const bf  = rec.results?.bodyFatPercent !== null && rec.results?.bodyFatPercent !== undefined ? `${rec.results.bodyFatPercent}%` : null;
  const bmi = rec.results?.bmi !== null && rec.results?.bmi !== undefined ? `IMC ${rec.results.bmi}` : null;

  const chips = [w, bf, bmi].filter(Boolean).map(c =>
    `<span class="history-chip">${c}</span>`).join('');

  const measRows  = _buildDetailRows(rec.measurements,  'm');
  const skinRows  = _buildDetailRows(rec.skinfolds,     's');
  const resRows   = _buildResultRows(rec.results);

  return `
<div class="history-item" data-index="${realIndex}">
  <div class="history-item-header">
    <div class="history-item-left">
      <div class="history-num">${num}</div>
      <div>
        <div class="history-date">${date}</div>
        <div class="history-meta-chips">${chips || '<span class="history-chip">Sem dados calculados</span>'}</div>
      </div>
    </div>
    <div class="history-item-right">
      <button class="btn-icon-danger" data-index="${realIndex}" title="Excluir">✕</button>
      <span class="history-toggle">▾</span>
    </div>
  </div>
  <div class="history-detail">
    <div class="detail-grid">
      <div class="detail-section">
        <h4>Medidas Corporais</h4>
        <div class="detail-kv">${measRows || '<p style="font-size:.78rem;color:var(--tx-3)">Nenhuma medida</p>'}</div>
      </div>
      <div class="detail-section">
        <h4>Dobras Cutâneas</h4>
        <div class="detail-kv">${skinRows || '<p style="font-size:.78rem;color:var(--tx-3)">Nenhuma dobra</p>'}</div>
      </div>
      <div class="detail-section">
        <h4>Resultados Calculados</h4>
        <div class="detail-kv">${resRows}</div>
      </div>
    </div>
  </div>
</div>`;
}

function _buildDetailRows(obj, prefix) {
  if (!obj) return '';
  return Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => {
      const unit = prefix === 'm' ? 'cm' : 'mm';
      return `<div class="detail-row"><span>${REGION_LABELS[k] || k}</span><span>${v} ${unit}</span></div>`;
    }).join('');
}

function _buildResultRows(results) {
  if (!results) return '<p style="font-size:.78rem;color:var(--tx-3)">Sem resultados</p>';
  const map = [
    ['bmi',            'IMC',          ''],
    ['bodyFatPercent', '% Gordura',    '%'],
    ['leanMass',       'Massa Magra',  ' kg'],
    ['fatMass',        'Massa Gorda',  ' kg'],
    ['rcq',            'Cin./Quadril', '']
  ];
  return map
    .filter(([k]) => results[k] !== null && results[k] !== undefined)
    .map(([k, label, unit]) =>
      `<div class="detail-row"><span>${label}</span><span>${results[k]}${unit}</span></div>`)
    .join('') || '<p style="font-size:.78rem;color:var(--tx-3)">Nenhum resultado</p>';
}

/* ═══════════════════════════════════════════════════════════
   GRÁFICO DE EVOLUÇÃO
   ═══════════════════════════════════════════════════════════ */
function _initChart() {
  const canvas  = document.getElementById('evolution-chart');
  const emptyEl = document.getElementById('chart-empty');
  if (!canvas) return;

  const history = AppState.history;
  if (!history.length) {
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  const labels = history.map(r => formatChartDate(r.date));
  const data   = history.map(r => extractMetricValue(r, _activeMetric));
  const color  = CHART_COLORS[_activeMetric] || CHART_COLORS.weight;

  _chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: CHART_LABELS[_activeMetric],
        data,
        borderColor:     color.line,
        backgroundColor: color.fill,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: color.line,
        pointBorderColor: 'rgba(6,10,15,.9)',
        pointBorderWidth: 2,
        pointHoverRadius: 8
      }]
    },
    options: getChartOptions(_activeMetric)
  });
}

function _updateChart() {
  const history = AppState.history;
  const emptyEl = document.getElementById('chart-empty');

  if (!history.length) {
    if (emptyEl) emptyEl.style.display = 'flex';
    if (_chart)  { _chart.destroy(); _chart = null; }
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  if (!_chart) { _initChart(); return; }

  const labels = history.map(r => formatChartDate(r.date));
  const data   = history.map(r => extractMetricValue(r, _activeMetric));
  const color  = CHART_COLORS[_activeMetric] || CHART_COLORS.weight;

  _chart.data.labels                       = labels;
  _chart.data.datasets[0].data             = data;
  _chart.data.datasets[0].label            = CHART_LABELS[_activeMetric];
  _chart.data.datasets[0].borderColor      = color.line;
  _chart.data.datasets[0].backgroundColor  = color.fill;
  _chart.data.datasets[0].pointBackgroundColor = color.line;
  _chart.options = getChartOptions(_activeMetric);
  _chart.update();
}

function _setupChartTabs() {
  document.querySelectorAll('.chart-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      _activeMetric = tab.dataset.metric;
      if (_chartInited) _updateChart();
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   COMPARAÇÃO
   ═══════════════════════════════════════════════════════════ */
function _setupCompare() {
  const btn    = document.getElementById('compare-btn');
  const block  = document.getElementById('compare-block');
  const selA   = document.getElementById('compare-a');
  const selB   = document.getElementById('compare-b');

  if (btn) btn.addEventListener('click', () => {
    if (!block) return;
    block.style.display = block.style.display === 'none' ? '' : 'none';
  });

  [selA, selB].forEach(sel => {
    if (sel) sel.addEventListener('change', _runComparison);
  });
}

function _updateCompareSelects() {
  const selA = document.getElementById('compare-a');
  const selB = document.getElementById('compare-b');
  if (!selA || !selB) return;

  const opts = AppState.history.map((rec, i) => {
    const d = rec.date
      ? new Date(rec.date).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' })
      : `Avaliação ${i+1}`;
    return `<option value="${i}">${d}</option>`;
  });
  const empty = '<option value="">— Selecione —</option>';
  selA.innerHTML = empty + opts.join('');
  selB.innerHTML = empty + opts.join('');
}

function _runComparison() {
  const selA = document.getElementById('compare-a');
  const selB = document.getElementById('compare-b');
  const out  = document.getElementById('compare-results');
  if (!selA || !selB || !out) return;

  const idxA = parseInt(selA.value);
  const idxB = parseInt(selB.value);
  if (isNaN(idxA) || isNaN(idxB) || idxA === idxB) {
    out.innerHTML = '';
    return;
  }

  const recA = AppState.history[idxA];
  const recB = AppState.history[idxB];

  const measKeys = ['arm','forearm','chest','waist','abdomen','hip','thigh','calf'];
  const resKeys  = [
    ['weight',          'Peso',        'kg'],
    ['results.bmi',     'IMC',         ''],
    ['results.bodyFatPercent', '% Gordura', '%'],
    ['results.leanMass','Massa Magra', 'kg'],
    ['results.fatMass', 'Massa Gorda', 'kg']
  ];

  const getVal = (rec, path) => {
    const parts = path.split('.');
    return parts.reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), rec);
  };

  const measHTML = measKeys.map(k => {
    const a = recA.measurements?.[k] ?? null;
    const b = recB.measurements?.[k] ?? null;
    return _deltaRow(REGION_LABELS[k] || k, a, b, 'cm');
  }).join('');

  const resHTML = resKeys.map(([path, label, unit]) => {
    const a = getVal(recA, path);
    const b = getVal(recB, path);
    return _deltaRow(label, a, b, unit);
  }).join('');

  out.innerHTML = `
    <div class="compare-group">
      <h4>Medidas Corporais</h4>
      ${measHTML || '<p style="font-size:.78rem;color:var(--tx-3)">Sem dados</p>'}
    </div>
    <div class="compare-group">
      <h4>Métricas</h4>
      ${resHTML}
    </div>`;
}

function _deltaRow(label, a, b, unit) {
  if (a === null || b === null) return '';
  const diff = +(b - a).toFixed(2);
  const sign = diff > 0 ? '+' : '';
  const cls  = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';
  return `
    <div class="compare-row">
      <span class="cr-label">${label}</span>
      <span class="compare-delta ${cls}">${sign}${diff} ${unit}</span>
    </div>`;
}
