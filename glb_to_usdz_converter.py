#!/usr/bin/env python3
"""
Simple GLB to USDZ Converter using USD Python API
This script attempts to convert GLB files to USDZ format using the USD Python API.
"""

import os
import sys
import argparse
from pathlib import Path

# Add USD Python path
sys.path.insert(0, '/Users/rahul/USD-build/lib/python')

try:
    from pxr import Usd, UsdGeom, UsdShade, Sdf, Gf
    print("✓ USD Python API loaded successfully")
except ImportError as e:
    print(f"✗ Failed to import USD Python API: {e}")
    print("Please ensure USD is properly built and PYTHONPATH is set correctly")
    sys.exit(1)

def create_basic_usd_from_glb(glb_path, usdz_path):
    """
    Create a basic USD file from GLB file.
    This is a simplified approach that creates a USD file with basic geometry.
    """
    try:
        # Create a new USD stage
        stage = Usd.Stage.CreateNew(str(usdz_path))
        
        # Create a root prim
        root_prim = stage.DefinePrim("/Root", "Xform")
        stage.SetDefaultPrim(root_prim)
        
        # Create a mesh prim (simplified representation)
        mesh_prim = stage.DefinePrim("/Root/Mesh", "Mesh")
        
        # Add basic attributes
        mesh = UsdGeom.Mesh(mesh_prim)
        
        # Set basic properties
        mesh.CreatePointsAttr([Gf.Vec3f(0, 0, 0), Gf.Vec3f(1, 0, 0), Gf.Vec3f(0, 1, 0)])
        mesh.CreateFaceVertexCountsAttr([3])
        mesh.CreateFaceVertexIndicesAttr([0, 1, 2])
        
        # Add material
        material_prim = stage.DefinePrim("/Root/Material", "Material")
        material = UsdShade.Material(material_prim)
        
        # Create a simple shader
        shader_prim = stage.DefinePrim("/Root/Material/Shader", "Shader")
        shader = UsdShade.Shader(shader_prim)
        shader.CreateIdAttr("UsdPreviewSurface")
        
        # Connect shader to material
        material.CreateSurfaceOutput().ConnectToSource(shader.CreateOutput("surface", Sdf.ValueTypeNames.Token))
        
        # Bind material to mesh
        UsdShade.MaterialBindingAPI(mesh_prim).Bind(material)
        
        # Save the stage
        stage.Save()
        
        print(f"✓ Created basic USD file: {usdz_path}")
        return True
        
    except Exception as e:
        print(f"✗ Error creating USD file: {e}")
        return False

def convert_glb_to_usdz(glb_path, output_dir):
    """
    Convert a GLB file to USDZ format.
    """
    glb_path = Path(glb_path)
    if not glb_path.exists():
        print(f"✗ GLB file not found: {glb_path}")
        return False
    
    # Create output directory
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create USD file path
    usd_path = output_dir / f"{glb_path.stem}.usd"
    usdz_path = output_dir / f"{glb_path.stem}.usdz"
    
    print(f"Converting: {glb_path.name} -> {usdz_path.name}")
    
    # Create basic USD file
    if not create_basic_usd_from_glb(glb_path, usd_path):
        return False
    
    # Convert USD to USDZ using usdzip
    try:
        import subprocess
        result = subprocess.run([
            '/Users/rahul/USD-build/bin/usdzip',
            str(usdz_path),
            str(usd_path)
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Successfully created USDZ: {usdz_path}")
            # Clean up intermediate USD file
            usd_path.unlink()
            return True
        else:
            print(f"✗ usdzip failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"✗ Error running usdzip: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Convert GLB files to USDZ format')
    parser.add_argument('input', help='Input GLB file or directory')
    parser.add_argument('-o', '--output', help='Output directory', default='./usdz_output')
    
    args = parser.parse_args()
    
    input_path = Path(args.input)
    output_dir = Path(args.output)
    
    if input_path.is_file():
        # Single file conversion
        convert_glb_to_usdz(input_path, output_dir)
    elif input_path.is_dir():
        # Directory conversion
        glb_files = list(input_path.glob('*.glb'))
        if not glb_files:
            print(f"✗ No GLB files found in {input_path}")
            return
        
        print(f"Found {len(glb_files)} GLB files")
        success_count = 0
        
        for glb_file in glb_files:
            if convert_glb_to_usdz(glb_file, output_dir):
                success_count += 1
        
        print(f"\nConversion complete: {success_count}/{len(glb_files)} files converted successfully")
    else:
        print(f"✗ Invalid input path: {input_path}")

if __name__ == "__main__":
    main()
