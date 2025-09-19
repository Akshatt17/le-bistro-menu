#!/bin/bash

# GLB to USDZ Conversion Script
# This script converts all GLB files in the project to USDZ format

# Set up environment variables
export LD_LIBRARY_PATH=~/USD-build/lib:~/ufg_build/lib
export PATH=$PATH:~/ufg_build/bin

# Create output directory for USDZ files
mkdir -p "/Users/rahul/Desktop/bistro-menu/le-bistro-menu/public/3D models/usdz"

# Find all GLB files and convert them
find "/Users/rahul/Desktop/bistro-menu/le-bistro-menu/public/3D models/glb" -name "*.glb" | while read glb_file; do
    # Get the base name without extension
    base_name=$(basename "$glb_file" .glb)
    
    # Create output path
    usdz_file="/Users/rahul/Desktop/bistro-menu/le-bistro-menu/public/3D models/usdz/${base_name}.usdz"
    
    echo "Converting: $glb_file -> $usdz_file"
    
    # Convert GLB to USDZ using usd_from_gltf
    if ~/ufg_build/bin/usd_from_gltf "$glb_file" "$usdz_file"; then
        echo "✓ Successfully converted: $base_name"
    else
        echo "✗ Failed to convert: $base_name"
    fi
done

echo "Conversion process completed!"
echo "USDZ files are available in: /Users/rahul/Desktop/bistro-menu/le-bistro-menu/public/3D models/usdz/"
