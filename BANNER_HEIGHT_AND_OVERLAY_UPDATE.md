# Banner Height and Overlay Update

## Overview
1. Increased the banner height to create a more prominent hero section
2. Moved the Game + Actions row (Share & Join buttons) into the banner overlay

## Changes Made

### 1. Increased Banner Height
**Before:**
```jsx
<div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
```

**After:**
```jsx
<div className="relative h-64 md:h-96 lg:h-[420px] rounded-2xl overflow-hidden mb-6">
```

**Responsive Heights:**
- Mobile (default): `h-64` (256px)
- Tablet (md): `h-96` (384px)
- Desktop (lg): `h-[420px]` (420px)

### 2. Moved Game + Actions Row Inside Banner Overlay

**Before:** Game + Actions was a separate section below the banner
```jsx
</banner>
{/* Game + Actions Row - Outside Banner */}
<div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
  {/* Content */}
</div>
```

**After:** Game + Actions is now inside the banner overlay
```jsx
{/* Game + Actions Row - Moved Inside Banner Overlay */}
<div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mt-4 sm:mt-6">
  {/* Content */}
</div>
```

## Banner Overlay Structure (Top to Bottom)

```
┌─────────────────────────────────────────────────────────┐
│                  EVENT BANNER (500px lg)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Status Badge Top Right]                                │
│ (Registration Open / In Progress / Completed)           │
│                                                          │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│ • Date & Status Line (30th Jun 2026 · Registration Open)│
│ • Title (SNS VALORANT Championship 2026)                │
│ • Info Badges (Location, Platform, Team Type, Date)    │
│ • Game + Actions Row (Game Icon, Name, Share, Join)    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Content Layout Inside Overlay

**Top Section:**
- Status Badge positioned in top-right corner

**Bottom Section (Flexbox - Column):**
1. **Date & Status Line**
   - Formatted date (e.g., "30th Jun 2026")
   - Status text (e.g., "Registration Open")

2. **Event Title**
   - Large, bold, responsive text
   - Text sizes: xl → 2xl → 3xl → 4xl (mobile → tablet → desktop)

3. **Info Badges** (flex-wrap)
   - Location badge
   - Platform badge
   - Team type badge
   - Date badge with custom wrapper

4. **Game + Actions Row** (NEW - Inside Overlay)
   - **Left:** Game thumbnail + Name
   - **Right:** Share & Join buttons
   - Margin top: `mt-4 sm:mt-6` for separation

## Benefits

✅ **More Prominent Hero** - Taller banner creates stronger visual impact
✅ **Better Space Utilization** - Game & Actions now part of the hero section
✅ **Reduced Page Height** - Content flows more naturally
✅ **Cohesive Design** - All hero elements in one cohesive overlay
✅ **Improved Mobile Experience** - Responsive height adjusts per breakpoint
✅ **Better Visual Hierarchy** - Game and actions are primary CTAs

## Responsive Behavior

| Breakpoint | Banner Height | Layout |
|-----------|---------------|--------|
| Mobile    | 256px (h-64)  | Stacked, compact |
| Tablet    | 384px (h-96)  | Stacked, spacious |
| Desktop   | 420px (h-[420px]) | Fully expanded, optimized |

## Code Moved

**From:** Lines 390-425 (Game + Actions Row)
**To:** Lines 387-421 (Inside banner overlay, bottom section)

**Key Changes:**
- Changed outer margin `mb-4 sm:mb-6` → inner margin `mt-4 sm:mt-6`
- Moved inside the `<div>` that has `justify-end` (bottom positioning)
- Now part of the overall overlay structure

## Files Modified
- `src/app/profile/events/[eventId]/page.jsx`
  - Line 287: Increased banner height
  - Lines 387-421: Moved Game + Actions inside overlay

## Next Steps (Optional)
- Could add parallax scroll effect to banner
- Could animate elements on scroll into view
- Could add gradient animation on banner
- Could add dark overlay gradient adjustment based on content

## Current Heights
- Mobile: 256px (h-64)
- Tablet: 384px (h-96)
- Desktop: 420px (h-[420px]) ← Optimized for balance
