import { existsSync, globSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { basePath, siteName, siteUrl } from '../site.config.mjs';

const projectRoot = resolve(import.meta.dirname, '..');
const outputRoot = join(projectRoot, 'dist');

const requiredFiles = [
  'index.html',
  '404.html',
  'blog/index.html',
  'autori/index.html',
  'autori/giordano-sognatore/index.html',
  'community/index.html',
  'risorse/index.html',
  'rss.xml',
  'sitemap-index.xml',
  'robots.txt',
  'favicon.svg',
];

const errors = [];

for (const file of requiredFiles) {
  const path = join(outputRoot, file);
  if (!existsSync(path) || statSync(path).size === 0) {
    errors.push(`Output obbligatorio mancante o vuoto: ${file}`);
  }
}

const readOutput = (file) =>
  existsSync(join(outputRoot, file)) ? readFileSync(join(outputRoot, file), 'utf8') : '';

const rss = readOutput('rss.xml');
if (!rss.includes(`<title>${siteName}</title>`) || !rss.includes(`<link>${siteUrl}</link>`)) {
  errors.push('Il feed RSS non usa identità o URL pubblico correnti.');
}

const robots = readOutput('robots.txt');
if (!robots.includes(`Sitemap: ${siteUrl}sitemap-index.xml`)) {
  errors.push('robots.txt non indica la sitemap pubblica corrente.');
}

const sitemapIndex = readOutput('sitemap-index.xml');
if (!sitemapIndex.includes(siteUrl)) {
  errors.push('L’indice sitemap non usa il base path pubblico corrente.');
}
const sitemaps = globSync('sitemap*.xml', { cwd: outputRoot })
  .map(readOutput)
  .join('\n');
if (sitemaps.includes('prototipo-la-conversazione-continua-qui')) {
  errors.push('La sitemap non deve indicizzare l’articolo dimostrativo.');
}

const home = readOutput('index.html');
for (const area of ['Libri', 'Cinema', 'Serie TV', 'Videogames']) {
  if (!home.includes(area)) errors.push(`Homepage: area editoriale non visibile: ${area}.`);
}

const archive = readOutput('blog/index.html');
for (const category of ['Libri', 'Cinema', 'Serie TV', 'Videogames', 'Approfondimenti', 'Community']) {
  if (!archive.includes(`id="${category.toLowerCase().replaceAll(' ', '-')}"`)) {
    errors.push(`Archivio: sezione di categoria mancante: ${category}.`);
  }
}

if (existsSync(join(outputRoot, 'blog/prototipo-la-conversazione-continua-qui/index.html'))) {
  errors.push('L’articolo dimostrativo non deve essere pubblicato.');
}

const htmlFiles = globSync('**/*.html', { cwd: outputRoot });
const referencePattern = /(?:href|src)=(?:"([^"]+)"|'([^']+)')/g;
const canonicalPrefix = `<link rel="canonical" href="${siteUrl}`;

for (const htmlFile of htmlFiles) {
  const sourcePath = join(outputRoot, htmlFile);
  const html = readFileSync(sourcePath, 'utf8');
  const ids = new Set([...html.matchAll(/\sid=(?:"([^"]+)"|'([^']+)')/g)].map((match) => match[1] ?? match[2]));

  if (!/<html lang="it">/.test(html)) {
    errors.push(`${htmlFile}: lingua documento non impostata su italiano.`);
  }
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
    errors.push(`${htmlFile}: deve contenere esattamente un titolo h1.`);
  }
  if (!/<main id="contenuto">/.test(html)) {
    errors.push(`${htmlFile}: landmark main mancante.`);
  }
  if (!/<meta name="description" content="[^"]+">/.test(html)) {
    errors.push(`${htmlFile}: meta description mancante o vuota.`);
  }
  if (!html.includes(canonicalPrefix)) {
    errors.push(`${htmlFile}: canonical non coerente con l’URL pubblico.`);
  }
  if (!html.includes(`<meta property="og:site_name" content="${siteName}">`)) {
    errors.push(`${htmlFile}: identità Open Graph non coerente.`);
  }
  if (!html.includes(`<meta property="og:url" content="${siteUrl}`)) {
    errors.push(`${htmlFile}: URL Open Graph non coerente.`);
  }

  for (const match of html.matchAll(referencePattern)) {
    const reference = match[1] ?? match[2];
    if (
      reference.startsWith('http://') ||
      reference.startsWith('https://') ||
      reference.startsWith('mailto:') ||
      reference.startsWith('tel:') ||
      reference.startsWith('data:')
    ) {
      continue;
    }

    if (reference.startsWith('#')) {
      const fragment = decodeURIComponent(reference.slice(1));
      if (fragment && !ids.has(fragment)) {
        errors.push(`${htmlFile}: frammento locale inesistente ${reference}`);
      }
      continue;
    }

    if (!reference.startsWith(`${basePath}/`)) {
      errors.push(`${htmlFile}: riferimento interno non prefissato dal base path: ${reference}`);
      continue;
    }

    const [pathPart, fragmentPart] = reference.slice(basePath.length).split('#', 2);
    const cleanPath = decodeURIComponent(pathPart.split('?', 1)[0]);
    const relativeTarget = cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\//, '');
    const candidate = join(outputRoot, relativeTarget);
    const target = relativeTarget.endsWith('/') ? join(candidate, 'index.html') : candidate;

    if (!existsSync(target)) {
      errors.push(`${htmlFile}: destinazione inesistente ${reference}`);
      continue;
    }

    if (fragmentPart && target.endsWith('.html')) {
      const targetHtml = readFileSync(target, 'utf8');
      const fragment = decodeURIComponent(fragmentPart);
      const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const fragmentPattern = new RegExp(`\\sid=["']${escapedFragment}["']`);
      if (!fragmentPattern.test(targetHtml)) {
        errors.push(`${htmlFile}: frammento inesistente nella destinazione ${reference}`);
      }
    }
  }
}

const publicTextFiles = globSync('**/*.{html,xml,txt,svg,css,js}', { cwd: outputRoot });
const obsoletePublicReferences = ['Passione Fantascienza', '/passionefantascienza', 't.me/fantascienza1'];
for (const file of publicTextFiles) {
  const content = readFileSync(join(outputRoot, file), 'utf8');
  for (const obsoleteReference of obsoletePublicReferences) {
    if (content.includes(obsoleteReference)) {
      errors.push(`${file}: riferimento pubblico obsoleto: ${obsoleteReference}.`);
    }
  }
}

for (const extension of ['docx', 'pdf']) {
  if (globSync(`**/*.${extension}`, { cwd: outputRoot }).length > 0) {
    errors.push(`L’output pubblico non deve contenere file .${extension}.`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Output verificato: ${requiredFiles.length} file obbligatori e ${htmlFiles.length} pagine HTML.`);
console.log(`Link, asset e metadata coerenti con il base path ${basePath}.`);
