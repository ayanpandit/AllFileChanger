#!/usr/bin/env python3
"""
Test script for Image to PDF Backend
Verifies all endpoints and functionality
"""

import requests
import sys
from pathlib import Path
from PIL import Image
import io

# Configuration
BASE_URL = 'http://localhost:5005'

def create_test_image(filename, size=(800, 600), color='red'):
    """Create a test image"""
    img = Image.new('RGB', size, color=color)
    img.save(filename, 'JPEG')
    return filename

def test_health_check():
    """Test health endpoint"""
    print("\n🔍 Testing health check...")
    try:
        response = requests.get(f'{BASE_URL}/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_image_to_pdf():
    """Test image to PDF conversion"""
    print("\n📄 Testing image to PDF conversion...")
    try:
        # Create test images
        test_dir = Path('test_images')
        test_dir.mkdir(exist_ok=True)
        
        img1 = create_test_image(test_dir / 'test1.jpg', color='red')
        img2 = create_test_image(test_dir / 'test2.jpg', color='blue')
        
        # Upload images
        files = [
            ('images', open(img1, 'rb')),
            ('images', open(img2, 'rb'))
        ]
        
        response = requests.post(
            f'{BASE_URL}/image-to-pdf',
            files=files,
            timeout=30
        )
        
        # Close file handles
        for _, f in files:
            f.close()
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Conversion successful: {data}")
            
            # Test download
            session_id = data['sessionId']
            return test_download(session_id)
        else:
            print(f"❌ Conversion failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Conversion error: {e}")
        return False

def test_download(session_id):
    """Test PDF download"""
    print(f"\n⬇️  Testing PDF download for session {session_id[:16]}...")
    try:
        response = requests.get(
            f'{BASE_URL}/download/{session_id}',
            timeout=30
        )
        
        if response.status_code == 200:
            # Save PDF
            output_file = 'test_output.pdf'
            with open(output_file, 'wb') as f:
                f.write(response.content)
            
            file_size = len(response.content)
            print(f"✅ Download successful: {output_file} ({file_size} bytes)")
            return True
        else:
            print(f"❌ Download failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Download error: {e}")
        return False

def test_invalid_session():
    """Test invalid session handling"""
    print("\n🚫 Testing invalid session...")
    try:
        response = requests.get(
            f'{BASE_URL}/download/invalid-session-id',
            timeout=5
        )
        
        if response.status_code == 404:
            print("✅ Invalid session correctly rejected")
            return True
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_no_images():
    """Test request with no images"""
    print("\n❌ Testing request with no images...")
    try:
        response = requests.post(
            f'{BASE_URL}/image-to-pdf',
            files=[],
            timeout=5
        )
        
        if response.status_code == 400:
            print("✅ No images request correctly rejected")
            return True
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def cleanup():
    """Clean up test files"""
    print("\n🧹 Cleaning up test files...")
    import shutil
    try:
        if Path('test_images').exists():
            shutil.rmtree('test_images')
        if Path('test_output.pdf').exists():
            Path('test_output.pdf').unlink()
        print("✅ Cleanup complete")
    except Exception as e:
        print(f"⚠️  Cleanup warning: {e}")

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 Image to PDF Backend Test Suite")
    print("=" * 60)
    print(f"📍 Testing: {BASE_URL}")
    
    results = {
        'Health Check': test_health_check(),
        'Image to PDF Conversion': test_image_to_pdf(),
        'Invalid Session': test_invalid_session(),
        'No Images Request': test_no_images(),
    }
    
    cleanup()
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total = len(results)
    passed = sum(results.values())
    
    print("=" * 60)
    print(f"🎯 Total: {passed}/{total} tests passed")
    print("=" * 60)
    
    sys.exit(0 if passed == total else 1)

if __name__ == '__main__':
    main()
