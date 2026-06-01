/* ============================================================
   PhysiqueLab — ui.js
   DOM utilities: dashboard, toast, tabelas, tooltip, scroll.
   ============================================================ */

import { classifyBMI, classifyBodyFat, classifyRCQ, sumOf7Skinfolds } from './calculations.js';

export const REGION_LABELS = {
  shoulder: 'Ombro',
  arm:      'Braço',
  forearm:  'Antebraço',
  chest:    'Peito',
  waist:    'Cintura',
  abdomen:  'Abdômen',
  hip:      'Quadril',
  thigh:    'Coxa',
  calf:     'Panturrilha',
  triceps:      'Tríceps',
  pectoral:     'Peitoral',
  subscapular:  'Subescapular',
  abdominal:    'Abdominal',
  suprailiac:   'Supra-ilíaca',
  thighSkinfold:'Coxa (dobra)',
  midaxillary:  'Axilar Média'
};

/* ── Toast ───────────────────────────────────────────────── */
export function showToast(msg, type = 'info', duration = 2800) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .2s ease, transform .2s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => el.remove(), 220);
  }, duration);
}

/* ── Tooltip ─────────────────────────────────────────────── */
const _tip = () => document.getElementById('tooltip');
export function showTooltip(text, x, y) {
  const tip = _tip(); if (!tip) return;
  tip.textContent = text;
  tip.style.left  = `${x}px`;
  tip.style.top   = `${y}px`;
  tip.classList.add('show');
}
export function hideTooltip() { _tip()?.classList.remove('show'); }

/* ── Header ──────────────────────────────────────────────── */
export function updateHeaderUser(name) {
  const el = document.getElementById('header-user-name');
  if (el) el.textContent = name || 'Usuário';
}
export function updateHeaderDate() {
  const el = document.getElementById('current-date');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });
}

/* ── Dashboard ───────────────────────────────────────────── */
export function updateDashboardMetrics(results, sex) {
  const { bmi, bodyFatPercent, leanMass, fatMass, rcq } = results;

  const s = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  s('bmi-value',      bmi !== null ? bmi : '--');
  s('bmi-status',     classifyBMI(bmi));
  s('bodyfat-value',  bodyFatPercent !== null ? `${bodyFatPercent}%` : '--');
  s('bodyfat-status', classifyBodyFat(bodyFatPercent, sex));
  s('leanmass-value', leanMass !== null ? `${leanMass} kg` : '-- kg');
  s('fatmass-value',  fatMass  !== null ? `${fatMass} kg`  : '-- kg');
  s('rcq-value',      rcq !== null ? rcq : '--');
  s('rcq-status',     classifyRCQ(rcq, sex));
}

/* ── Tabela de medidas ───────────────────────────────────── */
export function updateMeasurementsTable(measurements) {
  Object.entries(measurements).forEach(([key, val]) => {
    const cell = document.getElementById(`mt-${key}`);
    if (!cell) return;
    const has = val !== null && val !== undefined;
    cell.textContent = has ? `${val} cm` : '--';
    cell.classList.toggle('has-value', has);
    cell.closest('tr')?.classList.toggle('filled', has);
  });
}

/* ── Tabela de dobras ────────────────────────────────────── */
export function updateSkinfoldsTable(skinfolds) {
  Object.entries(skinfolds).forEach(([key, val]) => {
    const cell = document.getElementById(`sf-${key}`);
    if (!cell) return;
    const has = val !== null && val !== undefined;
    cell.textContent = has ? `${val} mm` : '--';
    cell.classList.toggle('has-value', has);
    cell.closest('tr')?.classList.toggle('filled', has);
  });
  const sum = sumOf7Skinfolds(skinfolds);
  const el  = document.getElementById('skinfolds-sum');
  if (el) el.textContent = sum !== null ? `${sum} mm` : '-- mm';
}

/* ── Scroll progress bar ─────────────────────────────────── */
export function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
  }, { passive: true });
}

/* ── Nav active via IntersectionObserver ─────────────────── */
export function initScrollSpy() {
  const sections = document.querySelectorAll('.page-section[id]');
  const links    = document.querySelectorAll('.nav-link[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('active', l.dataset.target === e.target.id));
    });
  }, { threshold: 0.25 });
  sections.forEach(s => obs.observe(s));
}
