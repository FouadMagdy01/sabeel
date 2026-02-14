# Quickstart Guide: Home Screen UI Enhancement

**Feature**: 001-home-ui-enhancement
**For**: Developers implementing the Azkar and Random Acts UI redesign
**Estimated Time**: 2-3 hours for implementation + testing

## Prerequisites

Before starting implementation:

1. ✅ Read [spec.md](./spec.md) - Understand requirements and clarifications
2. ✅ Read [research.md](./research.md) - Review technical decisions
3. ✅ Read [data-model.md](./data-model.md) - Understand data structures
4. ✅ Checkout feature branch: `git checkout 001-home-ui-enhancement`
5. ✅ Ensure development environment is running: `npm start`

## Implementation Checklist

### Step 1: Update AzkarProgress Component (30-45 min)

**File**: `src/features/home/components/AzkarProgress/AzkarProgress.tsx`

- [ ] Keep existing Card component as outer container
- [ ] Update header layout:
  - [ ] Title (Typography) on left
  - [ ] Progress percentage + CircularProgress on right
  - [ ] Improve visual hierarchy with better spacing
- [ ] Update chips row:
  - [ ] Use `gap: theme.metrics.spacing.p12` between chips
  - [ ] Ensure each chip has minimum 44pt height
  - [ ] Keep status-based icon and color logic
- [ ] Test all states:
  - [ ] 0% complete (all uncompleted)
  - [ ] 33% complete (1 of 3)
  - [ ] 67% complete (2 of 3)
  - [ ] 100% complete (all completed)

**File**: `src/features/home/components/AzkarProgress/AzkarProgress.styles.ts`

- [ ] Update chip spacing using `gap` and improved padding
- [ ] Ensure all colors use theme.colors.\* semantic tokens
- [ ] Ensure all spacing uses theme.metrics.\* functions
- [ ] Remove any hardcoded values
- [ ] Test in light and dark mode

**Validation**:

```bash
# Run linter
npm run lint

# Check types
npm run type-check

# Visual check in Expo Go
# - iOS and Android
# - Light and dark mode
# - Different completion states
```

---

### Step 2: Update RandomActsGrid Component (45-60 min)

**File**: `src/features/home/components/RandomActsGrid/RandomActsGrid.tsx`

- [ ] Replace grid layout with vertical list (View + .map())
- [ ] Update progress header (similar to AzkarProgress)
- [ ] Implement card ordering:
  ```typescript
  const completedActs = acts.filter((a) => a.status === 'completed');
  const unlockedActs = acts.filter((a) => a.status === 'unlocked');
  const lockedActs = acts.filter((a) => a.status === 'locked');
  const orderedActs = [...completedActs, ...unlockedActs, ...lockedActs];
  ```
- [ ] Render equal-sized cards for all acts
- [ ] Update status indicators:
  - [ ] Completed: success color + check icon badge
  - [ ] Unlocked: tertiary brand color + add icon badge
  - [ ] Locked: muted color + lock indicator
- [ ] Keep platform-specific press feedback (android_ripple, iOS pressed state)

**File**: `src/features/home/components/RandomActsGrid/RandomActsGrid.styles.ts`

- [ ] Remove asymmetric grid styles (leftColumn, rightColumn)
- [ ] Add vertical list container styles
- [ ] Add equal-sized card styles (use flexbox if needed for consistency)
- [ ] Update spacing using theme.metrics.\*
- [ ] Ensure all colors use semantic tokens
- [ ] Test in light and dark mode

**Validation**:

```bash
# Run linter
npm run lint

# Check types
npm run type-check

# Visual check in Expo Go
# - All status combinations (completed, unlocked, locked)
# - Verify equal sizing
# - Verify card ordering
# - Light and dark mode
```

---

### Step 3: Verify Integration (15-30 min)

**File**: `app/(main)/(tabs)/index.tsx` (no changes expected)

- [ ] Verify DailyTodos still renders correctly
- [ ] Verify home screen layout is preserved
- [ ] Verify scroll behavior works
- [ ] Test on different screen sizes:
  - [ ] iPhone SE (320px width)
  - [ ] iPhone 14 (390px width)
  - [ ] iPad (768px+ width)

---

### Step 4: Visual QA (30 min)

Test matrix:

