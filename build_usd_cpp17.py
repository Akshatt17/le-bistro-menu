#!/usr/bin/env python3
"""
Custom USD build script with C++17 support
"""
import os
import sys
import subprocess

def build_usd_with_cpp17():
    """Build USD with C++17 support"""
    
    # Set environment variables for C++17
    env = os.environ.copy()
    env['CXXFLAGS'] = '-std=c++17'
    env['CXX'] = 'clang++ -std=c++17'
    
    # USD build directory
    usd_build_dir = os.path.expanduser('~/USD-build')
    
    # Remove existing build if it exists
    if os.path.exists(usd_build_dir):
        print("Removing existing USD build directory...")
        subprocess.run(['rm', '-rf', usd_build_dir], check=True)
    
    # USD source directory
    usd_src_dir = os.path.expanduser('~/USD')
    
    # Build USD with C++17
    cmd = [
        'python3', 
        os.path.join(usd_src_dir, 'build_scripts', 'build_usd.py'),
        usd_build_dir,
        '--no-tests',
        '--no-examples', 
        '--no-tutorials',
        '--no-docs',
        '--no-python-docs',
        '--no-usdview',
        '--no-imaging',
        '--no-openvdb',
        '--no-ptex',
        '--no-vulkan',
        '--no-embree',
        '--no-prman',
        '--no-openimageio',
        '--no-opencolorio',
        '--no-alembic',
        '--no-draco',
        '--no-materialx',
        '--force-all'
    ]
    
    print("Building USD with C++17 support...")
    print(f"Command: {' '.join(cmd)}")
    
    try:
        subprocess.run(cmd, env=env, check=True)
        print("USD build completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"USD build failed with error: {e}")
        return False

if __name__ == '__main__':
    success = build_usd_with_cpp17()
    sys.exit(0 if success else 1)
