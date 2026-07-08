// FleteApp — Lógica principal

// ─── Distancias desde Santiago (km aprox. por ruta) ───────────────────────────
const KM_DESDE_SANTIAGO = {
  'arica': 2060, 'iquique': 1850, 'tocopilla': 1640,
  'antofagasta': 1380, 'calama': 1540, 'mejillones': 1370,
  'copiapo': 805, 'vallenar': 680,
  'la serena': 470, 'coquimbo': 480, 'ovalle': 395,
  'illapel': 320, 'los vilos': 230,
  'valparaiso': 120, 'vina del mar': 125, 'quilpue': 115,
  'villa alemana': 108, 'san antonio': 103,
  'santiago': 0, 'rancagua': 90, 'san fernando': 145,
  'curico': 200, 'talca': 260, 'constitucion': 355,
  'linares': 310, 'chillan': 405, 'los angeles': 510,
  'concepcion': 520, 'talcahuano': 535, 'coronel': 545,
  'lebu': 645, 'canete': 600,
  'temuco': 680, 'villarrica': 760, 'pucon': 785, 'angol': 635,
  'valdivia': 845, 'la union': 880, 'osorno': 950,
  'puerto montt': 1020, 'puerto varas': 1010,
  'ancud': 1105, 'castro': 1155,
  'coyhaique': 1770, 'puerto aysen': 1810,
  'punta arenas': 3100, 'puerto natales': 3055,
};

