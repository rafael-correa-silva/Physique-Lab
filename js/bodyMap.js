/* ============================================================
   PhysiqueLab — bodyMap.js
   SVG muscular inline, interatividade, labels flutuantes.
   ============================================================ */

import { AppState, notifyStateChange } from './state.js';
import { showTooltip, hideTooltip, REGION_LABELS } from './ui.js';

let _activeMap    = null;
let _activeRegion = null;

/* ══════════════════════════════════════════════════════════
   SVG 1 — MEDIDAS CORPORAIS (com ombro)
   ══════════════════════════════════════════════════════════ */
function buildMeasurementsSVG() {
  return `
<svg viewBox="0 0 240 510" xmlns="http://www.w3.org/2000/svg" class="body-svg" style="overflow:visible">
  <defs>
    <filter id="gm"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>

  <!-- BASE SHAPES -->
  <ellipse class="body-base" cx="120" cy="36" rx="21" ry="26"/>
  <path class="body-base" d="M104,59 Q120,66 136,59 L138,80 Q120,86 102,80 Z"/>
  <!-- trapézio esq -->
  <path class="body-base" d="M102,78 Q84,80 66,90 Q50,98 38,112 Q30,124 32,138 Q42,130 54,122 Q62,117 64,110 L64,96 Z"/>
  <!-- trapézio dir -->
  <path class="body-base" d="M138,78 Q156,80 174,90 Q190,98 202,112 Q210,124 208,138 Q198,130 186,122 Q178,117 176,110 L176,96 Z"/>
  <!-- torso -->
  <path class="body-base" d="M64,94 L176,94 Q184,140 182,200 Q178,228 170,250 L70,250 Q62,228 58,200 Q56,140 64,94 Z"/>
  <!-- pelve -->
  <path class="body-base" d="M70,248 Q62,260 58,278 L182,278 Q178,260 170,248 Z"/>
  <!-- coxa esq -->
  <path class="body-base" d="M60,272 Q50,290 48,330 Q46,362 52,388 Q66,398 88,396 Q108,392 114,376 L118,272 Z"/>
  <!-- coxa dir -->
  <path class="body-base" d="M180,272 Q190,290 192,330 Q194,362 188,388 Q174,398 152,396 Q132,392 126,376 L122,272 Z"/>
  <ellipse class="body-base" cx="84"  cy="394" rx="18" ry="10"/>
  <ellipse class="body-base" cx="156" cy="394" rx="18" ry="10"/>
  <!-- panturrilha esq -->
  <path class="body-base" d="M52,390 Q44,416 46,448 Q52,468 76,474 Q98,476 110,464 Q118,452 116,428 Q114,402 108,390 Z"/>
  <!-- panturrilha dir -->
  <path class="body-base" d="M188,390 Q196,416 194,448 Q188,468 164,474 Q142,476 130,464 Q122,452 124,428 Q126,402 132,390 Z"/>
  <!-- pé esq --> <path class="body-base" d="M44,468 Q42,478 45,486 L108,486 Q112,480 110,468 Z"/>
  <!-- pé dir --> <path class="body-base" d="M196,468 Q198,478 195,486 L132,486 Q128,480 130,468 Z"/>
  <!-- braço esq --> <path class="body-base" d="M64,94 Q46,100 34,116 Q22,132 22,158 Q22,172 30,182 Q44,190 58,186 Q68,178 68,162 L66,96 Z"/>
  <!-- braço dir --> <path class="body-base" d="M176,94 Q194,100 206,116 Q218,132 218,158 Q218,172 210,182 Q196,190 182,186 Q172,178 172,162 L174,96 Z"/>
  <!-- antebraço esq --> <path class="body-base" d="M22,180 Q12,200 14,228 Q16,250 28,260 Q46,268 60,258 Q70,244 66,220 Q62,196 42,180 Z"/>
  <!-- antebraço dir --> <path class="body-base" d="M218,180 Q228,200 226,228 Q224,250 212,260 Q194,268 180,258 Q170,244 174,220 Q178,196 198,180 Z"/>
  <ellipse class="body-base" cx="34"  cy="268" rx="16" ry="12"/>
  <ellipse class="body-base" cx="206" cy="268" rx="16" ry="12"/>

  <!-- LINHAS MUSCULARES -->
  <line class="body-detail-hi" x1="120" y1="94"  x2="120" y2="158"/>
  <path class="body-detail" d="M66,108 Q82,130 120,136"/>
  <path class="body-detail" d="M174,108 Q158,130 120,136"/>
  <line class="body-detail" x1="120" y1="158" x2="120" y2="206"/>
  <line class="body-detail" x1="100" y1="162" x2="100" y2="206"/>
  <line class="body-detail" x1="140" y1="162" x2="140" y2="206"/>
  <line class="body-detail" x1="80"  y1="172" x2="160" y2="172"/>
  <line class="body-detail" x1="78"  y1="186" x2="162" y2="186"/>
  <line class="body-detail" x1="76"  y1="200" x2="164" y2="200"/>
  <path class="body-detail" d="M80,280 Q78,330 80,380"/>
  <path class="body-detail" d="M160,280 Q162,330 160,380"/>
  <path class="body-detail-hi" d="M64,96  Q50,104 38,118"/>
  <path class="body-detail-hi" d="M176,96 Q190,104 202,118"/>
  <path class="body-detail" d="M28,128 Q24,148 26,168"/>
  <path class="body-detail" d="M62,110 Q66,140 64,170"/>
  <path class="body-detail" d="M80,396  Q76,424 78,456"/>
  <path class="body-detail" d="M160,396 Q164,424 162,456"/>

  <!-- ═══ REGIÕES CLICÁVEIS ═══ -->

  <!-- OMBRO (shoulder) — capa deltóide esq + dir -->
  <path class="body-region" data-region="shoulder" data-map="measurements"
    d="M64,92 Q46,93 34,105 Q26,115 28,130 Q40,124 52,116 Q62,110 66,103 Z"/>
  <path class="body-region" data-region="shoulder" data-map="measurements"
    d="M176,92 Q194,93 206,105 Q214,115 212,130 Q200,124 188,116 Q178,110 174,103 Z"/>

  <!-- BRAÇO (arm) -->
  <path class="body-region" data-region="arm" data-map="measurements"
    d="M64,94 Q46,100 34,116 Q22,132 22,158 Q22,172 30,182 Q44,190 58,186 Q68,178 68,162 L66,96 Z"/>
  <path class="body-region" data-region="arm" data-map="measurements"
    d="M176,94 Q194,100 206,116 Q218,132 218,158 Q218,172 210,182 Q196,190 182,186 Q172,178 172,162 L174,96 Z"/>

  <!-- ANTEBRAÇO (forearm) -->
  <path class="body-region" data-region="forearm" data-map="measurements"
    d="M22,180 Q12,200 14,228 Q16,250 28,260 Q46,268 60,258 Q70,244 66,220 Q62,196 42,180 Z"/>
  <path class="body-region" data-region="forearm" data-map="measurements"
    d="M218,180 Q228,200 226,228 Q224,250 212,260 Q194,268 180,258 Q170,244 174,220 Q178,196 198,180 Z"/>

  <!-- PEITO (chest) -->
  <path class="body-region" data-region="chest" data-map="measurements"
    d="M64,94 L176,94 Q182,116 180,158 L60,158 Q58,116 64,94 Z"/>

  <!-- ABDÔMEN (abdomen) -->
  <path class="body-region" data-region="abdomen" data-map="measurements"
    d="M60,158 L180,158 Q182,184 178,208 L62,208 Q58,184 60,158 Z"/>

  <!-- CINTURA (waist) -->
  <path class="body-region" data-region="waist" data-map="measurements"
    d="M62,208 L178,208 Q180,228 174,250 L66,250 Q60,228 62,208 Z"/>

  <!-- QUADRIL (hip) -->
  <path class="body-region" data-region="hip" data-map="measurements"
    d="M66,248 Q60,262 58,278 L182,278 Q180,262 174,248 Z"/>

  <!-- COXA (thigh) -->
  <path class="body-region" data-region="thigh" data-map="measurements"
    d="M60,272 Q50,290 48,330 Q46,362 52,388 Q66,398 88,396 Q108,392 114,376 L118,272 Z"/>
  <path class="body-region" data-region="thigh" data-map="measurements"
    d="M180,272 Q190,290 192,330 Q194,362 188,388 Q174,398 152,396 Q132,392 126,376 L122,272 Z"/>

  <!-- PANTURRILHA (calf) -->
  <path class="body-region" data-region="calf" data-map="measurements"
    d="M52,390 Q44,416 46,448 Q52,468 76,474 Q98,476 110,464 Q118,452 116,428 Q114,402 108,390 Z"/>
  <path class="body-region" data-region="calf" data-map="measurements"
    d="M188,390 Q196,416 194,448 Q188,468 164,474 Q142,476 130,464 Q122,452 124,428 Q126,402 132,390 Z"/>

  <!-- ═══ VALUE LABELS ═══ -->
  <g class="region-value-group">
    <!-- shoulder: direita do corpo -->
    <line id="meas-vline-shoulder" class="region-val-line" x1="210" y1="108" x2="224" y2="108" visibility="hidden"/>
    <text id="meas-vtext-shoulder" class="region-val-text" x="226" y="108" text-anchor="start" visibility="hidden">0</text>
    <!-- arm: esquerda -->
    <line id="meas-vline-arm"     class="region-val-line" x1="22" y1="148" x2="8"  y2="148" visibility="hidden"/>
    <text id="meas-vtext-arm"     class="region-val-text" x="6"  y="148" text-anchor="end" visibility="hidden">0</text>
    <!-- forearm -->
    <line id="meas-vline-forearm" class="region-val-line" x1="14" y1="224" x2="2"  y2="224" visibility="hidden"/>
    <text id="meas-vtext-forearm" class="region-val-text" x="0"  y="224" text-anchor="end" visibility="hidden">0</text>
    <!-- chest -->
    <line id="meas-vline-chest"   class="region-val-line" x1="62" y1="124" x2="48" y2="124" visibility="hidden"/>
    <text id="meas-vtext-chest"   class="region-val-text" x="46" y="124" text-anchor="end" visibility="hidden">0</text>
    <!-- abdomen -->
    <line id="meas-vline-abdomen" class="region-val-line" x1="62" y1="182" x2="48" y2="182" visibility="hidden"/>
    <text id="meas-vtext-abdomen" class="region-val-text" x="46" y="182" text-anchor="end" visibility="hidden">0</text>
    <!-- waist -->
    <line id="meas-vline-waist"   class="region-val-line" x1="63" y1="228" x2="48" y2="228" visibility="hidden"/>
    <text id="meas-vtext-waist"   class="region-val-text" x="46" y="228" text-anchor="end" visibility="hidden">0</text>
    <!-- hip -->
    <line id="meas-vline-hip"     class="region-val-line" x1="59" y1="262" x2="44" y2="262" visibility="hidden"/>
    <text id="meas-vtext-hip"     class="region-val-text" x="42" y="262" text-anchor="end" visibility="hidden">0</text>
    <!-- thigh -->
    <line id="meas-vline-thigh"   class="region-val-line" x1="50" y1="330" x2="36" y2="330" visibility="hidden"/>
    <text id="meas-vtext-thigh"   class="region-val-text" x="34" y="330" text-anchor="end" visibility="hidden">0</text>
    <!-- calf -->
    <line id="meas-vline-calf"    class="region-val-line" x1="47" y1="432" x2="33" y2="432" visibility="hidden"/>
    <text id="meas-vtext-calf"    class="region-val-text" x="31" y="432" text-anchor="end" visibility="hidden">0</text>
  </g>
</svg>`;
}

