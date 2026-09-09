// Funzioni di supporto condivise dai 4 file di dati grammaticali (preposizioni,
// casi, aggettivi, verbi) — estratte qui perché usate da più di uno di essi.

// Dati grammaticali principali: Preposizioni, Casi, Aggettivi, Verbi.
// Estratto da App.jsx per ridurre le dimensioni del file principale.

export function ex(ru_aff, it_aff, ru_neg, it_neg, ru_int, it_int) {
  return {
    aff: { ru: ru_aff, it: it_aff },
    neg: { ru: ru_neg, it: it_neg },
    int: { ru: ru_int, it: it_int },
  };
}

export function prep(word, meaning_it, note_it, usages) {
  return { word, meaning_it, note_it, usages };
}

export function vf(label, form, example_ru, example_it) {
  return { label, form, example_ru, example_it };
}

export function af(label, form, noun, example_ru, example_it) {
  return { label, form, noun, example_ru, example_it };
}

export function adj(word, meaning_it, note_it, genderForms, caseForms, transform) {
  return { word, meaning_it, note_it, genderForms, caseForms, transform };
}

export function vbPair(impfWord, impfForms, perfWord, perfForms, meaning_it, note_it, situational) {
  return {
    meaning_it,
    note_it,
    imperfective: { word: impfWord, forms: impfForms },
    perfective: { word: perfWord, forms: perfForms },
    situational,
  };
}

export function sq(prompt_it, correctRu, correctAspect, wrongRu, wrongAspect) {
  return {
    prompt_it,
    options: [
      { ru: correctRu, aspect: correctAspect },
      { ru: wrongRu, aspect: wrongAspect },
    ],
    correct: 0,
  };
}

