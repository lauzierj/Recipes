# Repository Guidelines

- Place all recipes inside the `recipes/` directory.
- Standalone recipes are Markdown files ending with `.recipe`.
- Recipes that include photos live in `<name>.recipepackage` directories under `recipes/`.
  - Each `.recipepackage` contains a `<name>.recipe` file and a `Photos/` folder.
  - Images must be `.webp` files stored in `Photos/` and named with GUIDs.
  - Reference images from the `.recipe` file using `![](GUID.webp)`.
- Begin each recipe with a `#` heading for the title followed by a blockquote description and any hashtags.
- For every cooking action that uses ingredients, list those ingredients immediately above the step.
  - Use the format `- Ingredient | Amount/Type | Notes` for each ingredient line.
  - Do not aggregate all ingredients at the top of the recipe.
- Additional notes or sources may appear as blockquotes or paragraphs after relevant steps.

# Browser Verification Requirements

When making changes to the site, always verify your changes work correctly in a browser:

1. **Run the development server** to test changes locally
2. **Take screenshots** of:
   - The homepage showing the recipe list
   - At least 2-3 different recipe pages (including both standalone recipes and recipe packages with photos)
   - Any specific pages affected by your changes
   - Mobile responsive views if UI changes were made

3. **Attach screenshots to pull requests** by:
   - Saving screenshots with descriptive names (e.g., `homepage.png`, `recipe-detail.png`)
   - Including them in the PR description or comments
   - Adding captions to explain what each screenshot demonstrates

4. **Visual verification checklist**:
   - ✅ All recipe titles display correctly
   - ✅ Recipe descriptions and hashtags are properly formatted
   - ✅ Images in recipe packages load and display properly
   - ✅ Navigation between pages works smoothly
   - ✅ No console errors in browser developer tools
   - ✅ Responsive design works on different screen sizes
