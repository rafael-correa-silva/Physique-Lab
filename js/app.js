/* ============================================================
   PhysiqueLab — app.js
   Boot, fluxo principal, handlers de eventos globais.
   ============================================================ */

import { AppState, subscribe, notifyStateChange,
         getAge, resetCurrentAssessment }           from './state.js';
import { saveProfile, loadProfile,
         saveCurrentAssessment, loadCurrentAssessment,
         addToHistory, loadHistory }                from './storage.js';
import { runAllCalculations }                       from './calculations.js';
import { injectBodies, setupBodyMapEvents,
         setupInputModal, refreshRegionVisuals,
         openRegionInput }                          from './bodyMap.js';
import { updateDashboardMetrics, updateMeasurementsTable,
         updateSkinfoldsTable, updateHeaderUser,
         updateHeaderDate, showToast,
         initScrollProgress, initScrollSpy }        from './ui.js';
import { initHistory, renderHistory }               from './history.js';

/* ════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    ls?.classList.add('out');
    setTimeout(() => ls && (ls.style.display = 'none'), 500);
    _boot();
  }, 900);
});

async function _boot() {
  const savedProfile = loadProfile();
  AppState.history   = loadHistory() || [];

  injectBodies();

  document.getElementById('app')?.classList.remove('hidden');

  if (!savedProfile) {
    _openProfileModal();
  } else {
    _applyProfile(savedProfile);
    _loadCurrentOrReset();
  }

  setupBodyMapEvents();
  setupInputModal();
  _setupProfileModal();
  _setupWeightInput();
  _setupAssessmentButtons();
  _setupExport();
  _setupTableClicks();       // ← tabelas clicáveis
  initScrollProgress();
  initScrollSpy();
  initHistory();
  updateHeaderDate();

  subscribe(_onStateChange);
}

/* ════════════════════════════════════════════════════════
   ESTADO → UI
   ════════════════════════════════════════════════════════ */
function _onStateChange(scope) {
  const { currentAssessment, profile } = AppState;
  const age     = getAge();
  const results = runAllCalculations(currentAssessment, profile, age);
  currentAssessment.results = results;

  updateDashboardMetrics(results, profile.sex);
  updateMeasurementsTable(currentAssessment.measurements);
  updateSkinfoldsTable(currentAssessment.skinfolds);
  refreshRegionVisuals();
  saveCurrentAssessment(currentAssessment);
}

/* ════════════════════════════════════════════════════════
   PERFIL
   ════════════════════════════════════════════════════════ */
function _openProfileModal() {
  const modal = document.getElementById('profile-modal');
  modal?.classList.add('active');
  if (AppState.profile.name) {
    const f = AppState.profile;
    _setVal('profile-name',      f.name);
    _setVal('profile-sex',       f.sex);
    _setVal('profile-birthdate', f.birthDate);
    _setVal('profile-height',    f.height);
  }
}
function _closeProfileModal() { document.getElementById('profile-modal')?.classList.remove('active'); }
function _setVal(id, v) { const e = document.getElementById(id); if (e) e.value = v || ''; }

function _setupProfileModal() {
  document.getElementById('edit-profile-btn')?.addEventListener('click', _openProfileModal);
  document.getElementById('profile-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name      = document.getElementById('profile-name')?.value.trim();
    const sex       = document.getElementById('profile-sex')?.value;
    const birthDate = document.getElementById('profile-birthdate')?.value;
    const height    = parseFloat(document.getElementById('profile-height')?.value);
    if (!name || !sex || !birthDate || !height) {
      showToast('Preencha todos os campos.', 'error'); return;
    }
    const profile = { name, sex, birthDate, height };
    AppState.profile = profile;
    saveProfile(profile);
    _applyProfile(profile);
    _loadCurrentOrReset();
    _closeProfileModal();
    showToast(`Bem-vindo, ${name}! 💪`, 'success');
    notifyStateChange('profile');
  });
}

function _applyProfile(p) {
  Object.assign(AppState.profile, p);
  updateHeaderUser(p.name);
}

/* ════════════════════════════════════════════════════════
   AVALIAÇÃO ATUAL
   ════════════════════════════════════════════════════════ */
function _loadCurrentOrReset() {
  const saved = loadCurrentAssessment();
  if (saved) {
    AppState.currentAssessment = saved;
  } else {
    resetCurrentAssessment();
  }
  const inp = document.getElementById('weight-input');
  if (inp && AppState.currentAssessment.weight) inp.value = AppState.currentAssessment.weight;
  notifyStateChange('load');
}

function _setupWeightInput() {
  document.getElementById('weight-input')?.addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    AppState.currentAssessment.weight = isNaN(v) ? 0 : v;
    notifyStateChange('weight');
  });
}

function _setupAssessmentButtons() {
  document.getElementById('save-assessment-btn')?.addEventListener('click', () => {
    const a = AppState.currentAssessment;
    if (!a.weight || a.weight <= 0) {
      showToast('Insira o peso antes de salvar.', 'error'); return;
    }
    a.date = new Date().toISOString();
    AppState.history = addToHistory(a);
    renderHistory();
    showToast('Avaliação salva com sucesso! ✓', 'success');
    setTimeout(() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' }), 400);
  });

  document.getElementById('new-assessment-btn')?.addEventListener('click', () => {
    if (!confirm('Iniciar nova avaliação? Dados não salvos serão perdidos.')) return;
    resetCurrentAssessment();
    const inp = document.getElementById('weight-input');
    if (inp) inp.value = '';
    notifyStateChange('reset');
    showToast('Nova avaliação iniciada.', 'info');
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ════════════════════════════════════════════════════════
   TABELAS CLICÁVEIS — nome da região abre o input modal
   ════════════════════════════════════════════════════════ */
function _setupTableClicks() {
  // Medidas
  document.querySelectorAll('#measurements-table tbody tr').forEach(row => {
    const region = row.dataset.region;
    if (!region) return;
    const nameCell = row.querySelector('td:first-child');
    if (!nameCell) return;
    nameCell.classList.add('clickable-cell');
    nameCell.title = 'Clique para inserir';
    nameCell.addEventListener('click', () => openRegionInput('measurements', region));
  });

  // Dobras
  document.querySelectorAll('#skinfolds-table tbody tr').forEach(row => {
    const region = row.dataset.region;
    if (!region) return;
    const nameCell = row.querySelector('td:first-child');
    if (!nameCell) return;
    nameCell.classList.add('clickable-cell');
    nameCell.title = 'Clique para inserir';
    nameCell.addEventListener('click', () => openRegionInput('skinfolds', region));
  });
}

/* ════════════════════════════════════════════════════════
   PDF
   ════════════════════════════════════════════════════════ */
function _setupExport() {
  document.getElementById('export-btn')?.addEventListener('click', () => window.print());
}