| Scenario                     | Light Mode | Dark Mode | Notes                            |
| ---------------------------- | ---------- | --------- | -------------------------------- |
| Azkar: 0% complete           | ☐          | ☐         | All chips uncompleted            |
| Azkar: 33% complete          | ☐          | ☐         | 1 chip completed                 |
| Azkar: 100% complete         | ☐          | ☐         | All chips completed              |
| Random Acts: 1 completed     | ☐          | ☐         | Completed first in list          |
| Random Acts: All unlocked    | ☐          | ☐         | No completed, no locked          |
| Random Acts: Mixed           | ☐          | ☐         | Completed + unlocked + locked    |
| Press feedback (Azkar)       | ☐          | ☐         | Visual feedback on tap           |
| Press feedback (Random Acts) | ☐          | ☐         | Ripple (Android) / opacity (iOS) |
| Responsive: iPhone SE        | ☐          | ☐         | All touch targets accessible     |
| Responsive: iPad             | ☐          | ☐         | No excessive whitespace          |

---

### Step 5: Code Quality Gates (15 min)

**Run all validation**:

```bash
npm run validate
```

This runs:

- TypeScript type checking
- ESLint (no hardcoded strings, no inline styles, no `any`)
- Prettier format check

**Fix any issues**:

```bash
npm run format  # Auto-fix Prettier issues
```

---

### Step 6: Commit Changes (10 min)

**Pre-commit hooks will run automatically** (Husky + lint-staged):

- Type check
- ESLint
- Prettier

**Commit message format** (Conventional Commits):

```bash
git add src/features/home/components/AzkarProgress/
git add src/features/home/components/RandomActsGrid/

git commit -m "feat: redesign azkar and random acts UI on home screen

- Update AzkarProgress to hybrid card-with-chips layout
- Improve chip spacing with 12pt gap for better visual hierarchy
- Redesign RandomActsGrid as vertical list of equal-sized cards
- Ensure all styles use design system semantic tokens
- Maintain 44pt minimum touch targets per accessibility guidelines
- Support light and dark mode with theme.colors.mode

Closes #[issue-number]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Quick Reference: Design System

### Colors (Semantic Tokens)

```typescript
theme.colors.brand.primary;
theme.colors.brand.secondary;
theme.colors.brand.tertiary;
theme.colors.text.primary;
theme.colors.text.secondary;
theme.colors.background.app;
theme.colors.background.card;
theme.colors.state.success;
theme.colors.state.info;
theme.colors.icon.primary;
theme.colors.icon.muted;
theme.colors.overlay.pressed;
```

### Spacing

```typescript
theme.metrics.spacing.p4; // 4pt
theme.metrics.spacing.p8; // 8pt
theme.metrics.spacing.p12; // 12pt (chips gap)
theme.metrics.spacing.p16; // 16pt
theme.metrics.spacing.p24; // 24pt (card padding)
theme.metrics.spacingV.p8; // Vertical 8pt
theme.metrics.spacingV.p12; // Vertical 12pt
theme.metrics.spacingV.p24; // Vertical 24pt
```

### Components

```typescript
import { Card } from '@/common/components/Card';
import { Typography } from '@/common/components/Typography';
import { Icon } from '@/common/components/Icon';
import { CircularProgress } from '@/common/components/CircularProgress';
```

---

## Troubleshooting

### "Hardcoded string detected" ESLint Error

**Cause**: String literal in component instead of i18n key
**Fix**: Use `t('screens.home.dailyTodos.keyName')` from useTranslation

### "Inline style detected" ESLint Error

**Cause**: Style object passed directly to component
**Fix**: Move to StyleSheet.create((theme) => ({})) in .styles.ts file

### Colors don't change in dark mode

**Cause**: Hardcoded color values instead of theme tokens
**Fix**: Replace `'#hexcode'` with `theme.colors.semantic.token`

### Touch targets too small on device

**Cause**: Insufficient height or padding
**Fix**: Ensure minimum 44pt height and adequate padding

### Chips/cards overlapping

**Cause**: Missing or incorrect gap/spacing
**Fix**: Use `gap: theme.metrics.spacing.p12` in container style

---

## Testing on Device

### Expo Go (Recommended for Quick Testing)

```bash
# Start Metro bundler
npm start

# Scan QR code with:
# - Expo Go app (iOS)
# - Expo Go app (Android)
```

### iOS Simulator

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

---

## Next Steps After Implementation

1. ✅ Create pull request with screenshots
2. ✅ Request code review from team
3. ✅ Address review feedback
4. ✅ Merge to main after approval
5. ⬜ Monitor for user feedback post-deployment

---

## Need Help?

- **Design questions**: Review [spec.md](./spec.md) clarifications
- **Technical decisions**: Review [research.md](./research.md)
- **Component contracts**: Review [contracts/component-contracts.md](./contracts/component-contracts.md)
- **Constitution compliance**: Review `.specify/memory/constitution.md`

**Estimated Total Time**: 2-3 hours for experienced React Native developer

**Success Criteria**: All visual QA checkboxes pass + `npm run validate` passes
