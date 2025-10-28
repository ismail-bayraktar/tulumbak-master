# Premium Admin Dashboard Design System - Tulumbak

## Overview
This design system provides a comprehensive set of design tokens, components, and guidelines for the Tulumbak admin dashboard. It emphasizes a calm, modern, craft-like aesthetic with soft shadows, rounded corners, and warm neutral colors.

---

## Color Palette

### Warm Neutrals (Base UI)
- **cream-50**: `#FDFCFB` - App background
- **cream-100**: `#F8F6F3` - Card hover states
- **cream-200**: `#F1EDE7` - Dividers and subtle borders

### Warm Gray Scale
- **warm-gray-50**: `#FAFAF9` - Lightest background
- **warm-gray-100**: `#F5F5F4` - Subtle backgrounds
- **warm-gray-200**: `#E7E5E4` - Borders and dividers
- **warm-gray-300**: `#D6D3D1` - Disabled states
- **warm-gray-400**: `#A8A29E` - Placeholder text
- **warm-gray-500**: `#78716C` - Secondary text
- **warm-gray-600**: `#57534E` - Muted text
- **warm-gray-700**: `#44403C` - Primary text
- **warm-gray-800**: `#292524` - Dark text
- **warm-gray-900**: `#1C1917` - Darkest text

### Brand Accents (E-commerce Operations)
- **copper-brown**: `#8B5E3C` - Primary brand, operational widgets
- **antep-green**: `#3D7C47` - Positive metrics, success states
- **brand-cream**: `#F6EFE7` - Section backgrounds

### Status Colors (Soft Pastels)
- **coral**: `#FF8A80` - Primary CTA, accent actions
- **teal**: `#80CBC4` - Info, confirmed status
- **sage-green**: `#A5D6A7` - Success, delivered
- **amber**: `#FFD54F` - Warning, pending
- **soft-red**: `#EF9A9A` - Error, cancelled

### Status Badge Backgrounds
- **pending**: `#FFF8E1` background, `#B45309` text
- **confirmed**: `#E0F2F1` background, `#0F766E` text
- **preparing**: `#FFE5E5` background, `#BE123C` text
- **ready**: `#E8F5E9` background, `#166534` text
- **delivered**: `#F1F8E9` background, `#365314` text
- **cancelled**: `#FFEBEE` background, `#B91C1C` text

---

## Typography Scale

### Font Family
- **Primary**: Inter (400, 500, 600 weights)
- **Secondary**: Playfair Display (serif, for traditional touches)

### Headings
- **H1**: 32px / 40px line-height, 600 weight, -0.02em tracking
- **H2**: 24px / 32px, 600 weight, -0.01em tracking
- **H3**: 20px / 28px, 600 weight
- **H4**: 16px / 24px, 600 weight

### Body Text
- **Large**: 16px / 24px, 400 weight
- **Default**: 14px / 20px, 400 weight
- **Small**: 12px / 16px, 400 weight
- **Caption**: 11px / 14px, 400 weight

### Table/Data
- **Row height**: 44-48px
- **Cell padding**: 12px 16px
- **Font**: 14px, 500 weight for headers

---

## Spacing Scale (Comfortable Density)

Based on 8px grid system:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **2xl**: 24px
- **3xl**: 32px
- **4xl**: 40px (page padding)
- **5xl**: 48px
- **6xl**: 64px

---

## Elevation System (Soft Shadows)

### Shadow Levels
- **soft-xs**: `0 1px 2px rgba(0,0,0,0.04)`
- **soft-sm**: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- **soft-md**: `0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)`
- **soft-lg**: `0 8px 16px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)`
- **soft-xl**: `0 12px 24px rgba(0,0,0,0.1), 0 6px 12px rgba(0,0,0,0.06)`

### Interactive States
- **Hover elevation**: Add +4px to z-offset
- **Glass effect**: `backdrop-blur(8px)` + white at 60% opacity overlay

---

## Border Radii

- **xs**: 4px
- **sm**: 6px
- **md**: 8px
- **input**: 10px
- **pill**: 12px
- **card**: 16px
- **card-lg**: 20px
- **full**: 9999px (circular)

---

## Component Specifications

### Buttons

#### Sizes
- **Default**: 36px height, 12px 20px padding
- **Small**: 32px height, 8px 16px padding
- **Large**: 40px height, 16px 24px padding

#### Variants
- **Primary**: Coral fill, white text, soft-md shadow
- **Secondary**: Transparent, warm-gray-700 border, warm-gray-900 text
- **Success**: Sage green fill, white text
- **Destructive**: Soft red fill, white text
- **Ghost**: Transparent, hover warm-gray-100 background
- **Icon**: 32px circle, subtle background, icon 16px

#### States
- **Default**: Base styling
- **Hover**: Elevated shadow, subtle transform
- **Active**: Pressed state
- **Disabled**: Reduced opacity, no interaction

### Chips/Pills

