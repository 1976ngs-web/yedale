// Reads a number written in Hebrew words (the parents' lock), e.g. "חמשת אלפים שלוש מאות ארבעים ושש" -> 5346.
const U = { 'אחת': 1, 'אחד': 1, 'שתיים': 2, 'שתים': 2, 'שלוש': 3, 'ארבע': 4, 'חמש': 5, 'שש': 6, 'שבע': 7, 'שמונה': 8, 'תשע': 9 };
const T = { 'עשר': 10, 'עשרים': 20, 'שלושים': 30, 'ארבעים': 40, 'חמישים': 50, 'שישים': 60, 'שבעים': 70, 'שמונים': 80, 'תשעים': 90 };
const K = { 'אלף': 1000, 'אלפיים': 2000, 'שלושת': 3, 'ארבעת': 4, 'חמשת': 5, 'ששת': 6, 'שבעת': 7, 'שמונת': 8, 'תשעת': 9 };
function hebrewNumber(text) {
  const w = text.trim().split(/\s+/).map(x => x.replace(/^ו(?=.)/, m => m)).filter(Boolean);
  let n = 0;
  for (let i = 0; i < w.length; i++) {
    let x = w[i]; const strip = s => (s.length > 1 && s[0] === 'ו' && !(s in U) && !(s in T) && !(s in K) && s !== 'מאה' && s !== 'מאתיים' && s !== 'מאות' && s !== 'אלפים') ? s.slice(1) : s;
    x = strip(x);
    const nx = w[i + 1] ? strip(w[i + 1]) : '';
    if (x === 'אלף' || x === 'אלפיים') { n += K[x]; continue; }
    if (x in K && nx === 'אלפים') { n += K[x] * 1000; i++; continue; }
    if (x === 'מאה') { n += 100; continue; }
    if (x === 'מאתיים') { n += 200; continue; }
    if (x in U && nx === 'מאות') { n += U[x] * 100; i++; continue; }
    if (x in U && nx === 'עשרה') { n += 10 + U[x]; i++; continue; }
    if (x in T) { n += T[x]; continue; }
    if (x in U) { n += U[x]; continue; }
    throw new Error('unknown number word: ' + w[i] + ' in "' + text + '"');
  }
  return n;
}
module.exports = { hebrewNumber };