function normalizeCity(str) {
  return str.trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// ─── Estado ───────────────────────────────────────────────────────────────────
const qty       = {};
let activeCategory = 'todos';
let customItems    = [];
let customIdCtr    = 0;

// ─── Referencias DOM ──────────────────────────────────────────────────────────
const $list           = document.getElementById('articles-list');
const $customList     = document.getElementById('custom-list');
const $tabs           = document.querySelectorAll('.tab');
const $cfgTarifa      = document.getElementById('cfg-tarifa');
const $cfgDist        = document.getElementById('cfg-distancia');
const $cfgCap         = document.getElementById('cfg-capacidad');
const $occFill        = document.getElementById('occupancy-fill');
const $occPct         = document.getElementById('occupancy-pct');
const $occBar         = document.querySelector('.occupancy-bar');
const $statDist       = document.getElementById('stat-distancia');
const $statViajes     = document.getElementById('stat-viajes');
const $viajesRow      = document.getElementById('viajes-row');
const $sumItems       = document.getElementById('summary-items');
const $totalPrice     = document.getElementById('btn-total-price');
const $btnCompartir   = document.getElementById('btn-compartir');
const $sbarVol        = document.getElementById('sbar-volume');
const $sbarPct        = document.getElementById('sbar-pct');
const $sbarTotal      = document.getElementById('sbar-total');
const $cfgBencina     = document.getElementById('input-bencina-litro');
const $cfgRend        = document.getElementById('input-bencina-rendimiento');
const $cfgPeajes      = document.getElementById('input-peajes');
const $alertExc       = document.getElementById('alerta-exceso');
const $alertExcText   = document.getElementById('alerta-exceso-text');
const $tarifaWarn     = document.getElementById('tarifa-warn');
const $btnLimpiar     = document.getElementById('btn-limpiar');
const $avatar         = document.querySelector('.avatar');
const $profNombre     = document.getElementById('prof-nombre');
const $profTarifa     = document.getElementById('prof-tarifa');
const $profCapacidad  = document.getElementById('prof-capacidad');
const $profBencina    = document.getElementById('prof-bencina');
const $profRendimiento= document.getElementById('prof-rendimiento');
const $inputCliente   = document.getElementById('input-cliente');
const $historialList  = document.getElementById('historial-list');
const $navCotizar     = document.getElementById('nav-cotizar');
const $navPerfil      = document.getElementById('nav-perfil');
const $viewCotizar    = document.getElementById('view-cotizar');
const $viewPerfil     = document.getElementById('view-perfil');
const $summaryBar     = document.querySelector('.summary-bar');
const $inputOrigen    = document.getElementById('input-origen');
const $inputDestino   = document.getElementById('input-destino');
const $customName     = document.getElementById('custom-name');
const $customVol      = document.getElementById('custom-vol');
const $btnAddCustom   = document.getElementById('btn-add-custom');
const $truckSummaryText = document.getElementById('truck-summary-text');
const $btnEditarCamion  = document.getElementById('btn-editar-camion');
const $btnVolverPerfil  = document.getElementById('btn-volver-perfil');
const $toast            = document.getElementById('toast');

// ─── Persistencia ─────────────────────────────────────────────────────────────
const CONFIG_KEY = 'fleteapp-config';

function saveConfig() {
  localStorage.setItem(CONFIG_KEY, JSON.stringify({
    tarifa:      $cfgTarifa.value,
    distancia:   $cfgDist.value,
    capacidad:   $cfgCap.value,
    bencina:     $cfgBencina?.value  ?? '0',
    rendimiento: $cfgRend?.value     ?? '0',
    peajes:      $cfgPeajes?.value   ?? '0',
    origen:      $inputOrigen?.value ?? 'Santiago',
    destino:     $inputDestino?.value ?? '',
  }));
}

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY));
    if (!saved) return;
    if (saved.tarifa      != null) $cfgTarifa.value               = saved.tarifa;
    if (saved.distancia   != null) $cfgDist.value                 = saved.distancia;
    if (saved.capacidad   != null) $cfgCap.value                  = saved.capacidad;
    if (saved.bencina     != null && $cfgBencina)  $cfgBencina.value  = saved.bencina;
    if (saved.rendimiento != null && $cfgRend)     $cfgRend.value     = saved.rendimiento;
    if (saved.peajes      != null && $cfgPeajes)   $cfgPeajes.value   = saved.peajes;
    if (saved.origen      != null && $inputOrigen)  $inputOrigen.value  = saved.origen;
    if (saved.destino     != null && $inputDestino) $inputDestino.value = saved.destino;
  } catch (_) {}
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
    if (saved.nombre      != null && $profNombre)      { $profNombre.value = saved.nombre; updateAvatar(saved.nombre); }
    if (saved.tarifa      != null && $profTarifa)      $profTarifa.value      = saved.tarifa;
    if (saved.capacidad   != null && $profCapacidad)   $profCapacidad.value   = saved.capacidad;
    if (saved.bencina     != null && $profBencina)     $profBencina.value     = saved.bencina;
    if (saved.rendimiento != null && $profRendimiento) $profRendimiento.value = saved.rendimiento;
  } catch (_) {}
}

// ─── Historial ────────────────────────────────────────────────────────────────
const HISTORY_KEY = 'fleteapp-history';

function saveQuote() {
  const allSel = [
    ...CATALOG.filter(item => (qty[item.id] || 0) > 0),
    ...customItems.filter(item => (qty[item.id] || 0) > 0),
  ];
  if (!allSel.length) return;

  const { tarifa, distancia, capacidad } = getConfig();
  const precioBencina = getBencina();
  const rendimiento   = parseFloat($cfgRend?.value)    || 0;
  const peajes        = getPeajes();
  const costoBencina  = rendimiento > 0 ? (distancia / rendimiento) * precioBencina : 0;

  let volumen = 0;
  const items = allSel.map(item => {
    const q = qty[item.id];
    volumen += item.vol * q;
    return { name: item.name, icon: item.icon ?? '📦', qty: q, vol: +(item.vol * q).toFixed(2) };
  });

  const viajes        = capacidad > 0 && volumen > capacidad ? Math.ceil(volumen / capacidad) : 1;
  const costoPorViaje = (tarifa * distancia) + costoBencina + peajes;
  const costo         = costoPorViaje * viajes;

  const now   = new Date();
  const fecha = now.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

  const quote = {
    id:        now.getTime(),
    fecha,
    cliente:   ($inputCliente?.value  || '').trim(),
    origen:    ($inputOrigen?.value   || 'Santiago').trim(),
    destino:   ($inputDestino?.value  || '').trim(),
    items,
    volumen:   +volumen.toFixed(2),
    capacidad,
    distancia,
    viajes,
    costo:     Math.round(costo),
  };

  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.unshift(quote);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  } catch (_) {}
}

