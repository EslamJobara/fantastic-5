---
inclusion: auto
---

# The Precision Curator Design System

## Creative North Star: "Atmospheric Precision"

Move beyond template looks by embracing Atmospheric Precision - open, breathable interfaces where hierarchy is defined by tonal shifts rather than structural lines.

## Core Principles

### 1. The "No-Line" Rule
**CRITICAL**: Do not use 1px solid borders to section off content. Define boundaries through:
- Background color shifts between surface tiers
- Negative space using 8px grid with wide gutters
- Tonal layering

### 2. Colors: Tonal Depth
- Primary: `#0058be` (Tech Blue) - Use sparingly for high-intent actions
- Surface Tiers:
  - `surface_container_lowest`: #ffffff (primary content cards)
  - `surface`: #f8f9fa (base background)
  - `surface_container_low`: #f3f4f5 (secondary sections)
- Tertiary: `#924700` (warm accent for labels)

### 3. Glass & Signature Textures
- **Glassmorphism**: `surface_container_lowest` at 80% opacity with 20px backdrop-blur
- **Liquid Gradient**: Primary CTAs use linear gradient from `primary` to `primary_container` at 135deg

### 4. Typography: Editorial Voice
- Use Inter exclusively
- Display: Large, low-kerning headlines for hero banners
- Body: High line-height (1.6) for readability
- Labels: Small, uppercase tracking for specs

### 5. Elevation: Ambient Shadows
- Shadow Token: `blur: 40px`, `spread: -5px`, `color: rgba(25, 28, 29, 0.06)`
- Shadows should be "ghostly" and ambient, not dark drop shadows

### 6. Ghost Border Fallback
If borders are required for accessibility:
- Use `outline_variant` (#c2c6d6) at 20% opacity
- Should be barely perceptible

## Component Guidelines

### Buttons
- Primary: Rounded full, Liquid Gradient, 24px horizontal padding
- Secondary: `surface_container_high` background, no border

### Product Cards
- **Forbid divider lines within cards**
- Use `surface_container_lowest` background
- Floating product images (PNG with no background)

### Input Fields
- Outlined using `outline_variant` at 40% opacity
- Focus: `primary` at 2px thickness
- Floating or top-aligned labels

### Interactive Chips
- Unselected: `surface_container_highest`
- Selected: `primary` with `on_primary`
- Corner radius: 0.25rem

## Do's and Don'ts

### Do
- Use asymmetrical margins for editorial sections
- Use `surface_tint` at 5% opacity for hover states
- Prioritize high-quality product photography

### Don't
- Don't use 100% black (#000000) - always use `on_surface` (#191c1d)
- Don't use Card-in-Card patterns with multiple borders
- Don't use standard blue system links

## Implementation Notes
- White space is a functional element, not just a gap
- Create depth through tonal layering, not physical shadows
- Intentional asymmetry creates editorial movement
