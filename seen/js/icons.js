/* SEEN — shared inline SVG icon set (stroke style, currentColor) */
window.SEEN_ICONS = (function () {
  const w = (inner, size, vb) =>
    `<svg viewBox="${vb || '0 0 24 24'}" width="${size || 24}" height="${size || 24}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  return {
    vol: s => w('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>', s || 20),
    volX: s => w('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>', s || 20),
    ticks: s => w('<polyline points="1.8 13.2 5.2 16.6 12.4 9.4"/><polyline points="10.8 13.2 14.2 16.6 21.4 9.4"/>', s || 16)
  };
})();