function deleteHistory(id) {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.filter(h => h.id !== id)));
    loadHistory();
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
      const viajesLabel = (q.viajes > 1) ? ` · ${q.viajes} viajes` : '';
      const ruta = q.destino ? `${q.origen || 'Santiago'} → ${q.destino}` : '';
      return `
        <div class="history-card">
          <div class="hcard-header">
            <span class="hcard-cliente">${q.cliente || 'Sin nombre'}</span>
            <span class="hcard-fecha">${q.fecha}</span>
            <button class="hcard-btn-delete" data-delete="${q.id}" aria-label="Eliminar cotización">×</button>
          </div>
          ${ruta ? `<p class="hcard-ruta">${ruta}</p>` : ''}
          <p class="hcard-items">${preview}</p>
          <div class="hcard-footer">
            <span class="hcard-stat">${q.volumen} m³ · ${q.distancia} km${viajesLabel}</span>
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

    const lineas       = q.items.map(i => `${i.icon} ${i.name} × ${i.qty}  (${i.vol.toFixed(2)} m³)`);
    const ruta         = q.destino ? `${q.origen || 'Santiago'} → ${q.destino}` : '';
    const cap          = q.capacidad || 0;
    const pctOcupacion = cap > 0 ? Math.round((q.volumen / cap) * 100) : 0;
    const volLabel     = cap > 0
      ? `${q.volumen.toFixed(2)} m³ / ${cap} m³ (${pctOcupacion}%)`
      : `${q.volumen.toFixed(2)} m³`;
    const costoPorViaje = q.viajes > 1 ? Math.round(q.costo / q.viajes) : 0;
    const texto  = [
      '🚛 COTIZACIÓN FLETE.APP',
      '─────────────────────',
      ...(q.cliente ? [`👤 ${q.cliente}`] : []),
      ...(ruta      ? [`📍 Ruta: ${ruta}`] : []),
      ...lineas,
      '─────────────────────',
      `📦 Volumen        : ${volLabel}`,
      ...(q.viajes > 1 ? [`🔄 Viajes          : ${q.viajes}`] : []),
      ...(q.viajes > 1 ? [`💰 Por viaje       : ${formatCLP(costoPorViaje)}`] : []),
      `🛣  Distancia      : ${q.distancia} km`,
      `💰 Cotización      : ${formatCLP(q.costo)}`,
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

// Feedback visual breve tras guardar un cambio
let toastTimer = null;
function showToast(msg) {
  if (!$toast) return;
  $toast.textContent = msg;
  $toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $toast.classList.remove('show'), 1600);
}

// Miles con punto (formato CLP) para inputs de texto editables
const formatMiles = digits => digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Tope de dígitos por campo — evita valores absurdos y que el layout se rompa
const DIGIT_LIMIT = { peajes: 7, tarifa: 6, bencina: 4, distancia: 4, capacidad: 3, rendimiento: 2 };

// Campo con formato de moneda (puntos de miles), recortado a un máximo de dígitos
function formatCurrencyInput(el, maxDigits, label) {
  if (!el) return;
  const raw = el.value.replace(/\D/g, '');
  if (raw.length > maxDigits) showToast(`${label}: máximo $${formatMiles('9'.repeat(maxDigits))}`);
  const digits = raw.slice(0, maxDigits);
  el.value = digits ? formatMiles(digits) : '';
}

// Campo numérico simple (sin moneda), recortado a un máximo de dígitos
function clampDigits(el, maxDigits, label) {
  if (!el) return;
  const raw = String(el.value).replace(/\D/g, '');
  if (raw.length > maxDigits) {
    showToast(`${label}: máximo ${'9'.repeat(maxDigits)}`);
    el.value = raw.slice(0, maxDigits);
  }
}

function formatPeajesInput() { formatCurrencyInput($cfgPeajes, DIGIT_LIMIT.peajes, 'Peajes'); }
function getPeajes() { return parseFloat(($cfgPeajes?.value || '0').replace(/\./g, '')) || 0; }

function formatTarifaInput() { formatCurrencyInput($profTarifa, DIGIT_LIMIT.tarifa, 'Tarifa/km'); }
function getTarifa() { return parseFloat(($cfgTarifa?.value || '0').replace(/\./g, '')) || 0; }

function formatBencinaInput() { formatCurrencyInput($profBencina, DIGIT_LIMIT.bencina, '$/L bencina'); }
function getBencina() { return parseFloat(($cfgBencina?.value || '0').replace(/\./g, '')) || 0; }

// Ancho del input según su contenido — evita que los valores largos se corten
function autosizeStatInput(el) {
  if (!el) return;
  el.size = Math.max(String(el.value).length, 1);
}

const getConfig = () => ({
  tarifa:    getTarifa(),
  distancia: parseFloat($cfgDist.value)  || 0,
  capacidad: parseFloat($cfgCap.value)   || 1,
});

// ─── Resumen de camión (defaults de Perfil, solo lectura en Cotizar) ──────────
function updateTruckSummary() {
  if (!$truckSummaryText) return;
  const tarifa    = getTarifa();
  const capacidad = parseFloat($cfgCap.value)        || 0;
  const bencina   = getBencina();
  const partes = [`$${tarifa.toLocaleString('es-CL')}/km`, `${capacidad} m³`];
  if (bencina > 0) partes.push(`$${bencina.toLocaleString('es-CL')}/L`);
  $truckSummaryText.textContent = partes.join(' · ');
}

// ─── Auto-completar distancia (solo funciona cuando origen es Santiago) ───────
function applyKmHint(destino) {
  const origenNorm = normalizeCity($inputOrigen?.value || 'Santiago');
  const esDesde    = origenNorm === 'santiago';

  if (!destino || !esDesde) return;

  const km = KM_DESDE_SANTIAGO[normalizeCity(destino)];
  if (km !== undefined) {
    $cfgDist.value = km;
    recalc();
  }
}

// ─── Artículos personalizados ──────────────────────────────────────────────────
function renderCustomItems() {
  if (!$customList) return;
  $customList.innerHTML = customItems.map(item => {
    const cantidad = qty[item.id] || 0;
    return `
      <div class="article-card${cantidad > 0 ? ' selected' : ''}" role="listitem">
        <div class="article-icon" aria-hidden="true">📦</div>
        <div class="article-info">
          <span class="article-name">${item.name}</span>
          <span class="article-volume">${item.vol.toFixed(2)} m³</span>
        </div>
        <div class="article-controls" role="group" aria-label="Cantidad de ${item.name}">
          <button class="btn-qty minus" data-custom-id="${item.id}" aria-label="Quitar ${item.name}">−</button>
          <span class="qty${cantidad > 0 ? ' has-value' : ''}"
                aria-live="polite" aria-label="Cantidad: ${cantidad}">${cantidad}</span>
          <button class="btn-qty plus"  data-custom-id="${item.id}" aria-label="Agregar ${item.name}">+</button>
        </div>
        <button class="btn-remove-custom" data-remove="${item.id}" aria-label="Eliminar ${item.name}">×</button>
      </div>`;
  }).join('');
}

function addCustomItem() {
  const name = ($customName?.value || '').trim();
  const vol  = parseFloat($customVol?.value);
  if (!name || !vol || vol <= 0) return;

  const id = `custom-${++customIdCtr}`;
  customItems.push({ id, name, vol });
  qty[id] = 1;
  if ($customName) $customName.value = '';
  if ($customVol)  $customVol.value  = '';
  renderCustomItems();
  recalc();
}

// ─── Render catálogo ──────────────────────────────────────────────────────────
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
function recalc() {
  const { tarifa, distancia, capacidad } = getConfig();

  let totalVol   = 0;
  let totalItems = 0;

  CATALOG.forEach(item => {
    const q = qty[item.id] || 0;
    totalVol   += item.vol * q;
    totalItems += q;
  });
  customItems.forEach(item => {
    const q = qty[item.id] || 0;
    totalVol   += item.vol * q;
    totalItems += q;
  });

  const viajes = capacidad > 0 && totalVol > capacidad
    ? Math.ceil(totalVol / capacidad)
    : 1;

  const pct   = capacidad > 0 ? (totalVol / capacidad) * 100 : 0;
  const pctUI = Math.min(pct, 100);

  const precioBencina = getBencina();
  const rendimiento   = parseFloat($cfgRend?.value)    || 0;
  const peajes        = getPeajes();
  const costoBencina  = rendimiento > 0 ? (distancia / rendimiento) * precioBencina : 0;
  const costoPorViaje = (tarifa * distancia) + costoBencina + peajes;
  const costo         = costoPorViaje * viajes;

  $occFill.style.width = pctUI + '%';
  $occFill.className   = 'occupancy-fill' + (pct >= 100 ? ' over' : pct >= 80 ? ' warning' : '');
  $occPct.textContent  = Math.round(pct) + '%';
  $occPct.classList.toggle('ocupacion-excedida', pct > 100);
  $occBar.setAttribute('aria-valuenow', Math.round(pctUI));

  if ($viajesRow && $statViajes) {
    $viajesRow.hidden = viajes <= 1;
    $statViajes.textContent = viajes;
  }

  if ($alertExc) {
    const excede = capacidad > 0 && totalVol > capacidad;
    $alertExc.classList.toggle('hidden', !excede);
    if (excede && $alertExcText) {
      $alertExcText.textContent = viajes > 1
        ? `${viajes} viajes necesarios — costo total calculado`
        : 'Excede la capacidad';
    }
  }

  if ($tarifaWarn) $tarifaWarn.hidden = tarifa > 0;

  $statDist.textContent  = distancia + ' km';

  $sumItems.textContent = totalItems === 1
    ? '1 artículo seleccionado'
    : `${totalItems} artículos seleccionados`;

  $totalPrice.textContent = formatCLP(costo);

  $sbarVol.textContent   = totalVol.toFixed(2) + ' m³';
  $sbarPct.textContent   = viajes > 1 ? `${viajes} vj.` : Math.round(pct) + '%';
  $sbarTotal.textContent = formatCLP(costo);

  $summaryBar?.classList.toggle('warning', pct >= 80 && pct < 100);
  $summaryBar?.classList.toggle('over',    pct >= 100);

  updateTruckSummary();
}

// ─── Gestión de cantidad (catálogo) ──────────────────────────────────────────
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
  const { tarifa, distancia, capacidad } = getConfig();
  const allSel = [
    ...CATALOG.filter(item => (qty[item.id] || 0) > 0),
    ...customItems.filter(item => (qty[item.id] || 0) > 0),
  ];

  if (!allSel.length) {
    alert('Agrega al menos un artículo antes de compartir.');
    return;
  }

  if (tarifa === 0) {
    const ok = confirm('La tarifa por km está en $0. ¿Compartir de todas formas?');
    if (!ok) return;
  }

  let totalVol = 0;
  allSel.forEach(item => { totalVol += item.vol * qty[item.id]; });

  const viajes        = capacidad > 0 && totalVol > capacidad ? Math.ceil(totalVol / capacidad) : 1;
  const precioBencina = getBencina();
  const rendimiento   = parseFloat($cfgRend?.value)    || 0;
  const peajes        = getPeajes();
  const costoBencina  = rendimiento > 0 ? (distancia / rendimiento) * precioBencina : 0;
  const costoPorViaje = (tarifa * distancia) + costoBencina + peajes;
  const costo         = costoPorViaje * viajes;
  const pctOcupacion  = capacidad > 0 ? Math.round((totalVol / capacidad) * 100) : 0;

  const lineas = allSel.map(item => {
    const sub  = (item.vol * qty[item.id]).toFixed(2);
    const icon = item.icon ?? '📦';
    return `${icon} ${item.name} × ${qty[item.id]}  (${sub} m³)`;
  });

  const cliente = ($inputCliente?.value || '').trim();
  const origen  = ($inputOrigen?.value  || 'Santiago').trim();
  const destino = ($inputDestino?.value || '').trim();
  const ruta    = destino ? `${origen} → ${destino}` : '';

  const texto = [
    '🚛 COTIZACIÓN FLETE.APP',
    '─────────────────────',
    ...(cliente ? [`👤 ${cliente}`] : []),
    ...(ruta    ? [`📍 Ruta: ${ruta}`] : []),
    ...lineas,
    '─────────────────────',
    `📦 Volumen        : ${totalVol.toFixed(2)} m³ / ${capacidad} m³ (${pctOcupacion}%)`,
    ...(viajes > 1 ? [`🔄 Viajes          : ${viajes}`] : []),
    ...(viajes > 1 ? [`💰 Por viaje       : ${formatCLP(costoPorViaje)}`] : []),
    `🛣  Distancia      : ${distancia} km`,
    `💰 Cotización      : ${formatCLP(costo)}`,
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

$tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    $tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    activeCategory = tab.dataset.cat;
    render();
  });
});

$list.addEventListener('click', e => {
  const btn = e.target.closest('.btn-qty');
  if (!btn) return;
  const id    = parseInt(btn.dataset.id, 10);
  const delta = btn.classList.contains('plus') ? 1 : -1;
  changeQty(id, delta);
});

$customList?.addEventListener('click', e => {
  const removeBtn = e.target.closest('.btn-remove-custom');
  if (removeBtn) {
    const removeId = removeBtn.dataset.remove;
    customItems = customItems.filter(item => item.id !== removeId);
    delete qty[removeId];
    renderCustomItems();
    recalc();
    return;
  }
  const btn = e.target.closest('.btn-qty');
  if (!btn) return;
  const id    = btn.dataset.customId;
  const delta = btn.classList.contains('plus') ? 1 : -1;
  qty[id]     = Math.max(0, (qty[id] || 0) + delta);
  renderCustomItems();
  recalc();
});

$btnAddCustom?.addEventListener('click', addCustomItem);
$customName?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addCustomItem(); } });
$customVol?.addEventListener('keydown',  e => { if (e.key === 'Enter') { e.preventDefault(); addCustomItem(); } });

[$cfgTarifa, $cfgCap].forEach(input => {
  input.addEventListener('input', () => { recalc(); saveConfig(); });
});
$cfgDist?.addEventListener('input', () => {
  clampDigits($cfgDist, DIGIT_LIMIT.distancia, 'Distancia');
  autosizeStatInput($cfgDist);
  recalc();
  saveConfig();
});

$btnCompartir?.addEventListener('click', compartir);

[$cfgBencina, $cfgRend].forEach(input => {
  input?.addEventListener('input', () => { recalc(); saveConfig(); });
});

$cfgPeajes?.addEventListener('input', () => {
  formatPeajesInput();
  autosizeStatInput($cfgPeajes);
  recalc();
  saveConfig();
});

$profNombre?.addEventListener('input', () => {
  updateAvatar($profNombre.value);
  saveProfile();
});
$profNombre?.addEventListener('change', () => showToast('Nombre guardado'));

$profTarifa?.addEventListener('input', () => {
  formatTarifaInput();
  autosizeStatInput($profTarifa);
  if ($cfgTarifa) $cfgTarifa.value = $profTarifa.value;
  saveProfile();
  recalc();
  saveConfig();
});
$profTarifa?.addEventListener('change', () => showToast('Tarifa guardada'));

$profBencina?.addEventListener('input', () => {
  formatBencinaInput();
  autosizeStatInput($profBencina);
  if ($cfgBencina) $cfgBencina.value = $profBencina.value;
  saveProfile();
  recalc();
  saveConfig();
});
$profBencina?.addEventListener('change', () => showToast('Precio de bencina guardado'));

[
  [$profCapacidad,   $cfgCap,  DIGIT_LIMIT.capacidad,   'Capacidad',    'Capacidad guardada'],
  [$profRendimiento, $cfgRend, DIGIT_LIMIT.rendimiento, 'Rendimiento',  'Rendimiento guardado'],
].forEach(([src, dst, maxDigits, label, msg]) => {
  src?.addEventListener('input', () => {
    clampDigits(src, maxDigits, label);
    if (dst) dst.value = src.value;
    autosizeStatInput(src);
    saveProfile();
    recalc();
    saveConfig();
  });
  src?.addEventListener('change', () => showToast(msg));
});

$navCotizar?.addEventListener('click', () => showView('cotizar'));
$navPerfil?.addEventListener('click',  () => showView('perfil'));
$btnEditarCamion?.addEventListener('click', () => showView('perfil'));
$btnVolverPerfil?.addEventListener('click', () => showView('cotizar'));

$historialList?.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.hcard-btn-delete');
  if (deleteBtn) {
    if (confirm('¿Eliminar esta cotización del historial? No se puede deshacer.')) {
      deleteHistory(parseInt(deleteBtn.dataset.delete, 10));
      showToast('Cotización eliminada');
    }
    return;
  }
  const reshareBtn = e.target.closest('.hcard-btn');
  if (reshareBtn) reshare(parseInt(reshareBtn.dataset.id, 10));
});

// O/D
$inputOrigen?.addEventListener('change', () => {
  if ($inputDestino?.value) applyKmHint($inputDestino.value);
  saveConfig();
});

$inputDestino?.addEventListener('change', () => {
  $inputDestino.classList.toggle('placeholder', !$inputDestino.value);
  applyKmHint($inputDestino.value);
  saveConfig();
});

// Limpiar todo — resetea artículos, destino, cliente y distancia
$btnLimpiar?.addEventListener('click', () => {
  CATALOG.forEach(item => { qty[item.id] = 0; });
  customItems = [];
  customIdCtr = 0;

  if ($inputDestino) {
    $inputDestino.value = '';
    $inputDestino.classList.add('placeholder');
  }
  if ($inputCliente) $inputCliente.value = '';
  if ($cfgDist)      $cfgDist.value = '0';

  renderCustomItems();
  render();
  recalc();
  saveConfig();
});

// ─── Init ─────────────────────────────────────────────────────────────────────
loadConfig();
loadProfile();

if ($inputDestino) {
  $inputDestino.classList.toggle('placeholder', !$inputDestino.value);
  if ($inputDestino.value) applyKmHint($inputDestino.value);
}

clampDigits($cfgDist, DIGIT_LIMIT.distancia, 'Distancia');
formatPeajesInput();
autosizeStatInput($cfgDist);
autosizeStatInput($cfgPeajes);

formatTarifaInput();
if ($cfgTarifa && $profTarifa) $cfgTarifa.value = $profTarifa.value;
autosizeStatInput($profTarifa);

clampDigits($profCapacidad, DIGIT_LIMIT.capacidad, 'Capacidad');
autosizeStatInput($profCapacidad);

formatBencinaInput();
if ($cfgBencina && $profBencina) $cfgBencina.value = $profBencina.value;
autosizeStatInput($profBencina);

clampDigits($profRendimiento, DIGIT_LIMIT.rendimiento, 'Rendimiento');
autosizeStatInput($profRendimiento);

render();
renderCustomItems();
recalc();
