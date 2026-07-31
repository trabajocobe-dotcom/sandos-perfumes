import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const RESET = '\x1b[0m', B = '\x1b[1m', D = '\x1b[2m';
const C = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', b: '\x1b[34m', c: '\x1b[36m' };
const s = (t, c) => `${C[c]||''}${t}${RESET}`;
const bold = t => `${B}${t}${RESET}`;
const dim = t => `${D}${t}${RESET}`;
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50); }

const PROMPT = process.argv.slice(2).join(' ') || 'Ultra-realistic 8K product photography: a luxury dark blue perfume bottle with translucent blue liquid, partially covered in golden beach sand, resting on sand dunes at sunset, ocean waves and sea in background, warm golden sunset light, orange and pink sky, shallow depth of field, bokeh, cinematic quality, premium luxury advertisement photography';
const DESKTOP = path.join(os.homedir(), 'Desktop');
const OUT_DIR = path.join(DESKTOP, slugify(PROMPT.split(':')[0] || PROMPT).substring(0, 40));

console.log(`  ${s('✦', 'c')} ${bold('BING IMAGE GENERATOR')} ${s('✦', 'c')}\n`);
console.log(`  ${bold('Prompt:')} ${s(`"${PROMPT}"`, 'y')}\n`);

console.log(`  ${s('◆', 'b')} ${bold('Conectando a Chrome existente...')}`);
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
const pages = await browser.pages();
let page = pages.find(p => p.url().includes('bing.com'));
if (!page) { page = pages[0]; await page.goto('https://www.bing.com/images/create/ai-image-generator', { waitUntil: 'networkidle2', timeout: 60000 }); }
console.log(`  ${s('✓', 'g')} Conectado (${pages.length} páginas)\n`);

console.log(`  ${s('◆', 'b')} ${bold('Escribiendo prompt...')}`);
await sleep(3000);

// Try textarea.gmc__textarea
let ta = await page.$('textarea.gmc__textarea');
if (!ta) {
  // Fallback: try any textarea with placeholder about describing image
  ta = await page.$('textarea[placeholder*="Describe"]');
}
if (!ta) {
  // Fallback: any textarea
  ta = await page.$('textarea');
}

if (ta) {
  await ta.evaluate(el => el.value = '');
  await ta.type(PROMPT, { delay: 6 });
  await sleep(500);
  console.log(`  ${s('•', 'b')} Prompt escrito (${PROMPT.length} chars)`);

  // Click Generate button
  const genBtn = await page.$('button.gmbtn__btn');
  if (genBtn) {
    await genBtn.click();
    console.log(`  ${s('•', 'b')} Click en Generar`);
  } else {
    await page.keyboard.press('Enter');
    console.log(`  ${s('•', 'b')} Enter presionado`);
  }
} else {
  console.log(`  ${s('✗', 'r')} No se encontró textarea`);
  await browser.disconnect();
  process.exit(1);
}

await sleep(5000);
console.log(`  ${s('•', 'b')} URL: ${page.url()}`);

// Wait for generated images
console.log(`\n  ${s('◆', 'b')} ${bold('Esperando imágenes (3 min)...')}`);
const start = Date.now();
let lastCount = 0;

while (Date.now() - start < 210000) {
  await sleep(3000);
  const elapsed = Math.round((Date.now() - start) / 1000);
  try {
    const res = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.aigc-batch__item:not(.aigc-batch__item--placeholder)'));
      const imgsInItems = items.map(el => el.querySelector('img')).filter(Boolean);
      return {
        hasBoost: document.body.innerText.toLowerCase().includes('boost') || document.body.innerText.toLowerCase().includes('generating'),
        count: imgsInItems.length,
        imgs: imgsInItems.slice(0,4).map(img => ({ src: img.src, w: img.naturalWidth, h: img.naturalHeight }))
      };
    });

    if (res.hasBoost) {
      process.stdout.write(`\r  ${s('◉', 'g')} ${bold('Generando...')} ${dim(`${elapsed}s`)}  `);
    } else if (res.count > lastCount) {
      lastCount = res.count;
      process.stdout.write(`\r  ${s('◉', 'g')} ${bold(`${res.count} imágenes`)} ${dim(`${elapsed}s`)}  `);
    }
    if (lastCount >= 1 && elapsed > 60) { await sleep(5000); break; }
    if (lastCount >= 4 && elapsed > 20) { await sleep(5000); break; }
    if (elapsed > 175) break;
  } catch {}
}
console.log('');

const finalText = await page.evaluate(() => document.body.innerText.substring(0, 600));
console.log(`\n  ${s('•', 'b')} Texto: "${finalText.replace(/\n/g, ' | ').substring(0, 400)}"`);

// Download images
console.log(`\n  ${s('◆', 'b')} ${bold('Capturando imágenes...')}`);
mkdirSync(OUT_DIR, { recursive: true });

const imgInfos = await page.evaluate(() => {
  const items = Array.from(document.querySelectorAll('.aigc-batch__item:not(.aigc-batch__item--placeholder)'));
  return items.map((el, i) => {
    const img = el.querySelector('img');
    if (!img) return null;
    return { idx: i, src: img.src, w: img.naturalWidth, h: img.naturalHeight };
  }).filter(Boolean);
});

let saved = 0;
for (const info of imgInfos) {
  try {
    if (saved >= 8) break;
    if (!info.src || info.src.startsWith('data:')) continue;
    const resp = await fetch(info.src, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!resp.ok) continue;
    const buf = Buffer.from(await resp.arrayBuffer());
    const ext = info.src.includes('.webp') ? 'webp' : 'png';
    const fp = path.join(OUT_DIR, `perfume_${saved + 1}.${ext}`);
    await writeFile(fp, buf);
    console.log(`  ${s('✓', 'g')} perfume_${saved + 1}.${ext} (${info.w}x${info.h})`);
    saved++;
  } catch (e) {
    console.log(`  ${s('✗', 'r')} Error: ${e.message}`);
  }
}

await page.screenshot({ path: path.join(OUT_DIR, 'pagina.png'), fullPage: true });

console.log(`\n  ${s('─'.repeat(44), 'c')}`);
console.log(`  ${saved > 0 ? s('✓', 'g') : s('⚠', 'y')} ${saved} imágenes → ${s(OUT_DIR, 'c')}`);
console.log(`  ${s('✦', 'c')} ${bold('Listo')} ${s('✦', 'c')}\n`);
await browser.disconnect();
