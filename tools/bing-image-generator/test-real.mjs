import puppeteer from 'puppeteer-core';
import { detectChromePath } from './src/utils.js';

const chromePath = detectChromePath();
const realUd = process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data';

console.log('Chrome:', chromePath);
console.log('Profile:', realUd);

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: false,
  userDataDir: realUd,
  args: ['--profile-directory=Default', '--no-first-run', '--no-default-browser-check']
});

const page = await browser.newPage();
await page.goto('https://www.bing.com/images/create', { waitUntil: 'networkidle2', timeout: 30000 });
console.log('URL:', page.url());
const title = await page.title();
console.log('Title:', title);
const hasLogin = page.url().includes('login');
console.log('Needs login:', hasLogin);
if (!hasLogin) {
  const sel = '#gi_form_q';
  const ta = await page.$(sel);
  console.log('Has textarea:', !!ta);
}
await browser.close();
process.exit(0);
