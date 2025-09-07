# 🚀 GitHub Pages Deployment Guide

## Quick Start

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `AR-restaurant-menu` (or your preferred name)
3. Make it public (required for free GitHub Pages)

### 2. Update Configuration

**Update `vite.config.ts`:**
```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

**Update `package.json`:**
```json
"homepage": "https://yourusername.github.io/your-repo-name"
```

### 3. Deploy to GitHub

**Option A: Automatic Deployment (Recommended)**

1. **Initialize Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Add Remote:**
   ```bash
   git remote add origin https://github.com/yourusername/AR-restaurant-menu.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository → Settings → Pages
   - Source: "GitHub Actions"
   - The workflow will auto-deploy on every push

**Option B: Manual Deployment**

1. **Build and Deploy:**
   ```bash
   npm run deploy
   ```

2. **Enable GitHub Pages:**
   - Go to repository → Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "gh-pages"

## 🔧 Configuration Details

### Repository Settings

1. **Repository Name:** `AR-restaurant-menu`
2. **Visibility:** Public (for free GitHub Pages)
3. **Branch:** `main` (or `master`)

### GitHub Pages Settings

1. **Source:** GitHub Actions (recommended)
2. **Custom Domain:** Optional
3. **Enforce HTTPS:** ✅ Enabled

### Environment Variables

The build process uses these environment variables:

- `NODE_ENV=production` - Enables production optimizations
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

## 📱 Testing Deployment

### Local Testing

1. **Build locally:**
   ```bash
   npm run build:prod
   ```

2. **Preview build:**
   ```bash
   npm run preview
   ```

3. **Test on different devices:**
   - Desktop browser
   - Mobile browser
   - Different screen sizes

### Production Testing

1. **Check URL:** `https://yourusername.github.io/AR-restaurant-menu`
2. **Test all features:**
   - Menu navigation
   - AR/3D viewer
   - Device detection
   - Mobile camera access

## 🐛 Troubleshooting

### Common Issues

**1. 404 Error on GitHub Pages**
- Check repository name matches `vite.config.ts` base path
- Ensure `homepage` in `package.json` is correct
- Verify GitHub Pages is enabled

**2. Assets Not Loading**
- Check file paths are relative
- Ensure GLB files are in `public/` or `src/assets/`
- Verify build output in `dist/` folder

**3. AR Not Working on Mobile**
- Check HTTPS is enabled (required for camera access)
- Verify device supports WebXR or camera
- Test on different mobile browsers

**4. Build Fails**
- Check Node.js version (18+ recommended)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Debug Steps

1. **Check build logs:**
   ```bash
   npm run build:prod
   ```

2. **Check browser console:**
   - Open DevTools
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Check GitHub Actions:**
   - Go to repository → Actions tab
   - Check workflow run logs

## 🔄 Updating Deployment

### Automatic Updates

Every push to `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Update menu items"
git push origin main
```

### Manual Updates

If using manual deployment:

```bash
npm run deploy
```

## 📊 Performance Optimization

### Build Optimizations

The build includes these optimizations:

- **Code Splitting:** Separate chunks for vendor, three.js, and UI
- **Asset Optimization:** Images and fonts are optimized
- **Tree Shaking:** Unused code is removed
- **Minification:** JavaScript and CSS are minified

### Bundle Analysis

To analyze bundle size:

```bash
npm install --save-dev vite-bundle-analyzer
npx vite-bundle-analyzer dist
```

## 🌐 Custom Domain

### Setup Custom Domain

1. **Add CNAME file:**
   ```
   yourdomain.com
   ```

2. **Update DNS:**
   - Add CNAME record pointing to `yourusername.github.io`

3. **Update GitHub Pages:**
   - Go to repository → Settings → Pages
   - Add custom domain

## 📈 Analytics

### Add Google Analytics

1. **Add to `index.html`:**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Add tracking code:**
   ```javascript
   window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}
   gtag('js', new Date());
   gtag('config', 'GA_MEASUREMENT_ID');
   ```

## 🎯 Success Checklist

- [ ] Repository created and configured
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Site accessible at GitHub Pages URL
- [ ] All features working on desktop
- [ ] All features working on mobile
- [ ] AR functionality working
- [ ] 3D models loading correctly
- [ ] Device detection working
- [ ] HTTPS enabled

## 🆘 Support

If you need help:

1. Check this deployment guide
2. Check GitHub Actions logs
3. Check browser console for errors
4. Create an issue in the repository
5. Check Vite documentation for build issues

## 🎉 Congratulations!

Your AR Restaurant Menu is now live on GitHub Pages! 🚀

**Live URL:** `https://yourusername.github.io/AR-restaurant-menu`
