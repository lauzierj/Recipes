import { readdir, cp } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function copyRecipeImages() {
  const recipesDir = join(process.cwd(), 'recipes');
  const distDir = join(process.cwd(), 'dist', 'recipes');
  
  // Get all entries in recipes directory
  const entries = await readdir(recipesDir, { withFileTypes: true });
  
  // Find all .recipepackage directories
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.endsWith('.recipepackage')) {
      const photosDir = join(recipesDir, entry.name, 'Photos');
      
      // Check if Photos directory exists
      if (existsSync(photosDir)) {
        const targetDir = join(distDir, entry.name, 'Photos');
        
        // Copy the Photos directory to dist
        await cp(photosDir, targetDir, { recursive: true });
        console.log(`Copied images from ${entry.name}/Photos to dist`);
      }
    }
  }
}

copyRecipeImages().catch(console.error);