# 🍽️ AR Restaurant Menu

A modern, responsive restaurant menu with AR/3D capabilities for both mobile and desktop devices.

## ✨ Features

- **📱 Mobile AR Support** - Camera-based AR with WebXR support
- **🖥️ Desktop 3D Viewer** - Interactive 3D model viewer with Three.js
- **🎯 Device Detection** - Automatic detection of Android/iOS/Desktop
- **🍴 Menu Categories** - Appetizers, Main Courses, Desserts, Drinks
- **🎮 Interactive Controls** - Touch and mouse controls for 3D models
- **📱 Responsive Design** - Works on all screen sizes

## 🚀 Live Demo

[View Live Demo](https://yourusername.github.io/AR-restaurant-menu)

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - 3D graphics
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **WebXR** - AR capabilities

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AR-restaurant-menu.git

# Navigate to project directory
cd AR-restaurant-menu

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

## 🏗️ Build for Production

```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview
```

## 🚀 Deployment to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source
   - The workflow will automatically deploy on push

### Method 2: Manual Deployment

1. **Build and deploy:**
   ```bash
   npm run deploy
   ```

2. **Enable GitHub Pages:**
   - Go to repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch

## 📱 Device Support

### Mobile (Android/iOS)
- **Camera AR** - Live camera feed with 3D model overlay
- **WebXR Support** - Advanced AR when supported
- **Touch Controls** - Pinch to scale, tap to place

### Desktop
- **3D Viewer** - Interactive Three.js model viewer
- **Mouse Controls** - Rotate, zoom, pan with mouse
- **High Quality** - Shadows, lighting, smooth rendering

## 🎮 Usage

1. **Open the app** in your browser
2. **Navigate** to any menu category
3. **Click** on a menu item
4. **Click** "View in 3D/AR" button
5. **Interact** with the 3D model or AR view

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # UI components
│   ├── ARViewer.tsx        # Main AR viewer
│   ├── Desktop3DViewer.tsx # Desktop 3D viewer
│   └── MobileARViewer.tsx  # Mobile AR viewer
├── pages/
│   ├── CategoryDetail.tsx  # Menu category page
│   └── MenuCategories.tsx  # Menu categories
├── utils/
│   └── deviceDetection.ts  # Device detection utility
├── assets/
│   └── 3D models/          # GLB model files
└── main.tsx
```

## 🔧 Configuration

### Update Repository URL

1. Update `vite.config.ts`:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

2. Update `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```

### Add Custom Domain

1. Add your domain to `CNAME` file in `public/` directory
2. Update GitHub Pages settings to use custom domain

## 📝 Adding 3D Models

1. **Place GLB files** in `public/3D models/glb/`
2. **Update menu items** in `CategoryDetail.tsx`:
   ```typescript
   arModel: "./3D models/glb/your-model.glb"
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Ensure your device supports the required features
3. Try refreshing the page
4. Check the GitHub Issues page

## 🎯 Future Enhancements

- [ ] More 3D model interactions
- [ ] AR marker detection
- [ ] Voice commands
- [ ] Multi-language support
- [ ] Admin panel for menu management