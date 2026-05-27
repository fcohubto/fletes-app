// FleteApp — Catálogo de artículos
// Volúmenes orientativos en m³. Deben validarse con transportistas reales antes de usar en cotizaciones formales.

const CATALOG = [
  // Dormitorio
  { id:  1, name: 'Cama 1 plaza',            vol: 0.55, icon: '🛏️', cat: 'dormitorio' },
  { id:  2, name: 'Cama 2 plazas',           vol: 1.10, icon: '🛏️', cat: 'dormitorio' },
  { id:  3, name: 'Cama king',               vol: 1.62, icon: '🛏️', cat: 'dormitorio' },
  { id:  4, name: 'Armario 2 puertas',       vol: 1.20, icon: '🚪', cat: 'dormitorio' },
  { id:  5, name: 'Armario 3 puertas',       vol: 1.80, icon: '🚪', cat: 'dormitorio' },
  { id:  6, name: 'Armario 4 puertas',       vol: 2.40, icon: '🚪', cat: 'dormitorio' },
  { id:  7, name: 'Cómoda',                  vol: 0.54, icon: '🗄️', cat: 'dormitorio' },
  { id:  8, name: 'Velador',                 vol: 0.12, icon: '🪑', cat: 'dormitorio' },
  { id:  9, name: 'Cajonera',               vol: 0.30, icon: '🗄️', cat: 'dormitorio' },
  { id: 10, name: 'Litera',                  vol: 1.40, icon: '🛏️', cat: 'dormitorio' },
  { id: 11, name: 'Cuna',                    vol: 0.50, icon: '🛏️', cat: 'dormitorio' },
  { id: 12, name: 'Tocador',                 vol: 0.60, icon: '🪞', cat: 'dormitorio' },
  { id: 13, name: 'Espejo cuerpo entero',    vol: 0.08, icon: '🪞', cat: 'dormitorio' },

  // Living
  { id: 14, name: 'Sofá 2 cuerpos',          vol: 0.96, icon: '🛋️', cat: 'living' },
  { id: 15, name: 'Sofá 3 cuerpos',          vol: 1.44, icon: '🛋️', cat: 'living' },
  { id: 16, name: 'Sofá esquina',            vol: 2.20, icon: '🛋️', cat: 'living' },
  { id: 17, name: 'Sillón',                  vol: 0.48, icon: '🪑', cat: 'living' },
  { id: 18, name: 'Mesa comedor 4 personas', vol: 0.72, icon: '🍽️', cat: 'living' },
  { id: 19, name: 'Mesa comedor 6 personas', vol: 1.10, icon: '🍽️', cat: 'living' },
  { id: 20, name: 'Silla comedor',           vol: 0.12, icon: '🪑', cat: 'living' },
  { id: 21, name: 'Rack TV',                 vol: 0.30, icon: '📺', cat: 'living' },
  { id: 22, name: 'Vitrina',                 vol: 0.80, icon: '🪟', cat: 'living' },
  { id: 23, name: 'Estantería',              vol: 0.60, icon: '📚', cat: 'living' },
  { id: 24, name: 'Aparador',                vol: 0.90, icon: '🗄️', cat: 'living' },
  { id: 25, name: 'Lámpara de pie',          vol: 0.10, icon: '💡', cat: 'living' },
  { id: 26, name: 'TV (50"+)',               vol: 0.15, icon: '📺', cat: 'living' },

  // Cocina
  { id: 27, name: 'Refrigerador',            vol: 0.76, icon: '🧊', cat: 'cocina' },
  { id: 28, name: 'Congelador',              vol: 0.50, icon: '🧊', cat: 'cocina' },
  { id: 29, name: 'Lavaplatos',              vol: 0.38, icon: '🍳', cat: 'cocina' },
  { id: 30, name: 'Microondas',              vol: 0.08, icon: '📦', cat: 'cocina' },
  { id: 31, name: 'Horno eléctrico',         vol: 0.18, icon: '🔲', cat: 'cocina' },
  { id: 32, name: 'Vitrocerámica',           vol: 0.06, icon: '🔲', cat: 'cocina' },
  { id: 33, name: 'Mesa de cocina',          vol: 0.48, icon: '🍽️', cat: 'cocina' },
  { id: 34, name: 'Taburete',                vol: 0.08, icon: '🪑', cat: 'cocina' },

  // Lavadero
  { id: 35, name: 'Lavadora',                vol: 0.42, icon: '🫧', cat: 'lavadero' },
  { id: 36, name: 'Secadora',                vol: 0.42, icon: '🫧', cat: 'lavadero' },
  { id: 37, name: 'Aspiradora',              vol: 0.12, icon: '🧹', cat: 'lavadero' },
  { id: 38, name: 'Tabla de planchar',       vol: 0.06, icon: '👕', cat: 'lavadero' },

  // Terraza/Jardín
  { id: 39, name: 'Mesa de jardín',          vol: 0.60, icon: '🌿', cat: 'terraza' },
  { id: 40, name: 'Silla de jardín',         vol: 0.10, icon: '🪑', cat: 'terraza' },
  { id: 41, name: 'Silla plegable',          vol: 0.05, icon: '🪑', cat: 'terraza' },
  { id: 42, name: 'Tumbona',                 vol: 0.30, icon: '🏖️', cat: 'terraza' },
  { id: 43, name: 'Barbacoa',                vol: 0.20, icon: '🔥', cat: 'terraza' },
  { id: 44, name: 'Bicicleta',               vol: 0.60, icon: '🚲', cat: 'terraza' },
  { id: 45, name: 'Cortacésped',             vol: 0.40, icon: '🌱', cat: 'terraza' },

  // Despacho
  { id: 46, name: 'Escritorio',              vol: 0.48, icon: '🖥️', cat: 'despacho' },
  { id: 47, name: 'Silla de oficina',        vol: 0.30, icon: '🪑', cat: 'despacho' },
  { id: 48, name: 'Cajonera',               vol: 0.20, icon: '🗄️', cat: 'despacho' },
  { id: 49, name: 'Impresora',               vol: 0.10, icon: '🖨️', cat: 'despacho' },
  { id: 50, name: 'Computador de escritorio',vol: 0.08, icon: '🖥️', cat: 'despacho' },

  // Cajas y otros
  { id: 51, name: 'Caja pequeña',            vol: 0.04, icon: '📦', cat: 'cajas' },
  { id: 52, name: 'Caja mediana',            vol: 0.09, icon: '📦', cat: 'cajas' },
  { id: 53, name: 'Caja grande',             vol: 0.19, icon: '📦', cat: 'cajas' },
  { id: 54, name: 'Maleta pequeña',          vol: 0.06, icon: '🧳', cat: 'cajas' },
  { id: 55, name: 'Maleta grande',           vol: 0.15, icon: '🧳', cat: 'cajas' },
  { id: 56, name: 'Aire acondicionado',      vol: 0.25, icon: '❄️', cat: 'cajas' },
  { id: 57, name: 'Ventilador',              vol: 0.10, icon: '💨', cat: 'cajas' },
];
