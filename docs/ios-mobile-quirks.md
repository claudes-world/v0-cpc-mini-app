# iOS and Mobile Web App Quirks Reference

## Preventing iOS Safari Zoom on Input Focus

iOS Safari automatically zooms in when focusing on input fields with font-size less than 16px.

### Solutions:

1. **Set minimum font size of 16px on all inputs** (Recommended)
   ```css
   input, textarea, select {
     font-size: 16px;
   }
   ```

2. **Viewport meta tag settings**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
   ```
   
   Note: `user-scalable=no` may be ignored on newer iOS versions for accessibility reasons.

3. **Next.js Viewport Export**
   ```typescript
   export const viewport: Viewport = {
     width: 'device-width',
     initialScale: 1,
     maximumScale: 1,
     userScalable: false,
     viewportFit: 'cover',
   }
   ```

## iOS PWA (Add to Home Screen) Settings

### Required meta tags and manifest settings:

```typescript
// Next.js metadata
export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent', // or 'default' or 'black'
    title: 'App Name',
  },
  manifest: '/manifest.json',
}
```

### Status bar styles:
- `default`: White background with black text
- `black`: Black background with white text
- `black-translucent`: Content extends behind status bar

## Preventing Unwanted Touch Behaviors

### CSS Properties:

```css
html {
  /* Prevents double-tap zoom and other gestures */
  touch-action: manipulation;
  
  /* Removes tap highlight color */
  -webkit-tap-highlight-color: transparent;
  
  /* Prevents pull-to-refresh and overscroll bounce */
  overscroll-behavior: none;
}

body {
  /* Prevents text selection on long press */
  -webkit-user-select: none;
  user-select: none;
  
  /* Prevents callout menu on long press */
  -webkit-touch-callout: none;
}
```

### Prevent body scroll when modal/overlay is open:
```css
html, body {
  overflow: hidden;
  height: 100%;
}
```

## Telegram Mini App Specific Quirks

### Virtual Keyboard Issues:
- On iOS, the virtual keyboard can cause content to shift improperly
- Scrollable containers may have broken layouts when keyboard appears
- Gap may appear between input field and keyboard

### Viewport Issues:
- `viewport_changed` event may not report actual visible height on iOS
- Bottom sheet behavior: Mini Apps open in a draggable BottomSheet
- During dragging, viewport is unstable - avoid resize actions

### Workarounds:
- Use `web_app_expand` to programmatically expand the Mini App
- For input focus issues, consider making input visually hidden (opacity: 0 or clipped)
- Always test on actual iOS device, not just simulator

## Safe Area Insets (Notch/Dynamic Island)

```css
/* Apply padding for safe areas */
.safe-area-pt { padding-top: env(safe-area-inset-top); }
.safe-area-pb { padding-bottom: env(safe-area-inset-bottom); }
.safe-area-pl { padding-left: env(safe-area-inset-left); }
.safe-area-pr { padding-right: env(safe-area-inset-right); }
```

For viewport-fit=cover to work, these are required.

## iOS Input Quirks

### Prevent zoom AND maintain small font:
The only reliable way is to use 16px font-size. Workarounds like transform: scale() cause other issues.

### Input mode for numeric keyboards:
```html
<input inputMode="numeric" pattern="[0-9]*">
```

### Prevent autofill styling:
```css
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px #your-bg-color inset;
  -webkit-text-fill-color: #your-text-color;
}
```

## Complete Recommended Setup

### layout.tsx:
```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'App Name',
  },
}
```

### globals.css:
```css
html {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior: none;
}

html, body {
  height: 100%;
  overflow: hidden;
}

/* All inputs must be 16px minimum */
input, textarea, select {
  font-size: 16px;
}
```
