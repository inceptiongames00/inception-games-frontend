# Description & Rules Section Update

## Overview
Added a new "Description & Rules" section that takes 2 columns, with Notifications and Prize Pool in a 1-column sidebar.

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Description & Rules (2 cols)  │ Sidebar (1 col)         │
├─────────────────────────────────────────────────────────┤
│                               │                          │
│ • Header with icon            │ NotificationsPanel       │
│ • Event Description           │                          │
│ • Rules with checkmarks       │ Prize Pool Card          │
│ • Important Note box          │                          │
│                               │                          │
└─────────────────────────────────────────────────────────┘
```

## Section Components

### 1. Header
- Document/clipboard icon with purple background
- "Description & Rules" title (responsive: xl to 2xl)

### 2. Event Description
- Paragraph text with event details
- Fallback text if no description provided
- Gray text with good readability
- Responsive font sizes (sm to base)

### 3. Rules List
- Dynamic rendering from `event.rules` array
- Default fallback rules provided:
  - All participants must be registered before the deadline
  - Fair play policy strictly enforced
  - All matches will be streamed on official channels
  - Prizes will be distributed within 7 days of event completion
- Each rule item features:
  - Green checkmark icon
  - Rounded pill background
  - Responsive text sizing

### 4. Important Note Box
- Amber/yellow color scheme for attention
- Alert circle icon
- "IMPORTANT NOTE" label (uppercase, tracked)
- Key information about Discord check-in requirements
- Border and background styling for emphasis

## Grid System

**Main Layout:**
```jsx
<div className="lg:col-span-3">          {/* Spans full width on large screens */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">     {/* Description: 2 columns */}
    <div className="lg:col-span-1">     {/* Sidebar: 1 column */}
```

**Responsive Behavior:**
- Mobile: Single column layout (description stacks on top of sidebar)
- Tablet: Single column layout
- Desktop (lg): 3-column grid (description takes 2, sidebar takes 1)

## Styling Details

### Description Card
- Background: `bg-white/[0.02]` with subtle transparency
- Border: `border border-white/[0.06]` for subtle separation
- Padding: `p-6 sm:p-8` responsive padding
- Rounded corners: `rounded-xl`

### Rules Checkmarks
- Background: `bg-emerald-500/20` subtle green
- Icon size: 16px checkmark
- Icon color: `text-emerald-400` bright green

### Important Note Box
- Background: `bg-amber-500/5` very subtle
- Border: `border border-amber-500/30` amber outline
- Padding: `p-4 sm:p-5`
- Alert icon color: `text-amber-400`
- Text colors: `text-amber-200` (title), `text-amber-100/80` (body)

### Sidebar (Sticky)
- Position: `sticky top-24` (stays visible while scrolling)
- Spacing: `space-y-4` between sidebar items
- Contains:
  - NotificationsPanel
  - Prize Pool Card (if prizePool > 0)

## Code Location
- File: `src/app/profile/events/[eventId]/page.jsx`
- Lines: 463-520 (Description section)
- Lines: 520-540 (Sidebar section)

## Features

✅ **Dynamic Content** - Rules from event data or fallback defaults
✅ **Responsive Design** - Works on all screen sizes
✅ **Visual Hierarchy** - Clear distinction between sections
✅ **Attention-Grabbing** - Important note highlighted in amber
✅ **Sticky Sidebar** - Remains visible while scrolling
✅ **Icon Integration** - Document and alert icons for visual clarity
✅ **Color-Coded** - Green for rules, amber for important info

## Data Requirements

The section uses:
- `event.description` - Event description text
- `event.rules` - Array of rule strings
- `event.prizePool` - Prize pool amount (for sidebar)
- `event.currency` - Currency code (for sidebar)

All have fallback values if not provided.

## Next Steps (Optional)
- Could add collapsible sections for rules
- Could add rule categories/grouping
- Could add edit/manage rules admin functionality
- Could add rule voting or community feedback
- Could add FAQ section below rules
