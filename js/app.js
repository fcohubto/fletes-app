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
const $btnShare     = document.querySelector('.btn-share');
const $btnCompartir = document.getElementById('btn-compartir');
const $sbarVol    = document.getElementById('sbar-volume');
const $sbarPct    = document.getElementById('sbar-pct');
const $sbarTotal  = document.getElementById('sbar-total');
const $cfgBencina = document.getElementById('input-bencina-litro');
const $cfgRend    = document.getElementById('input-bencina-rendimiento');
const $cfgPeajes  = document.getElementById('input-peajes');
const $alertExc   = document.getElementById('alerta-exceso');
const $btnLimpiar = document.getElementById('btn-limpiar');
const $avatar          = document.querySelector('.avatar');
const $profNombre      = document.getElementById('prof-nombre');
const $profTarifa      = document.getElementById('prof-tarifa');
const $profCapacidad   = document.getElementById('prof-capacidad');
const $profBencina     = document.getElementById('prof-bencina');
const $profRendimiento = document.getElementById('prof-rendimiento');
const $inputCliente    = document.getElementById('input-cliente');
const $historialList   = document.getElementById('historial-list');
const $navCotizar      = document.getElementById('nav-cotizar');
const $navPerfil       = document.getElementById('nav-perfil');
const $viewCotizar     = document.getElementById('view-cotizar');
const $viewPerfil      = document.getElementById('view-perfil');
const $summaryBar      = document.querySelector('.summary-bar');

// ─── Persistencia ─────────────────────────────────────────────────────────────
const CONFIG_KEY = 'fleteapp-config';

function saveConfig() {
  localStorage.setItem(CONFIG_KEY, JSON.stringify({
    tarifa:       $cfgTarifa.value,
    distancia:    $cfgDist.value,
    capacidad:    $cfgCap.value,
    bencina:      $cfgBencina?.value  ?? '0',
    rendimiento:  $cfgRend?.value     ?? '0',
    peajes:       $cfgPeajes?.value   ?? '0',
  }));
}

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY));
    if (!saved) return;
    if (saved.tarifa      != null) $cfgTarifa.value          = saved.tarifa;
    if (saved.distancia   != null) $cfgDist.value            = saved.distancia;
    if (saved.capacidad   != null) $cfgCap.value             = saved.capacidad;
    if (saved.bencina     != null && $cfgBencina)  $cfgBencina.value  = saved.bencina;
    if (saved.rendimiento != null && $cfgRend)     $cfgRend.value     = saved.rendimiento;
    if (saved.peajes      != null && $cfgPeajes)   $cfgPeajes.value   = saved.peajes;
  } catch (_) { /* localStorage no disponible o dato corrupto — se usan defaults */ }
}

// ─── Perfil ───────────────────────────────────────────────────────────────────
const PROFILE_KEY = 'fleteapp-profile';

function updateAvatar(nombre) {
  if (!$avatar) return;
  const n = (nombre || '').trim();
  $avatar.textContent = n
    ? n.split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'FC';
}

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({
    nombre:      $profNombre?.value      ?? '',
    tarifa:      $profTarifa?.value      ?? '850',
    capacidad:   $profCapacidad?.value   ?? '20',
    bencina:     $profBencina?.value     ?? '0',
    rendimiento: $profRendimiento?.value ?? '0',
  }));
}

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (!saved) return;
    if (saved.nombre      != null && $profNombre)      { $profNombre.value      = saved.nombre; updateAvatar(saved.nombre); }
    if (saved.tarifa      != null && $profTarifa)      $profTarifa.value      = saved.tarifa;
    if (saved.capacidad   != null && $profCapacidad)   $profCapacidad.value   = saved.capacidad;
    if (saved.bencina     != null && $profBencina)     $profBencina.value     = saved.bencina;
    if (saved.rendimiento != null && $profRendimiento) $profRendimiento.value = saved.rendimiento;
  } catch (_) {}
}

// ─── Historial ────────────────────────────────────────────────────────────────
const HISTORY_KEY = 'fleteapp-history';

