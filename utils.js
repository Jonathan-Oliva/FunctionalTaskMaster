export const parseFecha = (fecha) => {
  if (!fecha || fecha === '0') return null;
  const partes = fecha.split(/[-/]/);
  if (partes.length !== 3) return null;
  const [d, m, a] = partes.map(p => parseInt(p));
  if (isNaN(d) || isNaN(m) || isNaN(a)) return null;
  const date = new Date(a, m - 1, d);
  return date.getFullYear() === a && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
};