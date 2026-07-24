const fs = require('fs');
const path = require('path');

// We will create a 64x64 RGBA pixel grid for the NK monogram icon
const width = 64;
const height = 64;

// Simple PNG encoder in pure JavaScript without external dependencies!
const zlib = require('zlib');

function createPNG(w, h, getPixel) {
  // getPixel(x, y) returns [r, g, b, a]
  const rowSize = w * 4 + 1;
  const rawData = Buffer.alloc(h * rowSize);

  for (let y = 0; y < h; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.slice(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// CRC32 table & function
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Draw NK logo on 64x64 grid
function drawNK(x, y) {
  // Rounded square background
  const rx = Math.abs(x - 31.5);
  const ry = Math.abs(y - 31.5);
  
  // Background circle/rounded rect
  const distSq = rx * rx + ry * ry;
  if (rx > 30 || ry > 30) return [0, 0, 0, 0]; // Transparent padding

  // Border ring
  if (rx > 28 || ry > 28) return [255, 255, 255, 100];

  // Dark background
  let isLetter = false;

  // Letter N: x: 12..28, y: 16..48
  // N left bar: x 12..16, y 16..48
  if (x >= 12 && x <= 16 && y >= 16 && y <= 48) isLetter = true;
  // N right bar: x 24..28, y 16..48
  if (x >= 24 && x <= 28 && y >= 16 && y <= 48) isLetter = true;
  // N diagonal: from (14, 16) to (26, 48)
  const diagN = (x - 14) * 32 / 12 + 16;
  if (x >= 14 && x <= 26 && y >= diagN - 2 && y <= diagN + 2) isLetter = true;

  // Letter K: x: 34..50, y: 16..48
  // K left bar: x 34..38, y 16..48
  if (x >= 34 && x <= 38 && y >= 16 && y <= 48) isLetter = true;
  // K top diagonal: from (36, 32) to (48, 16)
  const diagK1 = 32 - (x - 36) * 16 / 12;
  if (x >= 36 && x <= 48 && y >= diagK1 - 2 && y <= diagK1 + 2) isLetter = true;
  // K bottom diagonal: from (36, 32) to (48, 48)
  const diagK2 = 32 + (x - 36) * 16 / 12;
  if (x >= 36 && x <= 48 && y >= diagK2 - 2 && y <= diagK2 + 2) isLetter = true;

  if (isLetter) {
    // Silver gradient tint based on y
    const shade = Math.floor(255 - (y / 64) * 50);
    return [shade, shade, shade, 255];
  }

  // Black background inside icon
  return [10, 10, 12, 255];
}

const pngBuffer = createPNG(width, height, drawNK);

// Create ICO container embedding the PNG buffer
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // Reserved
icoHeader.writeUInt16LE(1, 2); // ICO type
icoHeader.writeUInt16LE(1, 4); // 1 image

const icoDirectory = Buffer.alloc(16);
icoDirectory.writeUInt8(width, 0);  // Width
icoDirectory.writeUInt8(height, 1); // Height
icoDirectory.writeUInt8(0, 2);      // Color palette
icoDirectory.writeUInt8(0, 3);      // Reserved
icoDirectory.writeUInt16LE(1, 4);   // Color planes
icoDirectory.writeUInt16LE(32, 6);  // Bits per pixel
icoDirectory.writeUInt32LE(pngBuffer.length, 8); // Size
icoDirectory.writeUInt32LE(22, 12); // Offset (6 + 16)

const icoBuffer = Buffer.concat([icoHeader, icoDirectory, pngBuffer]);

// Save to public/favicon.ico and public/favicon.png
const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), pngBuffer);
console.log('Successfully generated NK favicon.ico and favicon.png!');
