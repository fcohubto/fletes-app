# project-continuity.md — FleteApp

**Producto:** FleteApp — Cotizador profesional de transporte
**Repo:** https://github.com/fcohubto/fletes-app
**Deploy:** https://fcohubto.github.io/fletes-app
**Ruta:** `Productos/fletes-app/`

---

## Estado actual — 2026-07-09 · CERRADA por hoy, todo pusheado a origin/main

**Commit `d59ae3b`** — break operativo actualizado + anexo resumen para reunión con PM socia (agenda ver `project_pm_socia` en memoria).

- `break-operativo.html` (ahora en `_proceso/`, no `framework/`) subió a **v0.2**: se agregó columna "Alianzas potenciales" al Frame 07 (Estrategia Comercial) — 6 categorías de partnership (cooperativas de transportistas, aseguradoras de carga, estaciones de servicio, talleres, logística B2B, fintech de combustible/peajes), todas marcadas explícitamente como **"Supuestos a validar"**, sin contacto real iniciado. Potencial económico se dejó sin cifra inventada — se mantuvo la postura honesta de "sin datos, pendiente de validar" (decisión explícita de Francisco).
- **Nuevo archivo `break-operativo-resumen.html`** — anexo tipo pitch deck para presentar en videollamada sin saturar. 9 frames, un foco por pantalla, tipografía grande (hasta 9rem en cifras), misma paleta carbón/ámbar. Reutiliza la mecánica de scroll/nav del documento completo pero sin las grillas densas (`cols-2`/`cols-3`).
  - Iteración de contenido: el frame de "Gap crítico" inicial resultó poco claro sin el contexto del flujo completo — se reescribió como par de frames **"El gap" (rojo) → "La oportunidad" (ámbar)**, mostrando primero el problema concreto (la cotización se manda por WhatsApp y ahí se pierde el rastro: no hay confirmación, estado ni cierre) y luego qué se podría construir para resolverlo. El contraste de color entre ambos frames comunica visualmente que es una oportunidad, no solo una falla.
  - Revisado bajo skills `commercial-advisor.md`, `delivery-ui.md`, `production-review.md` y `output-formats.md` antes de darlo por cerrado: headings semánticos reales (`<h1>`/`<h2>`, antes solo `<span>`), sin puntos finales en titulares (patrón IA), link "Detalle completo" ahora clickeable, foco de teclado visible en nav, resguardo responsive para ventana angosta, contraste del rojo verificado (~4.67:1, pasa AA).
- **No verificado en navegador real** — la extensión Claude-in-Chrome no tiene permiso para `file://` en este equipo (se habilita en `chrome://extensions`). Ambos documentos se revisaron por código/CSS pero Francisco debe abrirlos manualmente antes de la reunión.
- **Pendiente sin resolver:** hay 5 archivos más en `_proceso/` que nunca se commitearon (`design-log.html`, `project-continuity.md` — este mismo archivo, `carga-design-system.html`, `deep-research-report.md`, `test-validacion-2026-06-04.md`) — quedaron fuera del commit de hoy a propósito, por no ser parte de esta tarea. Decidir si se versionan.

---

## Estado actual — 2026-07-08 · CERRADA por hoy, todo pusheado a origin/main

### Stack commits (main)
`7cb195e` → `a2e3269` → `d04b532` → `6f9cf47` → `6ca2635` → `1cd1245` (fix cotizar: simetría O/D, formato CLP, límites numéricos) → `34f4774` (bump SW v3→v4) → `4198a2e` (fix halo neumórfico + autosize cross-browser + avatar clickeable) → `7ea1d2e` (bump SW v4→v5) → `e043678` (fix touch-callout/drag nativo iOS) → `e5e264b` (bump SW v5→v6)

### Versión activa: v2.0 — iOS hardened + share enriquecido + iteración IA 2026-07-08 (**pusheado a `origin/main`, `6ca2635..e5e264b`**)