function saveQuote() {
  const seleccionados = CATALOG.filter(item => (qty[item.id] || 0) > 0);
  if (!seleccionados.length) return;

  const { tarifa, distancia, capacidad } = getConfig();
  const precioBencina = parseFloat($cfgBencina?.value) || 0;
  const rendimiento   = parseFloat($cfgRend?.value)    || 0;
  const peajes        = parseFloat($cfgPeajes?.value)  || 0;
  const costoBencina  = rendimiento > 0 ? (distancia / rendimiento) * precioBencina : 0;
  const costo         = (tarifa * distancia) + costoBencina + peajes;

  let volumen = 0;
  const items = seleccionados.map(item => {
    const q = qty[item.id];
    volumen += item.vol * q;
    return { name: item.name, icon: item.icon, qty: q, vol: +(item.vol * q).toFixed(2) };
  });

  const now   = new Date();
  const fecha = now.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

  const quote = {
    id:        now.getTime(),
    fecha,
    cliente:   ($inputCliente?.value || '').trim(),
    items,
    volumen:   +volumen.toFixed(2),
    distancia,
    costo:     Math.round(costo),
  };

  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.unshift(quote);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  } catch (_) {}
}

function loadHistory() {
  if (!$historialList) return;
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (!history.length) {
      $historialList.innerHTML = '<p class="history-empty">Las cotizaciones que compartas aparecerán aquí.</p>';
      return;
    }
    $historialList.innerHTML = history.map(q => {
      const preview = q.items.slice(0, 2).map(i => `${i.name} × ${i.qty}`).join(', ')
        + (q.items.length > 2 ? ` y ${q.items.length - 2} más` : '');
      return `
        <div class="history-card">
          <div class="hcard-header">
            <span class="hcard-cliente">${q.cliente || 'Sin nombre'}</span>
            <span class="hcard-fecha">${q.fecha}</span>
          </div>
          <p class="hcard-items">${preview}</p>
          <div class="hcard-footer">
            <span class="hcard-stat">${q.volumen} m³ · ${q.distancia} km</span>
            <span class="hcard-costo">${formatCLP(q.costo)}</span>
            <button class="hcard-btn" data-id="${q.id}" aria-label="Reenviar cotización">Reenviar</button>
          </div>
        </div>`;
    }).join('');
  } catch (_) {}
}

async function reshare(id) {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const q = history.find(h => h.id === id);
    if (!q) return;

    const lineas = q.items.map(i => `${i.icon} ${i.name} × ${i.qty}  (${i.vol.toFixed(2)} m³)`);
    const texto  = [
      '🚛 COTIZACIÓN FLETE.APP',
      '─────────────────────',
      ...(q.cliente ? [`👤 ${q.cliente}`] : []),
      ...lineas,
      '─────────────────────',
      `📦 Volumen total : ${q.volumen.toFixed(2)} m³`,
      `📍 Distancia     : ${q.distancia} km`,
      `💰 Costo estimado: ${formatCLP(q.costo)}`,
      '',
      'Generado con FLETE.APP',
    ].join('\n');

    if (navigator.share) {
      try { await navigator.share({ title: 'Cotización FleteApp', text: texto }); }
      catch (err) { if (err.name !== 'AbortError') copiarPortapapeles(texto); }
    } else {
      copiarPortapapeles(texto);
    }
  } catch (_) {}
}

