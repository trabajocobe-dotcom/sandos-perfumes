import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { execSync, spawn } from 'node:child_process';
import path from 'node:path';

const RESET = '\x1b[0m', B = '\x1b[1m', D = '\x1b[2m';
const C = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', b: '\x1b[34m', c: '\x1b[36m' };
const s = (t, c) => `${C[c]||''}${t}${RESET}`;
const bold = t => `${B}${t}${RESET}`;
const dim = t => `${D}${t}${RESET}`;
const logo = () => console.log(`  ${s('✦', 'c')} ${bold('BING IMAGE GENERATOR')} ${s('✦', 'c')}\n`);

function detectChrome() {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ];
  for (const p of paths) { try { if (existsSync(p)) return p; } catch {} }
  return null;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const PROMPT = process.argv.slice(2).join(' ') || 'Ultra-realistic 8K product photography: a luxury dark blue perfume bottle with translucent blue liquid, partially covered in golden beach sand, resting on sand dunes at sunset, ocean waves and sea in background, warm golden sunset light, orange and pink sky, shallow depth of field, bokeh, cinematic quality, premium luxury advertisement photography';

async function main() {
  logo();
  console.log(`  ${bold('Prompt:')} ${s(`"${PROMPT}"`, 'y')}\n`);

  const chromePath = detectChrome();
  if (!chromePath) { console.log(`  ${s('✗', 'r')} Chrome no encontrado`); process.exit(1); }

  const profileDir = path.resolve('chrome-session/real-profile');
  if (!existsSync(profileDir)) mkdirSync(profileDir, { recursive: true });

  // Kill any existing Chrome
  try { execSync('taskkill /f /im chrome.exe', { stdio: 'pipe' }); } catch {}
  await sleep(3000);

  console.log(`  ${s('◆', 'b')} ${bold('Iniciando Chrome con depuración...')}`);
  const chromeArgs = [
    `--remote-debugging-port=9222`,
    `--user-data-dir=${profileDir}`,
    `--no-first-run`,
    `--no-default-browser-check`,
    `--disable-sync`,
    `--no-restore-session`,
    `https://www.bing.com/images/create/ai-image-generator`
  ];
  const proc = spawn(chromePath, chromeArgs, { detached: true, stdio: 'ignore' });
  proc.unref();

  console.log(`  ${s('◆', 'b')} ${bold('Conectando puppeteer...')}`);
  let browser;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
      if (browser) break;
    } catch { await sleep(1000); }
  }
  if (!browser) { console.log(`  ${s('✗', 'r')} No se pudo conectar a Chrome`); process.exit(1); }

  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();
  console.log(`  ${s('✓', 'g')} Chrome conectado (${pages.length} pestañas)\n`);

  console.log(`  ${s('◆', 'b')} ${bold('Navegando a Bing Image Creator...')}`);
  await page.goto('https://www.bing.com/images/create', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(4000);
  console.log(`  ${s('•', 'b')} URL: ${page.url()}`);

  // Check and wait for login if needed
  async function waitForLogin() {
    if (!page.url().includes('login')) return false;
    console.log(`\n  ${s('⚠', 'y')} ${bold('═' .repeat(50))}`);
    console.log(`  ${s('⚠', 'y')} ${bold('INICIA SESIÓN EN LA VENTANA DE CHROME')}`);
    console.log(`  ${s('⚠', 'y')} ${bold('Ve a la ventana de Chrome que se abrió')}`);
    console.log(`  ${s('⚠', 'y')} ${bold('e inicia sesión con tu cuenta Microsoft.')}`);
    console.log(`  ${s('⚠', 'y')} ${bold('═' .repeat(50))}\n`);
    for (let i = 0; i < 120; i++) {
      await sleep(2000);
      try {
        if (!page.url().includes('login') && !page.url().includes('account') && !page.url().includes('microsoft')) {
          console.log(`  ${s('✓', 'g')} Sesión iniciada`);
          await sleep(3000);
          return true;
        }
      } catch {}
      if (i % 3 === 0) process.stdout.write(`\r  ${dim(`Esperando login... ${i * 2}s / 240s`)}`);
    }
    return false;
  }

  const wasLogin = await waitForLogin();
  const pageText = await page.evaluate(() => document.body.innerText.substring(0, 500));

  if (pageText.includes('inicia sesión') || pageText.includes('Inicia sesión') || pageText.includes('necesitas iniciar sesión')) {
    console.log(`  ${s('⚠', 'y')} Bing pide login en la página también`);
    if (!wasLogin) {
      console.log(`  ${s('⚠', 'y')} Refrescando página después de login...`);
      await page.goto('https://www.bing.com/images/create', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(3000);
      console.log(`  ${s('•', 'b')} URL: ${page.url()}`);
      if (page.url().includes('login')) await waitForLogin();
    }
  }

  console.log(`\n  ${s('◆', 'b')} ${bold('Escribiendo prompt en nueva UI...')}`);
  const ta = await page.$('textarea.gmc__textarea');
  if (ta) {
    await ta.evaluate(el => el.value = '');
    await ta.type(PROMPT, { delay: 8 });
    await sleep(500);
    console.log(`  ${s('•', 'b')} Prompt escrito (${(PROMPT.length)} chars)`);

    const genBtn = await page.$('button.gmbtn__btn');
    if (genBtn) {
      await genBtn.click();
      console.log(`  ${s('•', 'b')} Click en Generar`);
    } else {
      console.log(`  ${s('•', 'y')} Botón Generar no encontrado, intentando Enter...`);
      await page.keyboard.press('Enter');
    }
    await sleep(5000);
    console.log(`  ${s('•', 'b')} URL: ${page.url()}`);
  } else {
    console.log(`  ${s('✗', 'r')} No hay textarea.gmc__textarea`);
  }

  console.log(`\n  ${s('◆', 'b')} ${bold('Esperando imágenes generadas (3 min)...')}`);
  const start = Date.now();
  let lastCount = 0;

  while (Date.now() - start < 210000) {
    await sleep(3000);
    const elapsed = Math.round((Date.now() - start) / 1000);
    try {
      const res = await page.evaluate(() => {
        // Buscar items del batch (imágenes generadas)
        const items = Array.from(document.querySelectorAll('.aigc-batch__item:not(.aigc-batch__item--placeholder)'));
        const imgsInItems = items.map(el => el.querySelector('img')).filter(Boolean);
        return {
          hasBoost: document.body.innerText.includes('boost') || document.body.innerText.includes('Boost'),
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
      if (elapsed > 175) break;
    } catch {}
  }
  console.log('');

  const finalText = await page.evaluate(() => document.body.innerText.substring(0, 600));
  console.log(`\n  ${s('•', 'b')} Texto: "${finalText.replace(/\n/g, ' | ').substring(0, 400)}"`);

  console.log(`\n  ${s('◆', 'b')} ${bold('Capturando imágenes...')}`);
  const outDir = `output/bing_${Date.now()}`;
  mkdirSync(outDir, { recursive: true });

  // Extraer imágenes de los batch items y descargarlas
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
      const fp = path.join(outDir, `perfume_${saved + 1}.${ext}`);
      await writeFile(fp, buf);
      console.log(`  ${s('✓', 'g')} perfume_${saved + 1}.${ext} (${info.w}x${info.h})`);
      saved++;
    } catch (e) {
      console.log(`  ${s('✗', 'r')} Error: ${e.message}`);
    }
  }

  await page.screenshot({ path: path.join(outDir, 'pagina.png'), fullPage: true });

  console.log(`\n  ${s('─'.repeat(44), 'c')}`);
  console.log(`  ${saved > 0 ? s('✓', 'g') : s('⚠', 'y')} ${saved} imágenes → ${s(outDir, 'c')}`);
  console.log(`  ${s('✦', 'c')} ${bold('Listo')} ${s('✦', 'c')}\n`);
  await browser.close();
}

main().catch(e => { console.log(`  ${s('✗', 'r')} Error: ${e.message}`); process.exit(1); });
