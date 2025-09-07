# 3D Models Directory

This directory contains GLB (GL Transmission Format Binary) files for AR/3D viewing of menu items.

## File Naming Convention

Please name your GLB files according to the menu items:

### Appetizers
- `bruschetta.glb` - Artisan Bruschetta
- `charcuterie-board.glb` - Charcuterie Board

### Main Courses  
- `beef-tenderloin.glb` - Grilled Beef Tenderloin
- `salmon.glb` - Pan-Seared Salmon

### Desserts
- `tiramisu.glb` - Classic Tiramisu
- `fruit-tart.glb` - Seasonal Fruit Tart

## GLB File Requirements

- **Format**: GLB (GL Transmission Format Binary)
- **Size**: Keep files under 10MB for optimal loading
- **Optimization**: Use tools like gltf-pipeline to optimize models
- **Textures**: Include textures embedded in the GLB file
- **Scale**: Models should be appropriately scaled (1 unit = 1 meter)

## Adding New Models

1. Place your GLB file in this directory
2. Update the `arModel` property in `CategoryDetail.tsx` to point to your file
3. Test the model loads correctly in the AR viewer

## Tools for Creating GLB Files

- **Blender**: Export as GLB format
- **gltf-pipeline**: Command-line tool for optimization
- **Online converters**: Various online tools available

## Example GLB Files

You can find sample GLB files online or create simple test models using Blender.
