/* ============================================================
   PhysiqueLab — storage.js
   Leitura e escrita no localStorage.
   ============================================================ */

const KEYS = {
  PROFILE:     'pl_profile',
  HISTORY:     'pl_history',
  CURRENT:     'pl_current'
};

/* ── Profile ─────────────────────────────────────────────── */
export function saveProfile(profile) {
  try { localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile)); }
  catch (e) { console.error('[Storage] saveProfile:', e); }
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

/* ── Current assessment (auto-save) ─────────────────────── */
export function saveCurrentAssessment(assessment) {
  try { localStorage.setItem(KEYS.CURRENT, JSON.stringify(assessment)); }
  catch (e) { console.error('[Storage] saveCurrentAssessment:', e); }
}

export function loadCurrentAssessment() {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

/* ── History ─────────────────────────────────────────────── */
export function saveHistory(history) {
  try { localStorage.setItem(KEYS.HISTORY, JSON.stringify(history)); }
  catch (e) { console.error('[Storage] saveHistory:', e); }
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

/**
 * Adiciona um novo registro ao histórico.
 * @param {Object} assessment
 * @returns {Array} histórico atualizado
 */
export function addToHistory(assessment) {
  const history = loadHistory();
  // Evita duplicata pelo timestamp de data
  const exists = history.find(h => h.date === assessment.date);
  if (exists) return history;
  history.push({ ...assessment });
  saveHistory(history);
  return history;
}

/**
 * Remove um registro do histórico pelo índice.
 * @param {number} index
 * @returns {Array}
 */
export function removeFromHistory(index) {
  const history = loadHistory();
  history.splice(index, 1);
  saveHistory(history);
  return history;
}

/** Limpa todos os dados salvos. */
export function clearAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
