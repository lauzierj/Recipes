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

# Meal Planning

This repo is a curated, tested collection — the starting point for meal planning, not the limit. New ideas are welcome, but they should come from real published recipes.

- Do not invent recipes from scratch or present AI-generated recipes as tested. The owner rarely trusts them.
- For a new dish, find 2–4 published recipes, link each one, and note how they differ (technique, active time, kid-friendliness, make-ahead/reheat).
- Prefer sources already used in this repo, e.g. NYT Cooking, Serious Eats, The Mediterranean Dish, Eat Yourself Skinny, The Modern Proper, How Sweet Eats, Well Seasoned Studio, Love and Lemons, Simply Recipes.
- When asked, combine sources into a draft in the repo recipe format with a `> Source:` line for every recipe drawn from. The owner reviews and tweaks it before it becomes a keeper.
- Check the family calendar (Google Calendar, including the subscribed Dance and Activities calendars) for evening constraints such as who is home, dance pickups and reheat-later nights.
- Weather location is 01073 (Southampton, MA). Check the forecast before planning grill nights.

# Documentation Requirements

When implementing changes to the codebase:

1. **Create documentation folder structure**:
   - Store all documentation in a `docs/` folder at the repository root
   - Create a subfolder named after your branch (e.g., `docs/ai-feature-branch/`)
   - Store all evidence and documentation for that branch in this folder

2. **Required documentation**:
   - **Screenshots**: Take screenshots of the application showing your changes in action
     - Build and launch the application
     - Navigate through the browser to test features
     - Capture screenshots of affected pages and features
   - **Architecture diagrams**: Document any architectural changes or new components
   - **Implementation reasoning**: Explain why specific approaches were chosen
   - **Test evidence**: Include screenshots or logs showing tests passing

3. **Screenshot requirements**:
   - Take screenshots of the homepage/main view
   - Capture individual feature pages affected by changes
   - Include both before and after states when modifying existing features
   - Show responsive views for UI changes
   - Name screenshots descriptively (e.g., `homepage-recipe-list.png`, `recipe-detail-view.png`)
   - **IMPORTANT**: All screenshots must be no larger than 8000px in either dimension before being processed by Claude APIs

4. **Documentation format**:
   - Create a `README.md` in the branch folder explaining:
     - What was changed
     - Why the changes were made
     - How to test the changes
     - Links to relevant screenshots
   - Use relative links to reference screenshots and other documentation

# Testing and Validation Requirements

When implementing any functionality changes:

1. **Build and Test Process**:
   - Always build the project using the appropriate build command
   - Launch the application locally to verify functionality
   - Navigate through the browser to test affected features
   - Take screenshots showing the changes in action

2. **MCP Configuration**:
   - Use the `mcp-config.json` file for Model Context Protocol configuration
   - Reference in GitHub Actions with `--mcp-config mcp-config.json` in `claude_args`
   - Includes Playwright MCP server for browser automation and testing

3. **Documentation Evidence**:
   - Screenshots must be uploaded to pull requests showing functionality
   - Include both before/after states when modifying existing features
   - Test evidence should demonstrate successful implementation
