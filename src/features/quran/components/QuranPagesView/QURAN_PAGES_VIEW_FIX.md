# QuranPagesView: RTL FlatList Bug — Full Investigation & Fix

## The Bug

When opening the Quran reader from the surah list (e.g., tapping Al-An'am, page 128), the reader would sometimes show the **wrong page** (page 1 or page 604) instead of the requested page. The bug was **intermittent in LTR** and **consistent in RTL** on Android. iOS was unaffected.

Touching the screen would magically reveal the correct page.

## Navigation Flow

```
Quran Tab (surah list)
  → router.push('quran-reader', { page: 128, surahId: 6 })
    → ReaderContent mounts
      → initialPageRef.current = 128
      → QuranPagesView mounts with initialPage=128
        → FlatList with initialScrollIndex=476
```

## Root Causes (Three Compounding Issues)

### 1. `inverted` Prop Race Condition (LTR)

The original code used `inverted` on the horizontal FlatList to achieve Mushaf reading order (right-to-left page flow). On Android, `inverted` applies a native `scaleX: -1` transform. This transform **races** with `initialScrollIndex` — the FlatList scrolls to the target index, but then `scaleX: -1` flips the viewport, causing index 0 to appear on screen instead.

**Evidence:** Logs showed the correct page rendering first, then page 1/2 appearing immediately after:

```
[QuranPage] render — page: 128  ← correct
[QuranPage] render — page: 1    ← wrong, appears due to scaleX flip
[QuranPage] render — page: 2
[onViewableItemsChanged] page=1  ← FlatList thinks page 1 is visible
```

### 2. Android RTL Flips Horizontal FlatList

When `I18nManager.isRTL` is true, Android **natively mirrors** horizontal scroll containers. Index 0 goes to the **RIGHT** side instead of the LEFT. This made every positioning approach unreliable:

- `initialScrollIndex` — ignored or snapped to index 0
- `contentOffset` — also ignored
- `direction: 'ltr'` wrapper — broke rendering entirely (all pages blank)

**Evidence:** In RTL, logs consistently showed page 604 (index 0) rendering after the correct page:

```
[QuranPage] render — page: 106  ← correct, briefly
[QuranPage] render — page: 604  ← index 0, now on the RIGHT due to RTL
[QuranPage] render — page: 603
[onViewableItemsChanged] page=604
```

### 3. Stale Native Layout / View Clipping

Even when the scroll position was internally correct (confirmed because touching revealed the right page), Android's native view layer didn't update after the initial layout. The FlatList was scrolled to the right offset, but the native layer still displayed index 0's content.

A touch forced a native layout recalculation, which updated the visible content to match the actual scroll position.

**Evidence:** After all scroll fixes, touching the screen would instantly reveal the correct page without any scroll animation — proving the offset was already correct.

## Approaches Tried (and Why They Failed)

| #   | Approach                                             | Result                                        |
| --- | ---------------------------------------------------- | --------------------------------------------- |
| 1   | Settle guard (ignore bogus page-1 reports for 300ms) | Still showed wrong page visually              |
| 2   | Stable `renderItem` via refs                         | Reduced frequency (1/5 ratio) but didn't fix  |
| 3   | `contentOffset` prop                                 | Ignored by Android in RTL                     |
| 4   | Settle guard + retry `scrollToIndex` (3x, 10x)       | `scrollToIndex` silently failed every time    |
| 5   | Remove `inverted`, reverse data array manually       | Fixed LTR, but RTL now snapped to page 604    |
| 6   | `direction: 'ltr'` wrapper View                      | All pages blank                               |
| 7   | Two data arrays (LTR reversed, RTL sequential)       | RTL `initialScrollIndex` still unreliable     |
| 8   | `contentOffset` instead of `initialScrollIndex`      | Ignored by Android in RTL                     |
| 9   | `inverted={IS_RTL}` (double-flip cancellation)       | Correct scroll position but blank until touch |
| 10  | **Post-mount scroll nudge**                          | **Fixed it**                                  |

## Final Solution

### Architecture

```
Data Array: [604, 603, 602, ..., 2, 1]  (reversed, same for both LTR and RTL)

Index:       0    1    2        602 603

LTR (no inverted):
  Index 0 on LEFT  → page 604 leftmost
  Index 603 on RIGHT → page 1 rightmost
  Swipe left = higher page number (Mushaf order) ✓

RTL (inverted={true}):
  Android RTL flip puts index 0 on RIGHT
  inverted applies scaleX: -1, flipping it BACK to LEFT
  Net effect: same as LTR → initialScrollIndex works ✓
```

### The Three-Part Fix

#### Part 1: Reversed Data Array (No `inverted` in LTR)

```typescript
const PAGE_DATA = Array.from({ length: TOTAL_PAGES }, (_, i) => TOTAL_PAGES - i);
// [604, 603, ..., 1]
```

Eliminates the `inverted` prop in LTR mode entirely, avoiding the `scaleX: -1` race condition.

#### Part 2: `inverted={IS_RTL}` (Double-Flip Cancellation in RTL)

```tsx
<FlatList
  inverted={IS_RTL}  // Only in RTL
  initialScrollIndex={initialScrollIndex}
  ...
/>
```

In RTL, Android's native flip + `inverted`'s `scaleX: -1` cancel each other out, restoring LTR-like behavior. `initialScrollIndex` now works reliably because the layout is effectively LTR.

#### Part 3: Post-Mount Scroll Nudge (Android RTL Only)

```typescript
useEffect(() => {
  if (Platform.OS !== 'android' || !IS_RTL) return;
  const targetOffset = pageToIndex(initialPage) * width;
  requestAnimationFrame(() => {
    listRef.current?.scrollToOffset({ offset: targetOffset + 1, animated: false });
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: targetOffset, animated: false });
      setSettled(true); // Reveal the FlatList
    });
  });
}, []);
```

Even with the double-flip fix, Android's native view layer sometimes doesn't update after `initialScrollIndex` sets the position. The nudge (scroll +1px then back) forces a native layout recalculation — the same thing a touch does. The FlatList is hidden with `opacity: 0` and a loading spinner is shown until the nudge completes, preventing any flash of wrong content.

### Stable `renderItem` via Refs

All callbacks passed to `renderItem` use refs to avoid changing identity between renders:

```typescript
const isPlayingRef = useRef(isPlaying);
isPlayingRef.current = isPlaying;

const handlePlay = useCallback((ayahs: SelectedAyah[]) => {
  if (isPlayingRef.current) { ... }
}, []); // Empty deps — never changes
```

This prevents FlatList from re-rendering all visible items when unrelated state changes (like `isPlaying`), which could re-trigger the race condition.

## Platform Behavior Summary

| Platform    | LTR                                     | RTL                                                                   |
| ----------- | --------------------------------------- | --------------------------------------------------------------------- |
| **iOS**     | Works with reversed data, no `inverted` | Works with `inverted={true}`, no nudge needed                         |
| **Android** | Works with reversed data, no `inverted` | Needs `inverted={true}` + post-mount scroll nudge + loading indicator |

## Files Modified

### `QuranPagesView.tsx`

- Reversed data array `[604..1]` for Mushaf reading order
- `pageToIndex()` function for index calculation
- `inverted={IS_RTL}` on FlatList
- Post-mount scroll nudge effect (Android RTL only)
- Loading indicator with `opacity: 0` hide (Android RTL only)
- All callbacks stabilized with refs

### `QuranPagesView.styles.ts`

- Added `hidden` style (`opacity: 0`)
- Added `loader` style (centered absolute overlay)

### `tafseerApi.ts`

- Kept `http://` (API doesn't support HTTPS)

### `app.json`

- Added `NSAppTransportSecurity` exception for `api.quran-tafseer.com` (iOS blocks HTTP by default)

## Key Debugging Insight

The critical breakthrough was observing that **touching the screen revealed the correct page without any scroll animation**. This proved:

1. The scroll position was already correct internally
2. The issue was purely a native rendering/layout problem
3. The fix needed to simulate a touch (force native layout pass), not fix the scroll position

## Lessons Learned

1. **`inverted` on Android horizontal FlatList** applies `scaleX: -1` at the native level, which races with `initialScrollIndex`.
2. **Android RTL flips horizontal scroll containers** at the native level, making `initialScrollIndex` and `contentOffset` unreliable.
3. **`scrollToIndex` can silently fail** — `scrollToOffset` is more reliable as it operates at the native ScrollView level.
4. **Native view clipping** on Android can show stale content even when the scroll position is correct. A programmatic scroll nudge forces the layout update.
5. **Double-flip cancellation** (`RTL native flip + inverted scaleX: -1 = LTR`) is the key to making horizontal FlatList work in RTL on Android.