- **Height**: 28px
- **Padding**: 6px 12px
- **Radius**: 12px
- **Background**: Low-contrast pastel (status dependent)
- **Text**: 12px, 500 weight
- **Optional icon**: 14px, left-aligned

### Status Badges

- **pending**: Amber background, amber-800 text
- **confirmed**: Teal background, teal-800 text
- **preparing**: Coral background, coral-800 text
- **ready**: Green background, green-800 text
- **delivered**: Sage background, sage-800 text
- **cancelled**: Red background, red-800 text

### Inputs

- **Height**: 40px
- **Padding**: 10px 14px
- **Radius**: 10px
- **Border**: warm-gray-300, 1px
- **Focus**: Coral ring, 2px offset
- **Inset shadow**: `0 1px 2px rgba(0,0,0,0.04)` inside
- **With icon**: 36px left/right padding

### Cards

- **Background**: white
- **Radius**: 16px (default), 20px (large)
- **Shadow**: soft-sm (default), soft-md (hover)
- **Border**: hairline warm-gray-200 at 10% opacity
- **Padding**: 20px (default), 24px (large)
- **Header actions**: Right-aligned, 8px gap, icon buttons

### Table Rows

- **Height**: 48px
- **Padding**: 12px 16px per cell
- **Zebra**: every odd row warm-gray-50 at 30% opacity
- **Hover**: cream-100 background + soft-sm shadow
- **Border**: Bottom hairline warm-gray-200

### Dividers

- **Hairline**: 1px, warm-gray-200 at 8-12% opacity
- **Horizontal**: margin 16px vertical
- **Vertical**: height 24px, margin 12px horizontal

### Breadcrumbs

- **Font**: 14px, 400 weight
- **Separator**: • (bullet), warm-gray-400
- **Current**: 600 weight, warm-gray-900
- **Links**: warm-gray-600, hover copper-brown
- **Back chevron**: 16px icon, -4px margin-left

---

## Layout Guidelines

### App Shell
- **Sidebar**: Fixed left, 260px wide
- **Top bar**: Sticky, 56px height
- **Content container**: 40px padding (32px on tablet)

### Grid System
- **Base**: 8px grid
- **Breakpoints**: Mobile (375px), Tablet (768px), Desktop (1920px)
- **Max width**: Fluid, no fixed constraint

### Card Layouts
- **Default spacing**: 24px vertical, 16px horizontal
- **Card groups**: 16px gap between cards
- **Content padding**: 20px (default), 24px (large)

---

## Accessibility Guidelines

### Focus States
- **Focus rings**: Visible, 2px offset
- **Color contrast**: AA compliant (4.5:1 minimum)
- **Icon buttons**: Must have labels

### Interactive Elements
- **Touch targets**: Minimum 44px
- **Hover states**: Clear visual feedback
- **Disabled states**: Reduced opacity, no interaction

### Screen Reader Support
- **Semantic HTML**: Use proper heading hierarchy
- **ARIA labels**: For icon-only buttons
- **Alt text**: For all images

---

## Animation Guidelines

### Transitions
- **Duration**: 200ms for micro-interactions
- **Easing**: ease-out for entrances, ease-in for exits
- **Hover**: Subtle transform (translateY(-1px))

### Loading States
- **Skeleton**: Animated pulse, warm-gray-200 to warm-gray-100
- **Spinner**: Smooth rotation, 1s duration
- **Progress**: Smooth progress bars

---

## Usage Examples

### CSS Classes
```css
/* Premium card */
.card-premium {
  @apply bg-white rounded-card shadow-soft-sm border border-hairline-warm;
}

/* Primary button */
.btn-primary {
  @apply bg-coral text-white rounded-input shadow-soft-md;
}

/* Status badge */
.badge-pending {
  @apply badge-pending rounded-pill px-3 py-1 text-xs font-medium;
}
```

### Tailwind Classes
```html
<!-- Premium card -->
<div class="bg-white rounded-card shadow-soft-sm border border-warm-gray-200 p-5">
  <h3 class="text-lg font-semibold text-warm-gray-900">Card Title</h3>
  <p class="text-warm-gray-600">Card content</p>
</div>

<!-- Primary button -->
<button class="btn-premium btn-primary">
  Primary Action
</button>

<!-- Status badge -->
<span class="badge-pending rounded-pill px-3 py-1 text-xs font-medium">
  Pending
</span>
```

---

## Implementation Notes

### CSS Custom Properties
All colors and spacing values are available as CSS custom properties for dynamic theming and consistency.

### Tailwind Integration
The design system is fully integrated with Tailwind CSS using custom color scales, spacing, and component utilities.

### Component Library
Premium wrapper components are built on top of shadcn/ui base components, maintaining ergonomics while adding the premium aesthetic.

---

## Version History

- **v1.0.0**: Initial premium design system implementation
- **v1.1.0**: Added status badge system and improved accessibility
- **v1.2.0**: Enhanced animation guidelines and micro-interactions