**Service Worker en `fleteapp-v6`** (arrancó en v3 hoy) — cada ronda de fixes visuales/JS fue seguida de un bump porque una PWA instalada sigue sirviendo assets cacheados hasta que cambia `CACHE_NAME`; sin esto el teléfono de Francisco habría seguido mostrando versiones viejas aunque el código ya estuviera en GitHub. Deploy vía GitHub Pages (`https://fcohubto.github.io/fletes-app`) tarda 1-2 min en propagar tras cada push — si al abrir en el teléfono no se ven los cambios, forzar refresh (cerrar la PWA por completo y reabrir).

**Cambio de enfoque:** se pausó el plan de "Figma primero" y se está iterando directo en `index.html`/`css/styles.css`/`js/app.js` a partir de A/B testing visual (capturas comparadas por Francisco) + hallazgos de arquitectura de información. Ver sesión de hoy abajo.

---

## Completado sesión 2026-07-08 — A/B testing visual + reestructuración de Cotizar

**Metodología:** Francisco comparó capturas A/B de componentes reales (screenshots de dos variantes) y decidió sobre evidencia visual directa, sin pasar por Figma. Se implementó en caliente sobre `index.html` / `css/styles.css` / `js/app.js`. **Nada de esto está commiteado.**

### A/B testing — 5 secciones, ganó B en las 5
1. Card Distancia: header "DISTANCIA" + O/D + km centrado (vs. card O/D con hint suelto)
2. Card de parámetros: sin íconos, jerarquía tipográfica azul/bold vs. peso uniforme (A tenía un ícono de cama 🛏️ mal asignado a "Peajes")
3. Categorías: label "CATEGORIAS" + pills espaciadas + estado activo en color (vs. label chico + texto cortado a media palabra)
4. Article-card: mismo layout, la diferencia real era tipografía — se resolvió con el cambio de fuente global
5. Pantalla completa: se corrigió un sesgo de comparación (el resumen/CTA de A no se veía por corte de scroll, no por ausencia) — pero se detectó que el resumen del "A" real (evidencia de campo, Imagen #6) incluye una barra de progreso de ocupación que B no tenía en el wireframe — **pendiente verificar que esté en la implementación actual**

### Hallazgo de arquitectura de información
Contando datos visibles en un solo scroll de Cotizar: **Distancia aparecía 3 veces** (O/D card, card de parámetros, resumen) y **Volumen/Ocupación/Total 2 veces** (resumen + footer). Además, 4 de 6 campos de la card de parámetros (tarifa, capacidad, bencina, rendimiento) ya vivían duplicados en Perfil — confirmado con evidencia (Imagen #7).

Esto contradice la decisión estratégica ya documentada: *"Core value: artículos → volumen → ocupación → cotización. No la distancia."* — visualmente distancia dominaba 3 posiciones del scroll.

### Decisión de IA tomada (validada por Francisco)
- **Cotizar sigue siendo la pantalla de aterrizaje** — se descartó la idea de un "hub" con selector de tareas ("¿qué quieres hacer hoy?") porque le agrega fricción a la tarea más frecuente.
- **Tarifa, capacidad, $/L bencina y km/litro viven solo en Perfil** (ya existían ahí, con sync ya implementado en `app.js`). En Cotizar pasaron a inputs `type="hidden"` — el cálculo no cambió, solo dejaron de mostrarse duplicados.
- Se agregó fila `truck-summary` en Cotizar: resumen de solo lectura ("$850/km · 20 m³") + link **"Editar mi camión →"** que navega a Perfil.
- **Distancia y Peajes** (datos por-viaje, no persistentes) se fusionaron dentro de la misma **O/D card**, en layout de 2 columnas: Origen/Destino a la izquierda, Distancia/Peajes a la derecha, separadas por un divisor punteado central (mismo estilo que el conector de pines O/D). Reemplaza el hint de texto duplicado "~405 km desde Santiago".

### Cambio de tipografía
Toda la app pasó de **Barlow + Barlow Condensed** a **Plus Jakarta Sans** (única familia, pesos 400/500/600/700/800) — decisión que ya estaba tomada en `design-log.html` Paso 02 para el redesign en Figma, ahora aplicada directo al código en producción.

### Pendiente sin resolver (detectado pero no implementado aún)
- **Duplicación resumen-card + summary-bar**: Volumen/Ocupación/Total siguen mostrándose 2 veces (card `.summary-card` completa + barra fija inferior). Flagueado, no abordado — decidir si la card de resumen se elimina o el footer se simplifica.
- **Barra de progreso de ocupación** en el resumen — verificar que el `.occupancy-bar` actual (si existe) se vea bien tras los cambios de layout.
- **Ancho del campo Peajes**: 80px a font-size 2rem podría apretarse con montos de 5 dígitos ($20.000+). No verificado visualmente en navegador.
- Nada de lo anterior está verificado en navegador esta sesión — Francisco lo revisará directamente.

### Tensión estratégica a resolver
La decisión previa era *"Redesign desde Figma — no parchear el CSS actual"* (ver Decisiones estratégicas). Hoy se iteró directo sobre el código en producción. Vale la pena decidir explícitamente si esto reemplaza el plan de Figma o es paralelo/exploratorio.

---

## Completado sesión 2026-07-08 (continuación) — ronda de fixes verificados en navegador, commit `1cd1245`

Todo lo pendiente de la sesión anterior (arriba) quedó resuelto y verificado con Chrome automatizado (no solo revisión de código):

1. **Simetría O/D card** — Distancia/Peajes tenían tipografía distinta a Origen/Destino (24px azul vs 16px blanco) y ritmo vertical desalineado (filas Destino/Peajes quedaban 5-6px desfasadas). Unificado el tratamiento tipográfico y el espaciado; encontrado de paso un typo real (`var(--text-l)`, token inexistente) que inflaba la fila de valores.
2. **Botón de compartir redundante** — `.btn-share` (ícono) y `#btn-compartir` llamaban a la misma función `compartir()`. Eliminado; "Generar cotización" ocupa el 100% del ancho.
3. **Duplicación resumen-card + summary-bar** — resuelto sin quitar la summary-bar (cumple función real: total visible mientras se navega la lista de artículos). Se recortaron de `.summary-card` las filas "Volumen total" y "Costo total" (ya vivían en la summary-bar y en el botón); quedan solo los datos únicos (artículos, ocupación, distancia).
4. **Perfil: navegación y feedback** — botón "← Volver" agregado (antes solo se salía por el nav inferior). Toast de confirmación al guardar cualquier campo de Perfil (dispara en `change`, no en cada tecla) y `confirm()` antes de borrar una cotización del historial (antes se borraba sin aviso).
5. **Formato de moneda CLP** — Peajes, Tarifa/km y $/L bencina ahora muestran puntos de miles al escribir (`1.250.000`), consistente con `formatCLP()` que ya se usaba en los totales.
6. **Bug de cálculo real encontrado** — `getConfig()` y `updateTruckSummary()` leían la tarifa/bencina con `parseFloat()` sin quitar los puntos de miles: `"1.250.000"` se habría calculado como `1.25`. Corregido con `getTarifa()`/`getBencina()`/`getPeajes()` centralizados.
7. **Límite de dígitos por campo** — inputs sin tope permitían valores absurdos (`100233932932913912` en tarifa) y además rompían el layout: el ancho fijo (`60px`/`70px`/`80px` según el campo) cortaba el texto en valores de 5+ dígitos, y en un caso extremo el símbolo `$` quedaba empujado fuera del contenedor (`overflow:hidden` de `.app`) y desaparecía visualmente. Se reemplazó el ancho fijo por autosize dinámico (atributo `size` actualizado por JS) y se agregó un tope de dígitos por campo con aviso vía toast al alcanzarlo:

   | Campo | Tope |
   |---|---|
   | Tarifa/km | 6 dígitos ($999.999) |
   | Peajes | 7 dígitos ($9.999.999) |
   | $/L bencina | 4 dígitos ($9.999) |
   | Distancia | 4 dígitos (9.999 km) |
   | Capacidad | 3 dígitos (999 m³) |
   | Rendimiento | 2 dígitos (99 km/L) |

Verificado en navegador (Chrome automatizado, server local temporal): mediciones de `getBoundingClientRect()` para simetría, casos extremos de input (peajes con 16 dígitos, tarifa con 18 dígitos) confirmando el clamp y el cálculo final correcto, sin errores de consola.

---

## Completado sesión 2026-07-08 (ronda 3) — validación en iPhone real, bugs que solo aparecían en Safari/PWA instalada

Francisco probó `1cd1245` en su iPhone (no solo en el navegador de escritorio) y encontró 3 bugs que la verificación en Chrome no había detectado — todos por comportamiento específico de Safari/iOS:

1. **Autosize roto en dispositivo real (commit `4198a2e`)** — el fix de ancho dinámico de la sesión anterior usaba el atributo HTML `size` en inputs `number`/`text`. Ese atributo no está bien especificado para esos tipos: Chrome y Safari calculan el ancho por carácter de forma distinta, por eso en el navegador de escritorio se veía bien pero en el iPhone "km" y "$" se disparaban fuera de la card. Reemplazado por `ch` (unidad CSS estándar, ancho del glyph "0" en la fuente activa) — consistente por definición del spec, no por heurística de cada motor.

2. **Halo blanco en badges/cards, dos rondas para resolverlo (commits `4198a2e` + confirmación posterior)** — primer intento: suavizar `--sl` (color de highlight neumórfico) de `#FFFFFF` a `#F7F9FC` en modo claro. Insuficiente — Francisco seguía viendo el halo en modo oscuro (`--sl:#2E2A26` vs `--bg:#1C1917`, sin tocar). Fix definitivo: `--sl` pasa a ser literalmente `var(--bg)` en ambos temas — la sombra clara del neumorfismo queda invisible por definición (mismo color que el fondo), solo la sombra oscura (`--sd`) da la sensación de relieve. Sin halo posible en ningún tema, no depende de calibrar un tono "suficientemente parecido".

3. **Avatar del header sin conectar** — tenía `cursor:pointer` pero ningún listener (affordance rota). Conectado a Perfil, con `role="button"`, `tabindex="0"` y soporte de teclado (Enter/Espacio) ya que es un `<div>`, no un `<button>` nativo.

4. **"Se puede arrastrar toda la app" al mantener presionado un botón (commit `e043678`)** — comportamiento nativo de iOS Safari/PWA: sin `-webkit-touch-callout:none`, cualquier elemento permite iniciar el gesto nativo de long-press (seleccionar/arrastrar) al mantenerlo presionado. Agregado `-webkit-touch-callout:none` + `-webkit-user-drag:none` globales, y `user-select:none` a nivel `body` (antes solo estaba en `<button>`, no cubría el avatar ni el resto de la superficie táctil). Inputs/textarea/select re-habilitados explícitamente para seguir permitiendo escribir y seleccionar texto.

**Patrón para recordar:** varios de estos bugs solo se manifiestan en Safari/iOS real, no en Chrome de escritorio (autosize) ni en un tema (halo solo se vio primero en claro, pero también estaba en oscuro). La verificación en Chrome automatizado sigue siendo útil para confirmar que no hay errores de consola/cálculo, pero **no reemplaza** una pasada en el dispositivo real antes de dar un fix por cerrado en esta app.

Service Worker bumpeado 3 veces en esta ronda (`v4→v5→v6`), uno por cada commit de fix, para forzar que la PWA instalada tome cada versión.

---

## Completado sesión 2026-06-26

### Análisis competitivo — iziPro
- iziPro (mudanzas.izipro.cl) identificado como competidor indirecto
- Solo Región Metropolitana · B2C marketplace · precio fijo
- Posicionamiento: iziPro = cliente final, FleteApp = transportista. No compiten hoy.
- Riesgo largo plazo documentado. Oportunidad: herramienta anti-comisión.

### Break Operativo creado (`framework/break-operativo.html`)
- 9 frames horizontales navegables con flechas, dots y teclado
- Diseño dark carbon (#0D0B09), Barlow Condensed, acento ámbar (#C8A97A)
- Frame 04 — Viaje del Usuario: 6 etapas, curva SVG, bubbles, oportunidades por columna
- GAP crítico documentado visualmente: post-envío sin seguimiento

### Frames del break operativo

| Frame | Título | Estado |
|---|---|---|
| 01 | Visión General | ✅ Completo |
| 02 | Definición del Producto | ✅ Completo |
| 03 | Propuesta de Valor | ✅ Completo |
| 04 | Viaje del Usuario | ✅ Completo |
| 05 | Arquitectura de la App | ✅ Completo — diagrama SVG espacial (pantallas, nodos, flechas) |
| 06 | Estado del Proyecto | ✅ Completo |
| 07 | Estrategia Comercial | ✅ Completo |
| 08 | Hoja de Ruta | ✅ Completo |
| 09 | Sistema de Diseño | ✅ Completo |

---

## Archivos del proyecto

| Archivo | Estado |
|---|---|
| `index.html` | 2026-07-08 (commit `e5e264b`): O/D card fusionada con Distancia/Peajes en 2 columnas, tarifa/capacidad/bencina/rendimiento ocultos (viven en Perfil), fuente Plus Jakarta Sans, botón "Volver" en Perfil, sin botón share redundante, avatar del header conectado a Perfil (`role="button"` + teclado), límites `maxlength` en inputs numéricos (sin `size`, ver `css/styles.css`) |
| `css/styles.css` | 2026-07-08 (commit `e5e264b`): estilos `.od-row/.od-col/.od-col-stats/.truck-summary`, fuente Plus Jakarta Sans en todo el archivo, autosize de inputs vía `ch` (JS, no `size` HTML), toast de confirmación, `--sl: var(--bg)` en ambos temas (sin halo neumórfico), `-webkit-touch-callout:none` + `user-select:none` global (evita drag/callout nativo iOS) |
| `js/app.js` | 2026-07-08 (commit `e5e264b`): `updateTruckSummary()`, limpieza de `applyKmHint()`, formato CLP (`formatMiles`/`formatCurrencyInput`), `getTarifa()`/`getPeajes()`/`getBencina()` centralizados, `clampDigits()` con tope por campo, `showToast()`, `autosizeStatInput()` basado en `ch` |
| `js/catalog.js` | Sin cambios — 60+ artículos, 8 categorías |
| `manifest.json` | Actualizado |
| `sw.js` | v6 — bumpeado 3 veces en la ronda de validación en iPhone real (v4→v5→v6), paths `/fletes-app/*` corregidos |
| `_proceso/break-operativo.html` | v0.2 (2026-07-09) — 9 frames + columna de alianzas potenciales en Frame 07. Commiteado `d59ae3b` |
| `_proceso/break-operativo-resumen.html` | v1.0 (2026-07-09) — anexo pitch deck, 9 frames simplificados para videollamada. Commiteado `d59ae3b` |
| `design-log.html` | Registro vivo del redesign — sin commitear |

---

## Costo de servicios externos en vivo

**Sin servicios pay-per-use.** Cotizador con lógica propia (artículos → volumen → ocupación); `navigator.share`/clipboard para compartir no tiene costo. No llama a IA ni a APIs de terceros con medidor. No aplica costo variable.

## Stack

| Capa | Herramienta |
|---|---|
| Frontend | Vanilla HTML/CSS/JS |
| Tipografía | Plus Jakarta Sans (única familia, 400/500/600/700/800) — cambiada 2026-07-08, antes Barlow + Barlow Condensed |
| Persistencia | localStorage |
| Compartir | navigator.share / clipboard fallback |
| PWA | Service Worker v3 + manifest |
| Hosting | GitHub Pages (`/fletes-app/`) |

---

## Decisiones estratégicas

- **Core value:** artículos → volumen → ocupación → cotización. No la distancia.
- **El texto compartido ES el producto** — mecanismo de adopción.
- **Posición vs iziPro:** herramienta del transportista que trabaja directo, sin comisión.
- **Sin features nuevas sin datos de uso.** Analytics primero.
- **Redesign desde Figma** — no parchear el CSS actual.
- **Modelo de negocio:** a definir después de 4 semanas de datos reales.

---

## Pendiente

### Iteración directa en código (sesión 2026-07-08 — commiteada en `1cd1245`)
- [x] Verificar en navegador los cambios del día (O/D card 2 columnas, fuente, truck-summary)
- [x] Resolver duplicación `.summary-card` + `.summary-bar` (recortadas filas duplicadas de la card)
- [x] Confirmar que la barra de progreso de ocupación se ve bien tras los cambios
- [x] Revisar ancho de Peajes/Tarifa/Bencina/Distancia/Capacidad/Rendimiento con montos grandes — autosize + límite de dígitos por campo
- [ ] Decidir si se sigue iterando así o se retoma el plan Figma
- [ ] Aplicar formato de miles con punto también a Distancia/Capacidad si se vuelve necesario (hoy solo quedan como número simple, sin dots — no lo pidieron)

### Redesign en Figma (STAND BY desde 2026-06-25 — en tensión con la iteración de código de hoy)
- [ ] Variables nativas en Figma (11 colores · modos Light/Dark)
- [ ] Componentes base en Figma con variables
- [ ] Pantallas completas en Figma
- [ ] MVP v3.0: traducir diseño Figma a código limpio
- [ ] Instalar analytics (medir uso de Compartir, retención)
### Siguiente paso exacto al retomar

**Rebrand — decisión de nombre:**
Verificar disponibilidad de los 3 candidatos (.cl, Google Play, App Store, INAPI Chile):
1. **Rumbo** ⭐ (recomendado)
2. **Trazo**
3. **Porte**

**Design system (`carga-design-system.html`):**
- Renombrar de "Carga" al nombre final una vez decidido
- Corregir contraste dark mode: `--c-text-muted: #475569` sobre `#0F172A` ≈ 2.3:1 ❌ → subir a mínimo `#64748B` (~4.6:1)

**Break operativo:** todos los 9 frames completos. Sin pendientes.

**Redesign:** Abrir Figma → Local Variables → crear colección `Color System` con modos `Light` y `Dark` → ingresar las 11 variables manualmente (sin Tokens Studio). Ver tabla en `design-log.html` Paso 02.

---

## Historial

| Fecha | Hecho |
|---|---|
| Pre-sesión | SPA funcional, dark mode, historial, 8 categorías |
| 2026-06-03 | v2.0: rediseño neumorfismo completo, O/D card, icons SVG |
| 2026-06-03 | v2.0 fix: nav, summary-bar, dark mode contraste |
| 2026-06-03 | v2.0 fix #2: labels, icons, distancias auto desde Santiago |
| 2026-06-03 | v2.0 fix #3: viajes múltiples, artículo personalizado, historial |
| 2026-06-03 | iOS hardening: viewport-fit, safe-area, inputs 16px, SW paths |
| 2026-06-03 | Share enriquecido: ocupación visible, "Cotización" |
| 2026-06-25 | Validación 3+ usuarios. Decisión: redesign desde Figma |
| 2026-06-25 | design-log.html creado. 438 errores Figma. Tokens v3 definidos |
| 2026-06-25 | STAND BY — solicitud comercial prioritaria |
| 2026-06-26 | Análisis iziPro. Break operativo 9 frames. User Journey Frame 04 |
| 2026-07-08 | A/B testing visual (5 secciones, ganó B). Hallazgo de redundancia de datos. Decisión de IA: sin hub, Perfil como única fuente de config. Cotizar: O/D fusionada con Distancia/Peajes. Fuente → Plus Jakarta Sans. |
| 2026-07-08 | Ronda de fixes verificados en navegador: simetría O/D card, sin botón share redundante, resumen sin duplicados, Perfil con botón Volver + toast de confirmación, formato CLP, bug de cálculo con puntos de miles corregido, límite de dígitos por campo. Commit `1cd1245`. Pusheado con bump SW v3→v4 (`34f4774`). |
| 2026-07-08 | Ronda de validación en iPhone real: 3 bugs que solo aparecían en Safari/PWA (autosize con `size` HTML → `ch` CSS, halo neumórfico → `--sl:var(--bg)`, avatar sin conectar → Perfil) y el bug de "arrastrar toda la app" (`-webkit-touch-callout`/`user-select`). Commits `4198a2e`, `e043678`. SW v4→v5→v6. Sesión cerrada. |
| 2026-07-09 | Break operativo v0.2: columna de alianzas potenciales (supuestos a validar) en Frame 07, para reunión con PM socia. Anexo `break-operativo-resumen.html` creado — pitch deck simplificado para videollamada, iterado a par "El gap → La oportunidad" tras feedback de claridad. Revisado bajo skills comerciales/de presentación. Commit `d59ae3b`, pusheado. |