/* ══════════════════════════════════════════════════════════
   SVG 2 — ADIPÔMETRO
   ══════════════════════════════════════════════════════════ */
function buildSkinfoldsSVG() {
  const markers = [
    { key: 'triceps',       cx: 218, cy: 140, label: 'Tríc',  num: 1 },
    { key: 'pectoral',      cx: 92,  cy: 110, label: 'Peit',  num: 2 },
    { key: 'subscapular',   cx: 164, cy: 115, label: 'Subs',  num: 3 },
    { key: 'abdominal',     cx: 138, cy: 182, label: 'Abd',   num: 4 },
    { key: 'suprailiac',    cx: 168, cy: 212, label: 'Supr',  num: 5 },
    { key: 'thighSkinfold', cx: 82,  cy: 316, label: 'Coxa',  num: 6 },
    { key: 'midaxillary',   cx: 182, cy: 162, label: 'Axil',  num: 7 },
  ];

  const markersSVG = markers.map(m => `
    <g class="skinfold-marker" data-region="${m.key}" data-map="skinfolds" id="sf-marker-${m.key}">
      <circle cx="${m.cx}" cy="${m.cy}" r="10"/>
      <text x="${m.cx}" y="${m.cy}">${m.num}</text>
      <text x="${m.cx > 120 ? m.cx + 14 : m.cx - 14}" y="${m.cy}"
            font-family="'Rajdhani',sans-serif" font-size="5"
            fill="rgba(122,154,184,.55)" font-weight="500"
            text-anchor="${m.cx > 120 ? 'start' : 'end'}"
            dominant-baseline="central" pointer-events="none">${m.label}</text>
    </g>`).join('');

  const valueLabels = markers.map(m => {
    const right = m.cx > 120;
    const lx    = right ? m.cx + 26 : m.cx - 26;
    const anch  = right ? 'start' : 'end';
    const x1    = right ? m.cx + 10 : m.cx - 10;
    const x2    = right ? m.cx + 22 : m.cx - 22;
    return `
    <g id="sf-label-${m.key}" visibility="hidden">
      <line class="region-val-line" x1="${x1}" y1="${m.cy}" x2="${x2}" y2="${m.cy}"/>
      <text class="region-val-text" x="${lx}" y="${m.cy}" text-anchor="${anch}">0</text>
    </g>`;
  }).join('');

  const base = `
  <ellipse class="body-base" cx="120" cy="36" rx="21" ry="26"/>
  <path class="body-base" d="M104,59 Q120,66 136,59 L138,80 Q120,86 102,80 Z"/>
  <path class="body-base" d="M102,78 Q84,80 66,90 Q50,98 38,112 Q30,124 32,138 Q42,130 54,122 Q62,117 64,110 L64,96 Z"/>
  <path class="body-base" d="M138,78 Q156,80 174,90 Q190,98 202,112 Q210,124 208,138 Q198,130 186,122 Q178,117 176,110 L176,96 Z"/>
  <path class="body-base" d="M64,94 L176,94 Q184,140 182,200 Q178,228 170,250 L70,250 Q62,228 58,200 Q56,140 64,94 Z"/>
  <path class="body-base" d="M70,248 Q62,260 58,278 L182,278 Q178,260 170,248 Z"/>
  <path class="body-base" d="M60,272 Q50,290 48,330 Q46,362 52,388 Q66,398 88,396 Q108,392 114,376 L118,272 Z"/>
  <path class="body-base" d="M180,272 Q190,290 192,330 Q194,362 188,388 Q174,398 152,396 Q132,392 126,376 L122,272 Z"/>
  <ellipse class="body-base" cx="84" cy="394" rx="18" ry="10"/>
  <ellipse class="body-base" cx="156" cy="394" rx="18" ry="10"/>
  <path class="body-base" d="M52,390 Q44,416 46,448 Q52,468 76,474 Q98,476 110,464 Q118,452 116,428 Q114,402 108,390 Z"/>
  <path class="body-base" d="M188,390 Q196,416 194,448 Q188,468 164,474 Q142,476 130,464 Q122,452 124,428 Q126,402 132,390 Z"/>
  <path class="body-base" d="M44,468 Q42,478 45,486 L108,486 Q112,480 110,468 Z"/>
  <path class="body-base" d="M196,468 Q198,478 195,486 L132,486 Q128,480 130,468 Z"/>
  <path class="body-base" d="M64,94 Q46,100 34,116 Q22,132 22,158 Q22,172 30,182 Q44,190 58,186 Q68,178 68,162 L66,96 Z"/>
  <path class="body-base" d="M176,94 Q194,100 206,116 Q218,132 218,158 Q218,172 210,182 Q196,190 182,186 Q172,178 172,162 L174,96 Z"/>
  <path class="body-base" d="M22,180 Q12,200 14,228 Q16,250 28,260 Q46,268 60,258 Q70,244 66,220 Q62,196 42,180 Z"/>
  <path class="body-base" d="M218,180 Q228,200 226,228 Q224,250 212,260 Q194,268 180,258 Q170,244 174,220 Q178,196 198,180 Z"/>
  <ellipse class="body-base" cx="34" cy="268" rx="16" ry="12"/>
  <ellipse class="body-base" cx="206" cy="268" rx="16" ry="12"/>
  <line class="body-detail" x1="120" y1="94" x2="120" y2="158"/>
  <path class="body-detail" d="M66,108 Q82,130 120,136"/>
  <path class="body-detail" d="M174,108 Q158,130 120,136"/>
  <line class="body-detail" x1="120" y1="158" x2="120" y2="206"/>
  <line class="body-detail" x1="100" y1="162" x2="100" y2="206"/>
  <line class="body-detail" x1="140" y1="162" x2="140" y2="206"/>
  <line class="body-detail" x1="80"  y1="172" x2="160" y2="172"/>
  <line class="body-detail" x1="78"  y1="186" x2="162" y2="186"/>
  <line class="body-detail" x1="76"  y1="200" x2="164" y2="200"/>`;

  return `
<svg viewBox="0 0 240 510" xmlns="http://www.w3.org/2000/svg" class="body-svg" style="overflow:visible">
  ${base}
  ${markersSVG}
  <g class="region-value-group">${valueLabels}</g>
</svg>`;
}

