import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');

// Clean only this project's generated output, regardless of the caller's cwd.
if (relative(root, output) !== 'dist') throw new Error('Invalid build output directory.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

// Publish only browser runtime files, excluding test fixtures and development tools.
for (const entry of ['index.html', 'styles.css', 'favicon.svg', 'src']) {
  await cp(join(root, entry), join(output, entry), { recursive: true });
}
await writeFile(join(output, '.nojekyll'), '');
console.log('Static game built in dist/ (works at / or a repository subpath).');
