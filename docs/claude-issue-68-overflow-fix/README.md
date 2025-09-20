# Tag List Overflow Detection Fix

## What was changed
Fixed the tag list More/Show less button to appear based on actual content overflow instead of a fixed tag count (>10).

## Why the changes were made
The previous implementation had an accessibility issue where the More button only appeared when there were more than 10 tags. However, on narrow screens or with longer tag names, even fewer tags could overflow the 76px height limit, leaving some tags hidden with no way to show them.

## Implementation Details
- Added `useRef` to track the tag container element
- Added `isOverflowing` state to track whether content exceeds 76px height
- Implemented a `useEffect` hook that:
  - Checks scrollHeight vs 76px to detect overflow
  - Uses ResizeObserver for responsive detection
  - Listens to window resize events
  - Re-checks when tags change
- Changed the More button visibility from `tags.length > 10` to `isOverflowing`

## Screenshots
- `narrow-screen-tags.png` - Shows the More button appearing on narrow screens with overflow
- `narrow-screen-tags-with-more.png` - Shows expanded state with all tags visible
- `wide-screen-tags-no-overflow.png` - Shows desktop view with tags fitting in 2 lines

## How to test the changes
1. Run `npm install` and `npm run dev`
2. Navigate to the search page
3. Resize the browser window to various widths
4. Observe that the More button appears only when tags actually overflow the 76px height
5. Click the More button to expand and Show less to collapse