/* ══════════════════════════════════════════════════════════
   INJEÇÃO
   ══════════════════════════════════════════════════════════ */
export function injectBodies() {
  const mc = document.getElementById('measurements-svg-container');
  const sc = document.getElementById('skinfolds-svg-container');
  if (mc) mc.innerHTML = buildMeasurementsSVG();
  if (sc) sc.innerHTML = buildSkinfoldsSVG();
}

/* ══════════════════════════════════════════════════════════
   INTERATIVIDADE SVG
   ══════════════════════════════════════════════════════════ */
export function setupBodyMapEvents() {
  _setupRegions('measurements');
  _setupRegions('skinfolds');
}

function _setupRegions(mapType) {
  const sel = mapType === 'measurements'
    ? '.body-region[data-map="measurements"]'
    : '.skinfold-marker[data-map="skinfolds"]';

  document.querySelectorAll(sel).forEach(el => {
    const region = el.dataset.region;
    el.addEventListener('mouseenter', e => showTooltip(REGION_LABELS[region] || region, e.clientX, e.clientY - 4));
    el.addEventListener('mousemove',  e => showTooltip(REGION_LABELS[region] || region, e.clientX, e.clientY - 4));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('touchstart', e => {
      const t = e.touches[0];
      showTooltip(REGION_LABELS[region] || region, t.clientX, t.clientY - 30);
      setTimeout(hideTooltip, 1200);
    }, { passive: true });
    el.addEventListener('click', () => openRegionInput(mapType, region));
  });
}

