// Usage: node build.js [screenshot_dir]
// Inlines map.svg into portfolio.src.html -> portfolio.html, then prints the A4 PDF.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const d = __dirname;
  const html = fs.readFileSync(path.join(d, 'portfolio.src.html'), 'utf8')
    .replace('{{MAP}}', fs.readFileSync(path.join(d, 'map.svg'), 'utf8'));
  fs.writeFileSync(path.join(d, 'portfolio.html'), html);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  await page.goto('file://' + path.join(d, 'portfolio.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(d, 'Felipe_Diniz_Paiva_Portfolio_Raquettes_FR.pdf'),
    format: 'A4', printBackground: true, preferCSSPageSize: true,
  });

  const shots = process.argv[2];
  if (shots) {
    await page.emulateMedia({ media: 'print' });
    const pages = await page.$$('.page');
    for (let i = 0; i < pages.length; i++) {
      await pages[i].screenshot({ path: path.join(shots, `p${i + 1}.png`) });
    }
    console.log(await page.evaluate(() =>
      [...document.querySelectorAll('.page')].map(p => p.scrollHeight + '/' + p.clientHeight)));
  }
  await browser.close();
})();
