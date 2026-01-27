#!/usr/bin/env node

/**
 * aqro SEO Setup Validator
 * Run this script to check your SEO implementation status
 * 
 * Usage: node seo-validator.js
 */

const fs = require('fs');
const path = require('path');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✅ ${description}`);
    return true;
  } else {
    checks.failed.push(`❌ ${description} - File not found: ${filePath}`);
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(searchString)) {
      checks.passed.push(`✅ ${description}`);
      return true;
    } else {
      checks.warnings.push(`⚠️  ${description} - Content not found in ${filePath}`);
      return false;
    }
  } else {
    checks.failed.push(`❌ ${description} - File not found: ${filePath}`);
    return false;
  }
}

console.log('\n🔍 aqro SEO Implementation Validator\n');
console.log('=' .repeat(50));

// Check core files
console.log('\n📄 Core Files:');
checkFile('public/sitemap.xml', 'Sitemap exists');
checkFile('public/robots.txt', 'Robots.txt exists');
checkFile('public/site.webmanifest', 'Web manifest exists');
checkFile('src/components/SEO.tsx', 'SEO component exists');

// Check logos
console.log('\n🎨 Logo Files:');
checkFile('public/logo.svg', 'Main logo (SVG)');
checkFile('public/favicon.svg', 'Favicon (SVG)');

// Check PNG icons (these need to be generated)
console.log('\n🖼️  PNG Icons (Need to be generated):');
const pngIcons = [
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png'
];

pngIcons.forEach(icon => {
  if (!checkFile(`public/${icon}`, icon)) {
    checks.warnings.push(`⚠️  Run icon generator or use realfavicongenerator.net`);
  }
});

// Check social media images
console.log('\n📱 Social Media Images (Need to be created):');
const socialImages = [
  'og-image.png',
  'twitter-card.png',
  'screenshot-desktop.png',
  'screenshot-mobile.png'
];

socialImages.forEach(img => {
  if (!checkFile(`public/${img}`, img)) {
    checks.warnings.push(`⚠️  Create ${img} for social sharing`);
  }
});

// Check index.html meta tags
console.log('\n🏷️  Meta Tags in index.html:');
checkFileContent('index.html', 'og:title', 'Open Graph title tag');
checkFileContent('index.html', 'twitter:card', 'Twitter Card tag');
checkFileContent('index.html', 'application/ld+json', 'Structured data (JSON-LD)');
checkFileContent('index.html', 'EducationalOrganization', 'Organization schema');

// Check SEO component usage
console.log('\n⚛️  SEO Component Integration:');
checkFileContent('src/pages/Home.tsx', 'import { SEO', 'Home page uses SEO component');

const pages = ['Services', 'Process', 'Pricing', 'Contact', 'ProjectShowcase', 'StartProject'];
pages.forEach(page => {
  const filePath = `src/pages/${page}.tsx`;
  if (fs.existsSync(path.join(__dirname, filePath))) {
    if (!checkFileContent(filePath, 'import { SEO', `${page} page uses SEO component`)) {
      checks.warnings.push(`⚠️  Add SEO component to ${page}.tsx`);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 SUMMARY:\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED CHECKS:');
  checks.passed.forEach(check => console.log(`   ${check}`));
}

if (checks.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS (Optional but recommended):');
  const uniqueWarnings = [...new Set(checks.warnings)];
  uniqueWarnings.forEach(warning => console.log(`   ${warning}`));
}

if (checks.failed.length > 0) {
  console.log('\n❌ FAILED CHECKS (Required):');
  checks.failed.forEach(check => console.log(`   ${check}`));
}

// Score calculation
const totalChecks = checks.passed.length + checks.failed.length;
const score = totalChecks > 0 ? Math.round((checks.passed.length / totalChecks) * 100) : 0;

console.log('\n' + '='.repeat(50));
console.log(`\n🎯 SEO Implementation Score: ${score}%\n`);

if (score === 100) {
  console.log('🎉 Perfect! Your SEO implementation is complete!\n');
} else if (score >= 80) {
  console.log('✨ Great work! Just a few more steps to complete.\n');
} else if (score >= 60) {
  console.log('📈 Good progress! Keep going to improve your SEO.\n');
} else {
  console.log('🚀 Getting started! Follow the guides to complete setup.\n');
}

// Next steps
if (checks.failed.length > 0 || checks.warnings.length > 0) {
  console.log('📋 NEXT STEPS:\n');
  
  if (!fs.existsSync(path.join(__dirname, 'public/favicon-16x16.png'))) {
    console.log('   1. Generate PNG icons:');
    console.log('      → Visit https://realfavicongenerator.net/');
    console.log('      → Upload public/logo.svg');
    console.log('      → Download and extract to public/\n');
  }
  
  if (!fs.existsSync(path.join(__dirname, 'public/og-image.png'))) {
    console.log('   2. Create social media images:');
    console.log('      → og-image.png (1200x630px)');
    console.log('      → twitter-card.png (1200x600px)\n');
  }
  
  const pagesNeedingSEO = pages.filter(page => {
    const filePath = path.join(__dirname, `src/pages/${page}.tsx`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return !content.includes('import { SEO');
    }
    return false;
  });
  
  if (pagesNeedingSEO.length > 0) {
    console.log('   3. Add SEO component to pages:');
    pagesNeedingSEO.forEach(page => {
      console.log(`      → src/pages/${page}.tsx`);
    });
    console.log('');
  }
  
  console.log('   4. Submit sitemaps:');
  console.log('      → Google Search Console');
  console.log('      → Bing Webmaster Tools\n');
  
  console.log('📚 See SEO-SUMMARY.md for detailed instructions.\n');
}

console.log('=' .repeat(50) + '\n');