/* ══════════════════════════════════════════════════════════
   REFRESH VISUAL (labels + classes filled)
   ══════════════════════════════════════════════════════════ */
export function refreshRegionVisuals() {
  _refreshMap('measurements', AppState.currentAssessment.measurements);
  _refreshMap('skinfolds',    AppState.currentAssessment.skinfolds);
}

function _refreshMap(mapType, dataObj) {
  Object.entries(dataObj).forEach(([key, val]) => {
    const has = val !== null && val !== undefined;
    if (mapType === 'measurements') {
      document.querySelectorAll(`.body-region[data-region="${key}"]`).forEach(el => el.classList.toggle('filled', has));
      const txt  = document.getElementById(`meas-vtext-${key}`);
      const line = document.getElementById(`meas-vline-${key}`);
      if (txt)  { txt.textContent  = has ? `${val}cm` : '0'; txt.setAttribute('visibility',  has ? 'visible' : 'hidden'); }
      if (line) { line.setAttribute('visibility', has ? 'visible' : 'hidden'); }
    } else {
      document.getElementById(`sf-marker-${key}`)?.classList.toggle('filled', has);
      const grp = document.getElementById(`sf-label-${key}`);
      if (grp) {
        grp.setAttribute('visibility', has ? 'visible' : 'hidden');
        const t = grp.querySelector('.region-val-text');
        if (t && has) t.textContent = `${val}mm`;
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   INPUT MODAL — público para uso externo (tabela clicável)
   ══════════════════════════════════════════════════════════ */
export function openRegionInput(mapType, region) {
  _activeMap    = mapType;
  _activeRegion = region;

  const isMeas  = mapType === 'measurements';
  const dataObj = isMeas ? AppState.currentAssessment.measurements : AppState.currentAssessment.skinfolds;
  const current = dataObj[region];

  document.getElementById('input-modal-title').textContent = REGION_LABELS[region] || region;
  document.getElementById('input-label').textContent       = isMeas ? 'Medida em centímetros' : 'Dobra em milímetros';
  document.getElementById('input-unit').textContent        = isMeas ? 'cm' : 'mm';

  const inp = document.getElementById('input-value');
  inp.value       = current !== null && current !== undefined ? current : '';
  inp.placeholder = isMeas ? 'Ex: 38.5' : 'Ex: 12.0';
  inp.step        = '0.1';

  document.getElementById('input-modal').classList.add('active');
  setTimeout(() => inp.focus(), 80);
}

export function setupInputModal() {
  const modal   = document.getElementById('input-modal');
  const form    = document.getElementById('input-form');
  const close   = () => modal.classList.remove('active');

  document.getElementById('input-modal-close').addEventListener('click', close);
  modal.querySelector('.modal-overlay').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  document.getElementById('input-clear').addEventListener('click', () => {
    if (!_activeMap || !_activeRegion) return;
    const obj = _activeMap === 'measurements'
      ? AppState.currentAssessment.measurements
      : AppState.currentAssessment.skinfolds;
    obj[_activeRegion] = null;
    notifyStateChange(_activeMap);
    close();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!_activeMap || !_activeRegion) return;
    const raw = parseFloat(document.getElementById('input-value').value);
    if (isNaN(raw) || raw < 0) return;
    const obj = _activeMap === 'measurements'
      ? AppState.currentAssessment.measurements
      : AppState.currentAssessment.skinfolds;
    obj[_activeRegion] = raw;
    notifyStateChange(_activeMap);
    close();
  });
}
