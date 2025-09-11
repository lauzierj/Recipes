# Fix Download Button Text Visibility

## Issue
The download button on recipe pages had poor text visibility due to dark text on a dark background.

## Problem Analysis
- App uses dark theme with `gray.900` background (`#171923`)
- Download button used `colorScheme="blue"` with `variant="outline"`
- Outline variant buttons inherit text color which was too dark for visibility on dark background

## Solution
Fixed the button text color by explicitly setting:
- `color="blue.400"` - Ensures text is visible on dark background
- `_hover={{ color: 'blue.300' }}` - Provides visual feedback on hover

## Files Changed
- `/src/pages/RecipePage.tsx` - Line 253-254: Added explicit color props to download button

## Testing
The button now uses the same color scheme as other links in the app (`blue.400`/`blue.300`) ensuring consistent visibility on the dark theme.