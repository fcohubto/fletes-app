// Genera icon-192.png e icon-512.png para FleteApp PWA
// Ejecutar: node generate-icons.js
// Sin dependencias externas — usa solo módulos built-in de Node.js

const zlib = require('zlib');
const fs   = require('fs');

const BG = [0x0f, 0x0f, 0x0f, 0xff]; // #0f0f0f
const FG = [0xf2, 0x64, 0x19, 0xff]; // #f26419

function createIconPNG(size) {
  const px = new Uint8Array(size * size * 4);

  // Fondo oscuro
  for (let i = 0; i < size * size; i++) {
    px[i * 4]     = BG[0];
    px[i * 4 + 1] = BG[1];
    px[i * 4 + 2] = BG[2];
    px[i * 4 + 3] = BG[3];
  }

  // Dimensiones de la letra F escaladas al tamaño del ícono
  const sw  = Math.round(size * 0.13);  // ancho del trazo
  const lx  = Math.round(size * 0.23);  // margen izquierdo
  const ty  = Math.round(size * 0.18);  // margen superior
  const lh  = Math.round(size * 0.63);  // alto total de la letra
  const tw  = Math.round(size * 0.50);  // ancho barra superior
  const mw  = Math.round(size * 0.38);  // ancho barra media
  const my  = Math.round(size * 0.42);  // posición Y barra media (relativo a ty)

  function fillRect(x, y, w, h) {
    for (let row = y; row < Math.min(y + h, size); row++) {
      for (let col = x; col < Math.min(x + w, size); col++) {
        const i = (row * size + col) * 4;
        px[i]     = FG[0];
        px[i + 1] = FG[1];
        px[i + 2] = FG[2];
        px[i + 3] = FG[3];
      }
    }
  }

  fillRect(lx, ty,      sw, lh); // trazo vertical
  fillRect(lx, ty,      tw, sw); // barra superior
  fillRect(lx, ty + my, mw, sw); // barra media

  // Construir datos PNG filtrados (filter type 0 = None por fila)
  const rowBytes = size * 4;
  const raw = new Uint8Array((rowBytes + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (rowBytes + 1)] = 0;
    raw.set(px.subarray(y * rowBytes, (y + 1) * rowBytes), y * (rowBytes + 1) + 1);
  }

  const compressed = zlib.deflateSync(Buffer.from(raw));

  // Helpers PNG
  const u32 = n => Buffer.from([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);

  function crc32(buf) {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c;
    }
    let crc = 0xffffffff;
    for (const b of buf) crc = t[(crc ^ b) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const tb = Buffer.from(type, 'ascii');
    const db = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const crcBuf = Buffer.concat([tb, db]);
    return Buffer.concat([u32(db.length), tb, db, u32(crc32(crcBuf))]);
  }

  const ihdr = Buffer.concat([u32(size), u32(size), Buffer.from([8, 6, 0, 0, 0])]);

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.mkdirSync('icons', { recursive: true });
fs.writeFileSync('icons/icon-192.png', createIconPNG(192));
fs.writeFileSync('icons/icon-512.png', createIconPNG(512));
console.log('✓ icons/icon-192.png');
console.log('✓ icons/icon-512.png');
