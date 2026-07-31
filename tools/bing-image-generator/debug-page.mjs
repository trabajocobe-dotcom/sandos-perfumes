import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

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

const chromePath = detectChrome();
const profileDir = path.resolve('chrome-session/real-profile');
if (!existsSync(profileDir)) mkdirSync(profileDir, { recursive: true });

try { execSync('taskkill /f /im chrome.exe', { stdio: 'pipe' }); } catch {}
await sleep(3000);

const browser = await puppeteer.launch({
  executablePath: chromePath, headless: false,
  userDataDir: profileDir,
  args: ['--no-first-run', '--no-default-browser-check', '--disable-sync'],
});
const page = await browser.newPage();

// Navigate and wait
await page.goto('https://www.bing.com/images/create', { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(3000);

console.log('URL final:', page.url());

// Take screenshot
await page.screenshot({ path: 'debug_bing_page.png', fullPage: false });

// Get page info
const info = await page.evaluate(() => {
  const ta = document.querySelector('#gi_form_q');
  const btn = document.querySelector('#create_btn_c');
  const allBtns = document.querySelectorAll('button');
  const allInputs = document.querySelectorAll('input, textarea');
  return {
    url: location.href,
    title: document.title,
    hasTextarea: !!ta,
    textareaPlaceholder: ta ? (ta.placeholder || '') : '',
    hasCreateBtn: !!btn,
    allButtons: Array.from(allBtns).map(b => ({
      id: b.id,
      text: (b.textContent || '').substring(0, 50),
      type: b.type,
      classes: b.className.substring(0, 100),
    })),
    allInputs: Array.from(allInputs).map(i => ({
      id: i.id,
      type: i.type,
      placeholder: (i.placeholder || '').substring(0, 50),
      classes: i.className.substring(0, 100),
    })),
    bodyText: document.body.innerText.substring(0, 500),
  };
});

console.log('\n=== PAGE INFO ===');
console.log(JSON.stringify(info, null, 2));

await page.screenshot({ path: 'debug_bing_full.png', fullPage: true });
console.log('\nScreenshots saved: debug_bing_page.png, debug_bing_full.png');

await browser.close();
try { execSync('taskkill /f /im chrome.exe', { stdio: 'pipe' }); } catch {}
