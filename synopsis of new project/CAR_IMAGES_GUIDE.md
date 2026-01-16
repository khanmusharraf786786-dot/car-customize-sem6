# Car Images Setup Guide

## Overview
The 3D car viewer uses realistic, generic, non-branded car images for 360-degree rotation. This guide explains how to add your own car images.

## Image Requirements

### Format
- **Recommended**: Equirectangular (360-degree panorama) images
- **Dimensions**: 2048x1024 pixels or higher (2:1 aspect ratio)
- **Format**: JPG or PNG
- **File Size**: Optimize for web (under 2MB recommended)

### Content Requirements
- **Generic/Non-branded**: No visible logos, brand names, or trademarks
- **Realistic**: High-quality car photos or AI-generated images
- **360-degree**: Full rotation view of the car
- **Consistent Lighting**: Similar lighting conditions across all colors/models

## Image Sources

### Free Resources

1. **3DRealCar Dataset** (Apache-2.0 License)
   - Large dataset with 360-degree car views
   - ~200 views per car, ~2,500 cars
   - Download: https://github.com/xiaobiaodu/3DRealCar_Dataset
   - License: Apache-2.0 (commercial use allowed)

2. **AI-Generated Car Images**
   - **Pixelcut AI**: https://www.pixelcut.ai/create/car-generator
   - **NanoImg AI**: https://nanoimg.io/ai-car-generator
   - Generate generic, non-branded car images
   - Free tier available for testing

3. **Free Stock Photos**
   - **Unsplash**: https://unsplash.com/s/photos/car
   - **Pexels**: https://www.pexels.com/search/car/
   - **Pixabay**: https://pixabay.com/images/search/car/
   - Note: Most are single-angle, not 360-degree

4. **Create Your Own**
   - Use 3D modeling software (Blender, etc.)
   - Render 360-degree equirectangular images
   - Use AI image generation tools

## File Structure

### Recommended Folder Structure
```
project/
├── images/
│   └── cars/
│       ├── sedan-basic-white-360.jpg
│       ├── sedan-basic-black-360.jpg
│       ├── sedan-basic-red-360.jpg
│       ├── sedan-basic-blue-360.jpg
│       ├── sedan-basic-silver-360.jpg
│       ├── sedan-premium-white-360.jpg
│       ├── suv-basic-white-360.jpg
│       └── sports-basic-white-360.jpg
```

### Naming Convention
Format: `{carModel}-{color}-360.{extension}`

Examples:
- `sedan-basic-white-360.jpg`
- `suv-premium-black-360.jpg`
- `sports-basic-red-360.png`

## Implementation

### Option 1: Local Images (Recommended)

1. Create `images/cars/` folder in your project
2. Add 360-degree car images with proper naming
3. Update `getFreeCarImageUrl()` in `car3d-viewer.js`:

```javascript
getFreeCarImageUrl(carModel, color) {
    // Use local images
    return `images/cars/${carModel}-${color}-360.jpg`;
}
```

### Option 2: Online Image URLs

Update `getFreeCarImageUrl()` with your image URLs:

```javascript
getFreeCarImageUrl(carModel, color) {
    const imageUrls = {
        'sedan-basic-white': 'https://your-domain.com/images/sedan-white-360.jpg',
        'sedan-basic-black': 'https://your-domain.com/images/sedan-black-360.jpg',
        // ... more combinations
    };
    
    const key = `${carModel}-${color}`;
    return imageUrls[key] || imageUrls['sedan-basic-white'];
}
```

### Option 3: CDN or Image Service

Use a CDN or image hosting service:

```javascript
getFreeCarImageUrl(carModel, color) {
    const cdnBase = 'https://your-cdn.com/cars/';
    return `${cdnBase}${carModel}-${color}-360.jpg`;
}
```

## Creating 360-Degree Images

### Method 1: 3D Rendering
1. Create/import 3D car model in Blender or similar
2. Set up camera for equirectangular rendering
3. Render 360-degree panorama
4. Export as equirectangular image (2:1 aspect ratio)

### Method 2: Photo Stitching
1. Take multiple photos around the car (every 10-15 degrees)
2. Use panorama stitching software (PTGui, Hugin)
3. Stitch into equirectangular format
4. Ensure consistent lighting

### Method 3: AI Generation
1. Use AI tools to generate car images
2. Use image editing to create 360-degree versions
3. Or use AI tools that support 360-degree generation

## Testing

1. **Load Test**: Check if images load correctly
2. **Rotation Test**: Verify 360-degree rotation works smoothly
3. **Color Test**: Ensure all color variations display correctly
4. **Performance Test**: Check loading time and frame rate

## Troubleshooting

### Images Not Loading
- Check file paths are correct
- Verify image files exist
- Check browser console for errors
- Ensure CORS headers if using external URLs

### Distorted Images
- Verify images are equirectangular format
- Check aspect ratio is 2:1 (width:height)
- Ensure proper mapping in Three.js

### Performance Issues
- Optimize image file sizes
- Use compressed formats (JPG for photos)
- Consider lower resolution for mobile
- Implement image caching

## License Considerations

When using free images:
- **Check License**: Ensure commercial use is allowed
- **Attribution**: Some licenses require attribution
- **No Branding**: Remove any visible logos/branding
- **Generic Models**: Use generic car designs

## Example Implementation

```javascript
// In car3d-viewer.js
getFreeCarImageUrl(carModel, color) {
    // Priority: Local images first
    const localPath = `images/cars/${carModel}-${color}-360.jpg`;
    
    // Fallback to CDN
    const cdnPath = `https://cdn.example.com/cars/${carModel}-${color}-360.jpg`;
    
    // Final fallback to placeholder
    const placeholder = `https://via.placeholder.com/2048x1024/cccccc/666666?text=${carModel}+${color}`;
    
    // Try local first, then CDN, then placeholder
    return localPath; // Or implement fallback logic
}
```

## Resources

- **Three.js Texture Loading**: https://threejs.org/docs/#api/en/loaders/TextureLoader
- **Equirectangular Mapping**: https://en.wikipedia.org/wiki/Equirectangular_projection
- **Free Car Images**: See sources listed above
- **Image Optimization**: Use tools like TinyPNG, ImageOptim

---

**Note**: For production, always use optimized, properly licensed images. Test thoroughly across different browsers and devices.
