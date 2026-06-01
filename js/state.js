/* ============================================================
   PhysiqueLab — state.js
   Objeto global de estado centralizado.
   ============================================================ */

export const AppState = {
  profile: { name: '', sex: '', birthDate: '', height: 0 },

  currentAssessment: {
    date: '',
    weight: 0,
    measurements: {
      shoulder: null,  // ombro (novo)
      arm:      null,
      forearm:  null,
      chest:    null,
      waist:    null,
      abdomen:  null,
      hip:      null,
      thigh:    null,
      calf:     null
    },
    skinfolds: {
      triceps:       null,
      pectoral:      null,
      subscapular:   null,
      abdominal:     null,
      suprailiac:    null,
      thighSkinfold: null,
      midaxillary:   null
    },
    results: {
      bmi: null, bodyFatPercent: null,
      leanMass: null, fatMass: null, rcq: null
    }
  },

  history: []
};

const _subs = [];
export function subscribe(fn) { _subs.push(fn); }
export function notifyStateChange(scope = 'all') { _subs.forEach(fn => fn(scope, AppState)); }

export function getAge() {
  if (!AppState.profile.birthDate) return 0;
  const birth = new Date(AppState.profile.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function resetCurrentAssessment() {
  AppState.currentAssessment = {
    date: new Date().toISOString(),
    weight: 0,
    measurements: {
      shoulder: null, arm: null, forearm: null, chest: null,
      waist: null, abdomen: null, hip: null, thigh: null, calf: null
    },
    skinfolds: {
      triceps: null, pectoral: null, subscapular: null,
      abdominal: null, suprailiac: null, thighSkinfold: null, midaxillary: null
    },
    results: { bmi: null, bodyFatPercent: null, leanMass: null, fatMass: null, rcq: null }
  };
}
