import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { globSync } from 'node:fs';

const projectRoot = resolve(import.meta.dirname, '..');
const outputRoot = join(projectRoot, 'dist');
const base = '/passionefantascienza';

const requiredFiles = [
  'index.html',
  'blog/index.html',
  'blog/prototipo-la-conversazione-continua-qui/index.html',
  'autori/index.html',
  'autori/giordano-sognatore/index.html',
  'community/index.html',
  'risorse/index.html',
  'rss.xml',
  'sitemap-index.xml',
  'robots.txt',
  'downloads/docs/Passione_Fantascienza_Proposta_Giordano_Sognatore_a_Riccardo.pdf',
  'downloads/docs/Passione_Fantascienza_Piano_Tecnico_Implementazione.pdf',
];

const errors = [];

for (const file of requiredFiles) {
  const path = join(outputRoot, file);
  if (!existsSync(path) || statSync(path).size === 0) {
    errors.push(`Output obbligatorio mancante o vuoto: ${file}`);
  }
}

const rss = existsSync(join(outputRoot, 'rss.xml'))
  ? readFileSync(join(outputRoot, 'rss.xml'), 'utf8')
  : '';
if (!rss.includes('<link>https://giordanosognatore.github.io/passionefantascienza/</link>')) {
  errors.push('Il link principale del feed RSS non include il base path di GitHub Pages.');
}

const htmlFiles = globSync('**/*.html', { cwd: outputRoot });
const referencePattern = /(?:href|src)=(?:"([^"]+)"|'([^']+)')/g;

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
  if (!/<link rel="canonical" href="https:\/\/giordanosognatore\.github\.io\/passionefantascienza\//.test(html)) {
    errors.push(`${htmlFile}: canonical non coerente con l'URL pubblico.`);
  }
  if (/href=["'][^"']*downloads\/docs\//.test(html)) {
    errors.push(`${htmlFile}: i PDF di specifica non devono essere promossi nell'interfaccia.`);
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

    if (!reference.startsWith(`${base}/`)) {
      errors.push(`${htmlFile}: riferimento interno non prefissato dal base path: ${reference}`);
      continue;
    }

    const [pathPart, fragmentPart] = reference.slice(base.length).split('#', 2);
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
      const fragmentPattern = new RegExp(`\\sid=["']${fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
      if (!fragmentPattern.test(targetHtml)) {
        errors.push(`${htmlFile}: frammento inesistente nella destinazione ${reference}`);
      }
    }
  }
}

if (globSync('**/*.docx', { cwd: outputRoot }).length > 0) {
  errors.push('L’output pubblico non deve contenere i DOCX sorgente.');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Output verificato: ${requiredFiles.length} file obbligatori e ${htmlFiles.length} pagine HTML.`);
console.log(`Link e asset interni coerenti con il base path ${base}.`);
