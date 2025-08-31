import { readdir, readFile, writeFile, cp, mkdir } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { existsSync } from 'fs';

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

async function copyRecipePackages(srcDir, destDir) {
  const entries = await readdir(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.endsWith('.recipepackage')) {
      const packageSrc = join(srcDir, entry.name);
      const packageDest = join(destDir, entry.name);
      
      // Copy the entire package directory including Photos
      await cp(packageSrc, packageDest, { recursive: true });
    }
  }
}

async function build() {
  const dir = join(process.cwd(), 'recipes');
  const publicDir = join(process.cwd(), 'public');
  const publicRecipesDir = join(publicDir, 'recipes');
  
  // Ensure public/recipes directory exists
  if (!existsSync(publicRecipesDir)) {
    await mkdir(publicRecipesDir, { recursive: true });
  }
  
  // Copy all .recipepackage directories to public/recipes
  await copyRecipePackages(dir, publicRecipesDir);
  
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
