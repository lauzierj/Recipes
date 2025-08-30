import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';

async function getRecipeFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getRecipeFiles(res));
    } else if (entry.isFile() && extname(entry.name) === '.recipe') {
      files.push(res);
    }
  }
  return files;
}

function extractTags(content) {
  const tags = new Set();
  const regex = /#(\w+)/g;
  let match;
  while ((match = regex.exec(content))) {
    tags.add(match[1]);
  }
  return Array.from(tags);
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function build() {
  const dir = join(process.cwd(), 'recipes');
  const files = await getRecipeFiles(dir);
  const recipes = [];
  const allTags = new Set();

  for (const file of files) {
    if (basename(file) === "All Tags.recipe") continue;
    const content = await readFile(file, 'utf8');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : basename(file, '.recipe');
    const tags = extractTags(content);
    tags.forEach(t => allTags.add(t));
    const slug = slugify(title);
    recipes.push({ title, slug, tags, content });
  }

  await writeFile(join('public', 'recipes.json'), JSON.stringify(recipes, null, 2));
  await writeFile(join('public', 'tags.json'), JSON.stringify(Array.from(allTags).sort(), null, 2));
}

build();
