// FleteApp — Catálogo de artículos
// Volúmenes orientativos en m³. Deben validarse con transportistas reales antes de usar en cotizaciones formales.

const CATALOG = [
  // Dormitorio
  { id:  1, name: 'Cama 1 plaza',       vol: 0.55, icon: '🛏️', cat: 'dormitorio' },
  { id:  2, name: 'Cama 2 plazas',      vol: 1.10, icon: '🛏️', cat: 'dormitorio' },
  { id:  3, name: 'Cama king',          vol: 1.62, icon: '🛏️', cat: 'dormitorio' },
  { id:  4, name: 'Armario 2 puertas',  vol: 1.80, icon: '🚪', cat: 'dormitorio' },
  { id:  5, name: 'Cómoda',             vol: 0.54, icon: '🗄️', cat: 'dormitorio' },
  { id:  6, name: 'Velador',            vol: 0.12, icon: '🪑', cat: 'dormitorio' },

  // Living
  { id:  7, name: 'Sofá 2 cuerpos',     vol: 0.96, icon: '🛋️', cat: 'living' },
  { id:  8, name: 'Sofá 3 cuerpos',     vol: 1.44, icon: '🛋️', cat: 'living' },
  { id:  9, name: 'Sillón',             vol: 0.48, icon: '🪑', cat: 'living' },
  { id: 10, name: 'Mesa comedor',        vol: 0.72, icon: '🍽️', cat: 'living' },
  { id: 11, name: 'Silla comedor',       vol: 0.12, icon: '🪑', cat: 'living' },
  { id: 12, name: 'Rack TV',            vol: 0.30, icon: '📺', cat: 'living' },

  // Cocina
  { id: 13, name: 'Refrigerador',       vol: 0.76, icon: '🧊', cat: 'cocina' },
  { id: 14, name: 'Lavadora',           vol: 0.42, icon: '🫧', cat: 'cocina' },
  { id: 15, name: 'Lavavajillas',       vol: 0.38, icon: '🍳', cat: 'cocina' },
  { id: 16, name: 'Microondas',         vol: 0.08, icon: '📦', cat: 'cocina' },

  // Otros
  { id: 17, name: 'Escritorio',         vol: 0.48, icon: '🪞', cat: 'otros' },
  { id: 18, name: 'Bicicleta',          vol: 0.60, icon: '🚲', cat: 'otros' },
  { id: 19, name: 'Caja mediana',       vol: 0.09, icon: '📦', cat: 'otros' },
  { id: 20, name: 'Caja grande',        vol: 0.19, icon: '📦', cat: 'otros' },
];
