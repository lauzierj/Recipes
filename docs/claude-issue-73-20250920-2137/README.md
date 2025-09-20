# Consistent Top Screen Navigation Implementation

## What was changed
Implemented a new consistent navigation header across all pages with the following features:
- Created a new `Header` component that provides unified navigation
- Added a centered "Recipes" heading in the header
- Added a back button (left side) that appears only on recipe detail pages
- Added a menu button (right side) with download option on recipe pages
- Displayed recipe name below the main header on recipe detail pages
- Removed duplicate title rendering from recipe content

## Why the changes were made
The user requested a consistent top navigation structure with:
- Download button in a menu on the right side of the header
- Back button on the left side when viewing a recipe
- "Recipes" as the main heading
- Recipe name displayed below the header area on recipe pages

## How to test the changes
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Navigate to the search page and verify the centered "Recipes" header
4. Click on any recipe to navigate to the detail page
5. On the recipe page, verify:
   - Back button appears on the left
   - Menu button appears on the right
   - Clicking menu shows "Download Recipe" option
   - Recipe name appears below the main header
   - Recipe title is not duplicated in the content

## Screenshots
- [Search page with header](search-page-with-header.png)
- [Recipe page with header](recipe-page-with-header.png)
- [Recipe page with menu open](recipe-page-with-menu-open.png)

## Files Modified
- `src/components/Header.tsx` - New header component (created)
- `src/App.tsx` - Updated to use new layout structure
- `src/pages/SearchPage.tsx` - Added Header component, removed duplicate heading
- `src/pages/RecipePage.tsx` - Added Header with recipe name and download functionality, removed h1 rendering
- `package.json` - Added @chakra-ui/icons dependency