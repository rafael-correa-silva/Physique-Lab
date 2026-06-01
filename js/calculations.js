/* ============================================================
   PhysiqueLab — calculations.js
   Fórmulas científicas para avaliação corporal.
   Jackson & Pollock 7 dobras + Siri, IMC, composição corporal.
   ============================================================ */

/**
 * Calcula o IMC.
 * @param {number} weightKg
 * @param {number} heightCm
 * @returns {number|null}
 */
export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  const hM = heightCm / 100;
  return +(weightKg / (hM * hM)).toFixed(1);
}

/**
 * Retorna classificação textual do IMC.
 * @param {number} bmi
 * @returns {string}
 */
export function classifyBMI(bmi) {
  if (bmi === null || bmi === undefined) return 'Aguardando dados';
  if (bmi < 18.5)  return 'Abaixo do peso';
  if (bmi < 25)    return 'Peso normal';
  if (bmi < 30)    return 'Sobrepeso';
  if (bmi < 35)    return 'Obesidade I';
  if (bmi < 40)    return 'Obesidade II';
  return 'Obesidade III';
}

/**
 * Soma das 7 dobras cutâneas (mm).
 * @param {Object} skinfolds
 * @returns {number|null}
 */
export function sumOf7Skinfolds(skinfolds) {
  const keys = ['triceps','pectoral','subscapular','abdominal',
                 'suprailiac','thighSkinfold','midaxillary'];
  const vals = keys.map(k => skinfolds[k]);
  if (vals.some(v => v === null || v === undefined)) return null;
  return +vals.reduce((a, b) => a + b, 0).toFixed(1);
}

/**
 * Jackson & Pollock 7 dobras → Densidade Corporal.
 * Fórmulas separadas por sexo biológico.
 *
 * Masculino:  DC = 1.112 − (0.00043499 × Σ7) + (0.00000055 × Σ7²) − (0.00028826 × idade)
 * Feminino:   DC = 1.097 − (0.00046971 × Σ7) + (0.00000056 × Σ7²) − (0.00012828 × idade)
 *
 * @param {number} sum7  soma das 7 dobras (mm)
 * @param {string} sex   'M' | 'F'
 * @param {number} age   anos
 * @returns {number|null} densidade corporal (g/ml)
 */
export function calcBodyDensity(sum7, sex, age) {
  if (sum7 === null || !sex || !age) return null;
  const s = sum7;
  if (sex === 'M') {
    return 1.112 - (0.00043499 * s) + (0.00000055 * s * s) - (0.00028826 * age);
  }
  return 1.097 - (0.00046971 * s) + (0.00000056 * s * s) - (0.00012828 * age);
}

/**
 * Equação de Siri (1956): converte densidade corporal em % gordura.
 * %G = ((4.95 / DC) − 4.50) × 100
 *
 * @param {number} density
 * @returns {number|null} percentual de gordura
 */
export function densityToFatPercent(density) {
  if (!density || density <= 0) return null;
  const pct = ((4.95 / density) - 4.50) * 100;
  return +Math.max(0, Math.min(60, pct)).toFixed(1);  // clampado 0–60%
}

/**
 * Calcula % gordura completo (JP7 + Siri).
 * @param {Object} skinfolds
 * @param {string} sex
 * @param {number} age
 * @returns {number|null}
 */
export function calcBodyFatPercent(skinfolds, sex, age) {
  const sum = sumOf7Skinfolds(skinfolds);
  if (sum === null) return null;
  const dc = calcBodyDensity(sum, sex, age);
  return densityToFatPercent(dc);
}

/**
 * Calcula massa gorda em kg.
 * @param {number} weightKg
 * @param {number} fatPct
 * @returns {number|null}
 */
export function calcFatMass(weightKg, fatPct) {
  if (!weightKg || fatPct === null) return null;
  return +(weightKg * (fatPct / 100)).toFixed(1);
}

/**
 * Calcula massa magra em kg.
 * @param {number} weightKg
 * @param {number} fatMassKg
 * @returns {number|null}
 */
export function calcLeanMass(weightKg, fatMassKg) {
  if (!weightKg || fatMassKg === null) return null;
  return +(weightKg - fatMassKg).toFixed(1);
}

/**
 * Relação cintura/quadril.
 * @param {number|null} waist
 * @param {number|null} hip
 * @returns {number|null}
 */
export function calcRCQ(waist, hip) {
  if (!waist || !hip || hip === 0) return null;
  return +(waist / hip).toFixed(2);
}

/**
 * Classifica o RCQ por sexo.
 * @param {number} rcq
 * @param {string} sex
 * @returns {string}
 */
export function classifyRCQ(rcq, sex) {
  if (rcq === null) return 'Preencha medidas';
  if (sex === 'M') {
    if (rcq < 0.90) return 'Baixo risco';
    if (rcq < 1.00) return 'Risco moderado';
    return 'Alto risco';
  }
  if (rcq < 0.80) return 'Baixo risco';
  if (rcq < 0.86) return 'Risco moderado';
  return 'Alto risco';
}

/**
 * Classifica o % gordura por sexo.
 * @param {number} pct
 * @param {string} sex
 * @returns {string}
 */
export function classifyBodyFat(pct, sex) {
  if (pct === null) return 'Preencha as dobras';
  if (sex === 'M') {
    if (pct < 6)  return 'Atleta/Essencial';
    if (pct < 14) return 'Atleta';
    if (pct < 18) return 'Condicionado';
    if (pct < 25) return 'Aceitável';
    return 'Excesso de gordura';
  }
  if (pct < 14) return 'Atleta/Essencial';
  if (pct < 21) return 'Atleta';
  if (pct < 25) return 'Condicionado';
  if (pct < 32) return 'Aceitável';
  return 'Excesso de gordura';
}

/**
 * Executa todos os cálculos e retorna o objeto results.
 * @param {Object} assessment - currentAssessment do AppState
 * @param {Object} profile    - profile do AppState
 * @param {number} age
 * @returns {Object} results
 */
export function runAllCalculations(assessment, profile, age) {
  const { weight, measurements, skinfolds } = assessment;
  const { sex, height } = profile;

  const bmi            = calcBMI(weight, height);
  const bodyFatPercent = calcBodyFatPercent(skinfolds, sex, age);
  const fatMass        = calcFatMass(weight, bodyFatPercent);
  const leanMass       = calcLeanMass(weight, fatMass);
  const rcq            = calcRCQ(measurements.waist, measurements.hip);

  return { bmi, bodyFatPercent, leanMass, fatMass, rcq };
}
