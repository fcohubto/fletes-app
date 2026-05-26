// FleteApp — Lógica principal

// ─── Estado ───────────────────────────────────────────────────────────────────
const qty = {};          // { [id]: number } — cantidad por artículo
let activeCategory = 'todos';

// ─── Referencias DOM ──────────────────────────────────────────────────────────
const $list       = document.getElementById('articles-list');
const $tabs       = document.querySelectorAll('.tab');
const $cfgTarifa  = document.getElementById('cfg-tarifa');
const $cfgDist    = document.getElementById('cfg-distancia');
const $cfgCap     = document.getElementById('cfg-capacidad');
const $occFill    = document.getElementById('occupancy-fill');
const $occPct     = document.getElementById('occupancy-pct');
const $statVol    = document.getElementById('stat-volume');
const $statCosto  = document.getElementById('stat-costo');
const $sumItems   = document.getElementById('summary-items');
const $totalPrice = document.getElementById('btn-total-price');
const $btnShare   = document.querySelector('.btn-share');

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Formatea número como peso chileno: $21.250
const formatCLP = n => '$' + Math.round(n).toLocaleString('es-CL');

// Lee los tres campos de configuración y devuelve números seguros
const getConfig = () => ({
  tarifa:    parseFloat($cfgTarifa.value)  || 0,
  distancia: parseFloat($cfgDist.value)    || 0,
  capacidad: parseFloat($cfgCap.value)     || 1,  // evitar división por cero
});

// Capitaliza primera letra
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

// ─── Render ───────────────────────────────────────────────────────────────────
// Genera el HTML de la lista filtrada por categoría activa.
// Agrupa los artículos por categoría para mostrar los labels de sección.
function render() {
  const ORDER = ['dormitorio', 'living', 'cocina', 'otros'];

  const filtrados = activeCategory === 'todos'
    ? CATALOG
    : CATALOG.filter(item => item.cat === activeCategory);

  // Agrupar manteniendo el orden definido en ORDER
  const grupos = ORDER.reduce((acc, cat) => {
    const items = filtrados.filter(item => item.cat === cat);
    if (items.length) acc.push({ cat, items });
    return acc;
  }, []);

  $list.innerHTML = grupos.map(({ cat, items }) => `
    <div class="category-label" data-cat="${cat}">${capitalize(cat)}</div>
    ${items.map(item => {
      const cantidad = qty[item.id] || 0;
      return `
        <div class="article-item${cantidad > 0 ? ' selected' : ''}" data-cat="${item.cat}">
          <div class="article-icon" aria-hidden="true">${item.icon}</div>
          <div class="article-info">
            <span class="article-name">${item.name}</span>
            <span class="article-volume">${item.vol.toFixed(2)} m³</span>
          </div>
          <div class="article-controls" role="group" aria-label="Cantidad de ${item.name}">
            <button class="btn-qty minus" data-id="${item.id}" aria-label="Quitar ${item.name}">−</button>
            <span class="qty ${cantidad > 0 ? 'has-value' : ''}" data-id="${item.id}" aria-live="polite" aria-label="Cantidad: ${cantidad}">${cantidad}</span>
            <button class="btn-qty plus"  data-id="${item.id}" aria-label="Agregar ${item.name}">+</button>
          </div>
        </div>`;
    }).join('')}
  `).join('');
}

// ─── Recalc ───────────────────────────────────────────────────────────────────
// Recalcula volumen, ocupación y costo, y actualiza el DOM.
function recalc() {
  const { tarifa, distancia, capacidad } = getConfig();

  let totalVol   = 0;
  let totalItems = 0;

  CATALOG.forEach(item => {
    const q = qty[item.id] || 0;
    totalVol   += item.vol * q;
    totalItems += q;
  });

  // Porcentaje de ocupación (limitado a 100 % visualmente)
  const pct   = (totalVol / capacidad) * 100;
  const pctUI = Math.min(pct, 100);

  // Costo = tarifa por km × distancia
  const costo = tarifa * distancia;

  // Barra de ocupación
  $occFill.style.width = pctUI + '%';
  $occFill.className = 'occupancy-fill' +
    (pct >= 100 ? ' over' : pct >= 80 ? ' warning' : '');
  $occPct.textContent = Math.round(pct) + '%';

  // Stats y totales
  $statVol.textContent   = totalVol.toFixed(2) + ' m³';
  $statCosto.textContent = formatCLP(costo);
  $sumItems.textContent  = totalItems === 1 ? '1 artículo' : `${totalItems} artículos`;
  $totalPrice.textContent = formatCLP(costo);
}

// ─── Gestión de cantidad ──────────────────────────────────────────────────────
// Actualiza qty[id] y refresca solo los nodos afectados (sin re-renderizar todo).
function changeQty(id, delta) {
  qty[id] = Math.max(0, (qty[id] || 0) + delta);

  const $span = $list.querySelector(`.qty[data-id="${id}"]`);
  if ($span) {
    $span.textContent = qty[id];
    $span.setAttribute('aria-label', `Cantidad: ${qty[id]}`);
    $span.classList.toggle('has-value', qty[id] > 0);
    $span.closest('.article-item').classList.toggle('selected', qty[id] > 0);
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

  // Calcular totales para el resumen
  let totalVol = 0;
  seleccionados.forEach(item => { totalVol += item.vol * qty[item.id]; });
  const costo = tarifa * distancia;

  // Construir texto plano del resumen
  const lineas = seleccionados.map(item => {
    const subtotalVol = (item.vol * qty[item.id]).toFixed(2);
    return `${item.icon} ${item.name} × ${qty[item.id]}  (${subtotalVol} m³)`;
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

  // Intentar share nativo; si no está disponible o falla, copiar al portapapeles
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Cotización FleteApp', text: texto });
    } catch (err) {
      // El usuario canceló el share — no hacer nada
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

// Tabs de categoría
$tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    $tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.cat;
    render();
    // recalc no es necesario aquí: las cantidades no cambian al filtrar
  });
});

// Botones +/− con delegación de eventos en la lista
$list.addEventListener('click', e => {
  const btn = e.target.closest('.btn-qty');
  if (!btn) return;
  const id    = parseInt(btn.dataset.id, 10);
  const delta = btn.classList.contains('plus') ? 1 : -1;
  changeQty(id, delta);
});

// Cambios en los campos de configuración
[$cfgTarifa, $cfgDist, $cfgCap].forEach(input => {
  input.addEventListener('input', recalc);
});

// Botón compartir
$btnShare.addEventListener('click', compartir);

// ─── Init ─────────────────────────────────────────────────────────────────────
render();
recalc();
