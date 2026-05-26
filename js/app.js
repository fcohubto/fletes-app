// FleteApp — Lógica principal

// ─── Estado ───────────────────────────────────────────────────────────────────
const qty = {};          // { [id]: number }
let activeCategory = 'todos';

// ─── Referencias DOM ──────────────────────────────────────────────────────────
const $list       = document.getElementById('articles-list');
const $tabs       = document.querySelectorAll('.tab');
const $cfgTarifa  = document.getElementById('cfg-tarifa');
const $cfgDist    = document.getElementById('cfg-distancia');
const $cfgCap     = document.getElementById('cfg-capacidad');
const $occFill    = document.getElementById('occupancy-fill');
const $occPct     = document.getElementById('occupancy-pct');
const $occBar     = document.querySelector('.occupancy-bar');
const $statVol    = document.getElementById('stat-volume');
const $statCosto  = document.getElementById('stat-costo');
const $statDist   = document.getElementById('stat-distancia');
const $sumItems   = document.getElementById('summary-items');
const $totalPrice = document.getElementById('btn-total-price');
const $btnShare   = document.querySelector('.btn-share');
const $sbarVol    = document.getElementById('sbar-volume');
const $sbarPct    = document.getElementById('sbar-pct');
const $sbarTotal  = document.getElementById('sbar-total');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCLP = n => '$' + Math.round(n).toLocaleString('es-CL');

const getConfig = () => ({
  tarifa:    parseFloat($cfgTarifa.value) || 0,
  distancia: parseFloat($cfgDist.value)   || 0,
  capacidad: parseFloat($cfgCap.value)    || 1,
});

// ─── Render ───────────────────────────────────────────────────────────────────
// Genera las tarjetas de artículos filtradas por categoría activa.
function render() {
  const filtrados = activeCategory === 'todos'
    ? CATALOG
    : CATALOG.filter(item => item.cat === activeCategory);

  $list.innerHTML = filtrados.map(item => {
    const cantidad = qty[item.id] || 0;
    return `
      <div class="article-card${cantidad > 0 ? ' selected' : ''}" data-cat="${item.cat}" role="listitem">
        <div class="article-icon" aria-hidden="true">${item.icon}</div>
        <div class="article-info">
          <span class="article-name">${item.name}</span>
          <span class="article-volume">${item.vol.toFixed(2)} m³</span>
        </div>
        <div class="article-controls" role="group" aria-label="Cantidad de ${item.name}">
          <button class="btn-qty minus" data-id="${item.id}" aria-label="Quitar ${item.name}">−</button>
          <span class="qty${cantidad > 0 ? ' has-value' : ''}" data-id="${item.id}"
                aria-live="polite" aria-label="Cantidad: ${cantidad}">${cantidad}</span>
          <button class="btn-qty plus" data-id="${item.id}" aria-label="Agregar ${item.name}">+</button>
        </div>
      </div>`;
  }).join('');
}

// ─── Recalc ───────────────────────────────────────────────────────────────────
// Recalcula todo y actualiza el DOM en tiempo real.
function recalc() {
  const { tarifa, distancia, capacidad } = getConfig();

  let totalVol   = 0;
  let totalItems = 0;

  CATALOG.forEach(item => {
    const q = qty[item.id] || 0;
    totalVol   += item.vol * q;
    totalItems += q;
  });

  const pct   = (totalVol / capacidad) * 100;
  const pctUI = Math.min(pct, 100);
  const costo = tarifa * distancia;

  // Barra de ocupación
  $occFill.style.width = pctUI + '%';
  $occFill.className   = 'occupancy-fill' + (pct >= 100 ? ' over' : pct >= 80 ? ' warning' : '');
  $occPct.textContent  = Math.round(pct) + '%';
  $occBar.setAttribute('aria-valuenow', Math.round(pctUI));

  // Stats del resumen
  $statVol.textContent  = totalVol.toFixed(2) + ' m³';
  $statCosto.textContent = formatCLP(costo);
  $statDist.textContent  = distancia + ' km';

  // Contador de artículos
  $sumItems.textContent = totalItems === 1
    ? '1 artículo seleccionado'
    : `${totalItems} artículos seleccionados`;

  // Botón total
  $totalPrice.textContent = formatCLP(costo);

  // Barra de resumen fija
  $sbarVol.textContent   = totalVol.toFixed(2) + ' m³';
  $sbarPct.textContent   = Math.round(pct) + '%';
  $sbarTotal.textContent = formatCLP(costo);
}

// ─── Gestión de cantidad ──────────────────────────────────────────────────────
// Actualiza qty[id] y refresca solo los nodos afectados, sin re-renderizar toda la lista.
function changeQty(id, delta) {
  qty[id] = Math.max(0, (qty[id] || 0) + delta);

  const $span = $list.querySelector(`.qty[data-id="${id}"]`);
  if ($span) {
    $span.textContent = qty[id];
    $span.setAttribute('aria-label', `Cantidad: ${qty[id]}`);
    $span.classList.toggle('has-value', qty[id] > 0);
    $span.closest('.article-card').classList.toggle('selected', qty[id] > 0);
  }

  recalc();
}

// ─── Compartir ────────────────────────────────────────────────────────────────
async function compartir() {
  const { tarifa, distancia } = getConfig();
  const seleccionados = CATALOG.filter(item => (qty[item.id] || 0) > 0);

  if (!seleccionados.length) {
    alert('Agrega al menos un artículo antes de compartir.');
    return;
  }

  let totalVol = 0;
  seleccionados.forEach(item => { totalVol += item.vol * qty[item.id]; });
  const costo = tarifa * distancia;

  const lineas = seleccionados.map(item => {
    const sub = (item.vol * qty[item.id]).toFixed(2);
    return `${item.icon} ${item.name} × ${qty[item.id]}  (${sub} m³)`;
  });

  const texto = [
    '🚛 COTIZACIÓN FLETE.APP',
    '─────────────────────',
    ...lineas,
    '─────────────────────',
    `📦 Volumen total : ${totalVol.toFixed(2)} m³`,
    `📍 Distancia     : ${distancia} km`,
    `💰 Costo estimado: ${formatCLP(costo)}`,
    '',
    'Generado con FLETE.APP',
  ].join('\n');

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Cotización FleteApp', text: texto });
    } catch (err) {
      if (err.name !== 'AbortError') copiarPortapapeles(texto);
    }
  } else {
    copiarPortapapeles(texto);
  }
}

function copiarPortapapeles(texto) {
  navigator.clipboard.writeText(texto)
    .then(() => alert('✓ Cotización copiada al portapapeles.'))
    .catch(() => alert('No se pudo copiar automáticamente.\n\n' + texto));
}

// ─── Event listeners ──────────────────────────────────────────────────────────

// Tabs
$tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    $tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    activeCategory = tab.dataset.cat;
    render();
  });
});

// Botones +/− con delegación de eventos
$list.addEventListener('click', e => {
  const btn = e.target.closest('.btn-qty');
  if (!btn) return;
  const id    = parseInt(btn.dataset.id, 10);
  const delta = btn.classList.contains('plus') ? 1 : -1;
  changeQty(id, delta);
});

// Campos de configuración
[$cfgTarifa, $cfgDist, $cfgCap].forEach(input => {
  input.addEventListener('input', recalc);
});

// Botón compartir
$btnShare.addEventListener('click', compartir);

// ─── Init ─────────────────────────────────────────────────────────────────────
render();
recalc();
