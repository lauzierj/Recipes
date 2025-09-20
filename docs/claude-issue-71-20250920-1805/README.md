# Fix for Issue #71: Images don't load on Recipes with spaces in name

## What was changed
Fixed the image rendering issue in `src/pages/RecipePage.tsx` where images were not loading for recipes with spaces in their folder names (e.g., "American Chop Suey.recipepackage").

## Why the changes were made
The issue occurred because folder names with spaces were not being properly URL-encoded when constructing the image paths. The folder name "American Chop Suey.recipepackage" contains spaces that need to be encoded as "%20" in URLs.

## How to test the changes
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. Navigate to http://localhost:5173/Recipes
4. Search for "American Chop Suey" and click on the recipe
5. Verify that the image loads correctly at the top of the recipe
6. Also test with "Applesauce" recipe to ensure existing recipes still work

## Technical Details
The fix involved modifying the image URL processing logic to:
1. Properly encode the `packageFolder` name using `encodeURIComponent()`
2. This ensures spaces are converted to "%20" in the URL path
3. The change maintains backward compatibility with recipes without spaces

## Screenshots
- [American Chop Suey Recipe - Fixed](./american-chop-suey-fixed.png) - Shows the image now loading correctly
- [Applesauce Recipe - Still Working](./applesauce-fixed.png) - Confirms existing recipes still work

## Files Modified
- `src/pages/RecipePage.tsx` - Added URL encoding for folder names with spaces