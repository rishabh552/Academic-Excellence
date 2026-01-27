# Logo & Favicon Setup Instructions

## Current Status
✅ SVG logos created:
- `/public/logo.svg` - Main brand logo (512x512)
- `/public/favicon.svg` - Favicon vector (32x32)

## What You Need to Do

### Option 1: Use Online Tool (Easiest)
1. Visit https://realfavicongenerator.net/
2. Upload `/public/logo.svg`
3. Download the generated package
4. Extract files to `/public/` folder

This will generate:
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png
- android-chrome-512x512.png
- safari-pinned-tab.svg

### Option 2: Use Command Line
If you have ImageMagick or similar tools installed:

```bash
# Install sharp-cli for image conversion
npm install -g sharp-cli

# Generate favicons
sharp -i public/logo.svg -o public/favicon-16x16.png resize 16 16
sharp -i public/logo.svg -o public/favicon-32x32.png resize 32 32
sharp -i public/logo.svg -o public/apple-touch-icon.png resize 180 180
sharp -i public/logo.svg -o public/android-chrome-192x192.png resize 192 192
sharp -i public/logo.svg -o public/android-chrome-512x512.png resize 512 512
```

### Option 3: Use Photoshop/GIMP/Figma
1. Open `/public/logo.svg` in your design tool
2. Export at these sizes:
   - 16x16px → `favicon-16x16.png`
   - 32x32px → `favicon-32x32.png`
   - 180x180px → `apple-touch-icon.png`
   - 192x192px → `android-chrome-192x192.png`
   - 512x512px → `android-chrome-512x512.png`
3. Save to `/public/` folder

## Social Media Images Needed

### Create These Images:

#### 1. og-image.png (1200x630px)
**Purpose**: Facebook, LinkedIn Open Graph image
**Requirements**:
- 1200x630 pixels
- PNG or JPG format
- Include:
  - aqro logo
  - Tagline: "Academic Excellence & Learning Solutions"
  - Brand colors (purple gradient)
  - Clean, professional design

**Template**:
```
┌─────────────────────────────────────┐
│                                     │
│         [aqro Logo]                 │
│                                     │
│   Academic Excellence &             │
│   Learning Solutions                │
│                                     │
│   Transform Your Academic Journey   │
│                                     │
└─────────────────────────────────────┘
```

#### 2. twitter-card.png (1200x600px)
**Purpose**: Twitter Card image
**Requirements**:
- 1200x600 pixels
- PNG or JPG format
- Similar design to og-image but 2:1 ratio

#### 3. screenshot-desktop.png (1920x1080px)
**Purpose**: PWA manifest screenshot
**Action**: Take a screenshot of the desktop homepage

#### 4. screenshot-mobile.png (750x1334px)
**Purpose**: PWA manifest screenshot
**Action**: Take a screenshot of the mobile homepage (iPhone size)

## Quick Setup Script

Create this file as `generate-icons.js` in project root:

```javascript
// Run: node generate-icons.js
const sharp = require('sharp');
const fs = require('fs');

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

async function generateIcons() {
  for (const { size, name } of sizes) {
    await sharp('public/logo.svg')
      .resize(size, size)
      .png()
      .toFile(`public/${name}`);
    console.log(`✓ Generated ${name}`);
  }
}

generateIcons().catch(console.error);
```

Then run:
```bash
npm install sharp
node generate-icons.js
```

## Testing Your Icons

### Browser Testing
1. **Chrome**: Right-click page → Inspect → Application → Manifest
2. **Firefox**: Developer Tools → Storage → Manifest
3. **Safari**: Develop → Show Web Inspector → Storage

### Online Testing
- [Favicon Checker](https://realfavicongenerator.net/favicon_checker)
- [Favicon.io Checker](https://favicon.io/favicon-checker/)

### Mobile Testing
- **iOS**: Add to Home Screen, check icon
- **Android**: Add to Home Screen, check icon

## Logo Usage Guidelines

### Do's ✅
- Use on white or dark backgrounds
- Maintain aspect ratio
- Keep minimum size of 32px for clarity
- Use SVG when possible for scalability

### Don'ts ❌
- Don't distort or stretch
- Don't change brand colors
- Don't add effects or shadows (already included)
- Don't use on busy backgrounds

## Brand Colors
```css
--primary: #8B5CF6;    /* Purple */
--secondary: #6366F1;   /* Indigo */
--accent: #FFD700;      /* Gold */
--background: #0a0a0f;  /* Dark */
```

## File Checklist

Current files:
- [x] logo.svg
- [x] favicon.svg
- [x] site.webmanifest

Need to create:
- [ ] favicon-16x16.png
- [ ] favicon-32x32.png
- [ ] apple-touch-icon.png
- [ ] android-chrome-192x192.png
- [ ] android-chrome-512x512.png
- [ ] og-image.png
- [ ] twitter-card.png
- [ ] screenshot-desktop.png
- [ ] screenshot-mobile.png

## Quick Reference

### HTML References (Already in index.html)
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

### Social Media Meta Tags (Already in index.html)
```html
<meta property="og:image" content="https://aqro.vercel.app/og-image.png" />
<meta name="twitter:image" content="https://aqro.vercel.app/twitter-card.png" />
```

---

**Priority**: High  
**Time Required**: 30-60 minutes  
**Tools Needed**: Image editor or online generator
