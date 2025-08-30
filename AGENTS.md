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