// ─── Vistas ───────────────────────────────────────────────────────────────────
function showView(view) {
  const isCotizar = view === 'cotizar';
  $viewCotizar.classList.toggle('hidden', !isCotizar);
  $viewPerfil.classList.toggle('hidden', isCotizar);
  $summaryBar.classList.toggle('hidden', !isCotizar);
  $navCotizar.classList.toggle('active', isCotizar);
  $navPerfil.classList.toggle('active', !isCotizar);
  $navCotizar.setAttribute('aria-current', isCotizar ? 'page' : 'false');
  $navPerfil.setAttribute('aria-current', !isCotizar ? 'page' : 'false');
  if (!isCotizar) loadHistory();
}

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

  const precioBencina  = parseFloat($cfgBencina?.value) || 0;
  const rendimiento    = parseFloat($cfgRend?.value)    || 0;
  const peajes         = parseFloat($cfgPeajes?.value)  || 0;
  const costoBencina   = rendimiento > 0 ? (distancia / rendimiento) * precioBencina : 0;
  const costo = (tarifa * distancia) + costoBencina + peajes;

  // Barra de ocupación
  $occFill.style.width = pctUI + '%';
  $occFill.className   = 'occupancy-fill' + (pct >= 100 ? ' over' : pct >= 80 ? ' warning' : '');
  $occPct.textContent  = Math.round(pct) + '%';
  $occPct.classList.toggle('ocupacion-excedida', pct > 100);
  $occBar.setAttribute('aria-valuenow', Math.round(pctUI));

  // Alerta exceso capacidad
  if ($alertExc) $alertExc.classList.toggle('hidden', totalVol <= capacidad);

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

  // Estado visual de la barra según ocupación
  $summaryBar?.classList.toggle('warning', pct >= 80 && pct < 100);
  $summaryBar?.classList.toggle('over',    pct >= 100);
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
  const precioBencina = parseFloat($cfgBencina?.value) || 0;
  const rendimiento   = parseFloat($cfgRend?.value)    || 0;
  const peajes        = parseFloat($cfgPeajes?.value)  || 0;
  const costoBencina  = rendimiento > 0 ? (distancia / rendimiento) * precioBencina : 0;
  const costo         = (tarifa * distancia) + costoBencina + peajes;

  const lineas = seleccionados.map(item => {
    const sub = (item.vol * qty[item.id]).toFixed(2);
    return `${item.icon} ${item.name} × ${qty[item.id]}  (${sub} m³)`;
  });

  const cliente = ($inputCliente?.value || '').trim();
  const texto = [
    '🚛 COTIZACIÓN FLETE.APP',
    '─────────────────────',
    ...(cliente ? [`👤 ${cliente}`] : []),
    ...lineas,
    '─────────────────────',
    `📦 Volumen total : ${totalVol.toFixed(2)} m³`,
    `📍 Distancia     : ${distancia} km`,
    `💰 Costo estimado: ${formatCLP(costo)}`,
    '',
    'Generado con FLETE.APP',
  ].join('\n');

  saveQuote();
  if ($inputCliente) $inputCliente.value = '';

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
  input.addEventListener('input', () => { recalc(); saveConfig(); });
});

// Botones compartir
$btnShare.addEventListener('click', compartir);
$btnCompartir?.addEventListener('click', compartir);

// Campos costos adicionales
[$cfgBencina, $cfgRend, $cfgPeajes].forEach(input => {
  input?.addEventListener('input', () => { recalc(); saveConfig(); });
});

// Perfil: sincronizar a config card al editar
$profNombre?.addEventListener('input', () => {
  updateAvatar($profNombre.value);
  saveProfile();
});

[
  [$profTarifa,      $cfgTarifa],
  [$profCapacidad,   $cfgCap],
  [$profBencina,     $cfgBencina],
  [$profRendimiento, $cfgRend],
].forEach(([src, dst]) => {
  src?.addEventListener('input', () => {
    if (dst) dst.value = src.value;
    saveProfile();
    recalc();
    saveConfig();
  });
});

// Nav switching
$navCotizar?.addEventListener('click', () => showView('cotizar'));
$navPerfil?.addEventListener('click',  () => showView('perfil'));

// Reenviar cotización desde historial
$historialList?.addEventListener('click', e => {
  const btn = e.target.closest('.hcard-btn');
  if (!btn) return;
  reshare(parseInt(btn.dataset.id, 10));
});

// Botón limpiar
$btnLimpiar?.addEventListener('click', () => {
  CATALOG.forEach(item => { qty[item.id] = 0; });
  render();
  recalc();
});

// ─── Init ─────────────────────────────────────────────────────────────────────
loadConfig();
loadProfile();
render();
recalc();
