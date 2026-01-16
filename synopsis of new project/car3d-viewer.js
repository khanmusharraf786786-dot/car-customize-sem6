/* ============================================
   3D Car Viewer - Advanced Customization System
   Features: Real-time updates, Layer-based rendering,
   Interior preview, Accessories overlay, 360° rotation,
   Mouse + touch drag, Smooth inertia animation
   ============================================ */

/**
 * Car3DViewer Class
 * Manages the 3D car visualization with all advanced features
 */
class Car3DViewer {
    constructor(canvasId) {
        // Get the canvas element from the DOM
        this.canvas = document.getElementById(canvasId);
        
        // Check if canvas exists
        if (!this.canvas) {
            console.error('Canvas element not found:', canvasId);
            return;
        }
        
        // Initialize Three.js scene components
        this.scene = null;           // 3D scene containing all objects
        this.camera = null;           // Camera viewing the scene
        this.renderer = null;         // Renders the scene to canvas
        this.carGroup = null;         // Group containing all car parts
        
        // Layer system for different car parts
        // Each layer can be updated independently for real-time customization
        this.layers = {
            body: null,              // Car body (exterior)
            wheels: null,            // Wheel group
            interior: null,          // Interior components
            accessories: {}         // Individual accessories (sunroof, etc.)
        };
        
        // Rotation control variables
        this.rotationX = 0;          // Vertical rotation angle
        this.rotationY = 0;          // Horizontal rotation angle (360°)
        this.targetRotationY = 0;   // Target rotation for smooth animation
        this.isDragging = false;    // Whether user is currently dragging
        this.lastMouseX = 0;        // Last mouse X position for drag calculation
        this.lastMouseY = 0;        // Last mouse Y position for drag calculation
        
        // Touch control variables
        this.touchStartX = 0;       // Touch start X position
        this.touchStartY = 0;       // Touch start Y position
        this.lastTouchX = 0;        // Last touch X position
        this.lastTouchY = 0;        // Last touch Y position
        
        // Inertia animation variables
        this.velocityY = 0;        // Rotation velocity for smooth inertia
        this.friction = 0.95;      // Friction coefficient (0.95 = 5% slowdown per frame)
        this.minVelocity = 0.01;    // Minimum velocity to stop animation
        
        // Current customization state
        this.currentColor = 'white';
        this.currentWheels = 'standard';
        this.currentInterior = 'fabric';
        this.currentAccessories = [];
        this.currentView = 'exterior'; // 'exterior' or 'interior'
        this.currentCarModel = 'sedan-basic';
        
        // Image loading state
        this.textureLoader = new THREE.TextureLoader();
        this.loadedTextures = {}; // Cache for loaded textures
        
        // Initialize the 3D scene
        this.init();
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Initialize Three.js scene, camera, and renderer
     */
    init() {
        // Create a new Three.js scene
        // Scene is like a container that holds all 3D objects
        this.scene = new THREE.Scene();
        
        // Set scene background color (light gray)
        this.scene.background = new THREE.Color(0xf5f5f5);
        
        // Create perspective camera
        // Parameters: field of view (75°), aspect ratio, near plane, far plane
        // Field of view: how wide the camera sees (75 degrees)
        // Aspect ratio: width/height of canvas
        // Near/far: objects closer than 0.1 or farther than 1000 won't be rendered
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        
        // Position the camera to view the car
        // X, Y, Z coordinates (Y is up, Z is forward/backward)
        // Position camera at center for sphere-based 360° image viewing
        // Camera is inside the sphere to view equirectangular mapped images
        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(0, 0, -1); // Look forward (negative Z)
        
        // Create WebGL renderer
        // WebGL is a JavaScript API for rendering 3D graphics
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,  // Smooth edges
            alpha: true       // Transparent background option
        });
        
        // Set renderer size to match canvas
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio); // High DPI support
        
        // Add lighting to the scene
        // Without lights, objects would be completely dark
        this.setupLighting();
        
        // Create the car model with layers
        this.createCarModel();
        
        // Setup event listeners for mouse and touch controls
        this.setupControls();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    /**
     * Setup lighting for the 3D scene
     * For image-based rendering, we use ambient light to evenly illuminate textures
     */
    setupLighting() {
        // Ambient light - soft overall illumination for image-based rendering
        // Higher intensity ensures images are well-lit without harsh shadows
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);
        
        // Optional: Add subtle directional light for slight depth
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);
    }
    
    /**
     * Get car image URL based on model and color
     * Returns URL for 360-degree equirectangular car image
     * Uses free, generic, non-branded car images
     */
    getCarImageUrl(carModel, color) {
        // Base URLs for free car images
        // These can be replaced with actual 360-degree car image URLs
        // Format: equirectangular panorama images work best for 360° rotation
        
        // Using free image sources with generic car images
        // Option 1: Use placeholder service with car images
        // Option 2: Use free stock photo APIs
        // Option 3: Use local images in /images/cars/ folder
        
        // For now, using a structure that supports multiple image sources
        const imageBase = 'https://images.unsplash.com/photo-';
        
        // Map of car model + color combinations to image IDs
        // These are example IDs - replace with actual free car image IDs
        const imageMap = {
            'sedan-basic-white': '1492143814842-5861a87d3190', // Generic sedan white
            'sedan-basic-black': '1492143814842-5861a87d3190', // Generic sedan black
            'sedan-basic-red': '1492143814842-5861a87d3190',   // Generic sedan red
            'sedan-basic-blue': '1492143814842-5861a87d3190',  // Generic sedan blue
            'sedan-basic-silver': '1492143814842-5861a87d3190', // Generic sedan silver
            'sedan-premium-white': '1492143814842-5861a87d3190',
            'suv-basic-white': '1492143814842-5861a87d3190',
            'sports-basic-white': '1492143814842-5861a87d3190',
        };
        
        const key = `${carModel}-${color}`;
        const imageId = imageMap[key] || imageMap['sedan-basic-white'];
        
        // Return full URL - for 360 images, use equirectangular format
        // For regular images, we'll use a sphere mapping approach
        return `${imageBase}${imageId}?w=2048&h=1024&fit=crop`;
    }
    
    /**
     * Get free generic car image URL
     * Uses multiple free image sources as fallbacks
     */
    getFreeCarImageUrl(carModel, color) {
        // Priority list of free image sources
        // These provide generic, non-branded car images
        
        // Option 1: Use local images (recommended for production)
        // Place 360-degree car images in /images/cars/ folder
        // Format: {carModel}-{color}-360.jpg (equirectangular)
        const localPath = `images/cars/${carModel}-${color}-360.jpg`;
        
        // Option 2: Use free stock photo services
        // Pixabay, Pexels, Unsplash provide free car images
        // Note: Most free images are not 360-degree, so we'll use multi-angle approach
        
        // Option 3: Use AI-generated car images (free tier available)
        // Services like Pixelcut, NanoImg provide free AI car images
        
        // For demonstration, using free car images
        // These are generic, non-branded car images from free sources
        // Replace with your own 360-degree car images for best results
        
        // Free car image URLs (generic, non-branded)
        // Using Unsplash as example - replace with your own images
        const freeImageUrls = {
            'white': 'https://images.unsplash.com/photo-1492143814842-5861a87d3190?w=2048&h=1024&fit=crop&q=80',
            'black': 'https://images.unsplash.com/photo-1492143814842-5861a87d3190?w=2048&h=1024&fit=crop&q=80',
            'red': 'https://images.unsplash.com/photo-1492143814842-5861a87d3190?w=2048&h=1024&fit=crop&q=80',
            'blue': 'https://images.unsplash.com/photo-1492143814842-5861a87d3190?w=2048&h=1024&fit=crop&q=80',
            'silver': 'https://images.unsplash.com/photo-1492143814842-5861a87d3190?w=2048&h=1024&fit=crop&q=80'
        };
        
        // Priority: Try local images first (recommended for production)
        // Uncomment the line below and add your images to /images/cars/ folder
        // return localPath;
        
        // Fallback: Use free online sources
        return freeImageUrls[color] || freeImageUrls['white'];
    }
    
    /**
     * Create the 3D car model with layer-based structure
     * Each part (body, wheels, interior, accessories) is a separate layer
     */
    createCarModel() {
        // Create a group to hold all car parts
        // Groups allow us to rotate/transform all parts together
        this.carGroup = new THREE.Group();
        
        // Create car body layer
        this.createBodyLayer();
        
        // Create wheels layer
        this.createWheelsLayer();
        
        // Create interior layer (initially hidden)
        this.createInteriorLayer();
        
        // Add the car group to the scene
        this.scene.add(this.carGroup);
    }
    
    /**
     * Create the car body layer using realistic car images
     * Uses 360-degree equirectangular images mapped to a sphere for rotation
     */
    createBodyLayer() {
        // Create a group for the body layer
        this.layers.body = new THREE.Group();
        
        // Create a sphere geometry for 360-degree image mapping
        // This allows us to map equirectangular (360°) car images
        // Parameters: radius, width segments, height segments
        // Higher segments = smoother sphere but more performance cost
        const sphereGeometry = new THREE.SphereGeometry(3, 64, 32);
        
        // Get the car image URL based on current model and color
        const imageUrl = this.getFreeCarImageUrl(this.currentCarModel, this.currentColor);
        
        // Create texture from car image
        // The texture loader will load the image asynchronously
        const texture = this.textureLoader.load(
            imageUrl,
            // On load callback - image successfully loaded
            (texture) => {
                // Configure texture for proper mapping
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                
                // Update material with loaded texture
                if (this.layers.body && this.layers.body.children[0]) {
                    this.layers.body.children[0].material.map = texture;
                    this.layers.body.children[0].material.needsUpdate = true;
                }
            },
            // On progress callback (optional)
            undefined,
            // On error callback
            (error) => {
                console.warn('Failed to load car image, using fallback:', error);
                // Fallback to colored material if image fails to load
                this.createBodyLayerFallback();
            }
        );
        
        // Create material with texture
        // MeshBasicMaterial doesn't require lighting, perfect for image-based rendering
        const bodyMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide // Render both inside and outside of sphere
        });
        
        // Create mesh (sphere geometry + texture material = realistic car image)
        const bodyMesh = new THREE.Mesh(sphereGeometry, bodyMaterial);
        bodyMesh.position.set(0, 0, 0); // Center the sphere
        bodyMesh.name = 'carBody';
        
        // Flip the sphere inside-out so we see the image from inside
        // This is necessary for equirectangular mapping when camera is inside
        bodyMesh.scale.x = -1;
        
        // Add body to body layer
        this.layers.body.add(bodyMesh);
        
        // Add body layer to car group
        this.carGroup.add(this.layers.body);
    }
    
    /**
     * Fallback method if image fails to load
     * Creates a simple colored sphere as backup
     */
    createBodyLayerFallback() {
        if (!this.layers.body || this.layers.body.children.length === 0) return;
        
        const bodyMesh = this.layers.body.children[0];
        if (bodyMesh && bodyMesh.material) {
            // Replace with simple colored material
            bodyMesh.material = new THREE.MeshBasicMaterial({
                color: this.getColorHex(this.currentColor),
                side: THREE.DoubleSide
            });
        }
    }
    
    /**
     * Create the wheels layer
     * Four wheels positioned around the car
     */
    createWheelsLayer() {
        // Create a group for all wheels
        this.layers.wheels = new THREE.Group();
        
        // Wheel positions (front-left, front-right, back-left, back-right)
        const wheelPositions = [
            { x: -1.2, z: 1.2 },   // Front left
            { x: 1.2, z: 1.2 },    // Front right
            { x: -1.2, z: -1.2 },  // Back left
            { x: 1.2, z: -1.2 }    // Back right
        ];
        
        // Create four wheels
        wheelPositions.forEach((pos, index) => {
            // Create wheel geometry (cylinder)
            // Parameters: radius top, radius bottom, height, segments
            const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
            
            // Create wheel material based on current wheel selection
            const wheelMaterial = new THREE.MeshStandardMaterial({
                color: this.getWheelColor(this.currentWheels),
                metalness: 0.8,
                roughness: 0.1
            });
            
            // Create wheel mesh
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            
            // Rotate wheel 90 degrees to lay flat (cylinder is vertical by default)
            wheel.rotation.z = Math.PI / 2;
            
            // Position wheel
            wheel.position.set(pos.x, 0.3, pos.z);
            wheel.name = `wheel_${index}`;
            
            // Add wheel to wheels layer
            this.layers.wheels.add(wheel);
        });
        
        // Add wheels layer to car group
        this.carGroup.add(this.layers.wheels);
    }
    
    /**
     * Create the interior layer
     * This shows the car's interior when interior view is selected
     */
    createInteriorLayer() {
        // Create a group for interior components
        this.layers.interior = new THREE.Group();
        
        // Create seats (simplified as boxes)
        const seatGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.8);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: this.getInteriorColor(this.currentInterior),
            roughness: 0.8
        });
        
        // Front seats
        const frontSeat1 = new THREE.Mesh(seatGeometry, seatMaterial);
        frontSeat1.position.set(-0.4, 0.6, 0.8);
        this.layers.interior.add(frontSeat1);
        
        const frontSeat2 = new THREE.Mesh(seatGeometry, seatMaterial);
        frontSeat2.position.set(0.4, 0.6, 0.8);
        this.layers.interior.add(frontSeat2);
        
        // Back seats
        const backSeat = new THREE.Mesh(seatGeometry, seatMaterial);
        backSeat.scale.set(2, 1, 1);
        backSeat.position.set(0, 0.6, -0.8);
        this.layers.interior.add(backSeat);
        
        // Dashboard
        const dashboardGeometry = new THREE.BoxGeometry(1.8, 0.2, 0.3);
        const dashboard = new THREE.Mesh(dashboardGeometry, seatMaterial);
        dashboard.position.set(0, 0.9, 1.5);
        this.layers.interior.add(dashboard);
        
        // Initially hide interior (only show in interior view)
        this.layers.interior.visible = false;
        
        // Add interior layer to car group
        this.carGroup.add(this.layers.interior);
    }
    
    /**
     * Setup mouse and touch controls for rotation
     */
    setupControls() {
        // ===== MOUSE CONTROLS =====
        
        // Mouse down - start dragging
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.velocityY = 0; // Stop inertia when user starts dragging
            this.canvas.style.cursor = 'grabbing';
        });
        
        // Mouse move - rotate while dragging
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                // Calculate rotation delta (change in position)
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                // Update rotation angles
                // Horizontal rotation (Y-axis) - 360° rotation
                this.rotationY += deltaX * 0.01; // 0.01 is rotation sensitivity
                this.targetRotationY = this.rotationY;
                
                // Vertical rotation (X-axis) - limit to prevent flipping
                this.rotationX += deltaY * 0.01;
                this.rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.rotationX));
                
                // Update last position
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            }
        });
        
        // Mouse up - stop dragging
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        
        // Mouse leave - stop dragging if mouse leaves canvas
        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        
        // ===== TOUCH CONTROLS =====
        
        // Touch start
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            const touch = e.touches[0];
            this.isDragging = true;
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
            this.velocityY = 0;
        });
        
        // Touch move
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
            if (this.isDragging && e.touches.length === 1) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.lastTouchX;
                const deltaY = touch.clientY - this.lastTouchY;
                
                // Update rotation
                this.rotationY += deltaX * 0.01;
                this.targetRotationY = this.rotationY;
                
                this.rotationX += deltaY * 0.01;
                this.rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.rotationX));
                
                this.lastTouchX = touch.clientX;
                this.lastTouchY = touch.clientY;
            }
        });
        
        // Touch end
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (e.touches.length === 0) {
                this.isDragging = false;
            }
        });
        
        // Set initial cursor style
        this.canvas.style.cursor = 'grab';
    }
    
    /**
     * Animation loop - runs continuously to update and render the scene
     * This is where smooth inertia animation happens
     */
    animate() {
        // Request next animation frame
        // This creates a smooth 60fps animation loop
        requestAnimationFrame(() => this.animate());
        
        // Apply smooth inertia animation when not dragging
        if (!this.isDragging) {
            // Calculate velocity based on difference between current and target rotation
            const rotationDiff = this.targetRotationY - this.rotationY;
            this.velocityY = rotationDiff * 0.1; // Smooth interpolation factor
            
            // Apply velocity to rotation
            this.rotationY += this.velocityY;
            
            // Apply friction to gradually slow down
            this.velocityY *= this.friction;
            
            // Stop animation if velocity is very small
            if (Math.abs(this.velocityY) < this.minVelocity) {
                this.velocityY = 0;
                // Snap to target rotation when almost stopped
                this.rotationY = this.targetRotationY;
            }
        }
        
        // Apply rotation to car group
        // This rotates the entire car model
        this.carGroup.rotation.y = this.rotationY;
        this.carGroup.rotation.x = this.rotationX;
        
        // Render the scene
        // This draws everything to the canvas
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Update car color in real-time
     * Loads new car image for the selected color
     * @param {string} color - Color name (white, black, red, blue, silver)
     */
    updateColor(color) {
        this.currentColor = color;
        
        // Get new image URL for the selected color
        const imageUrl = this.getFreeCarImageUrl(this.currentCarModel, color);
        
        // Check if texture is already cached
        const cacheKey = `${this.currentCarModel}-${color}`;
        if (this.loadedTextures[cacheKey]) {
            // Use cached texture
            this.applyTextureToBody(this.loadedTextures[cacheKey]);
            return;
        }
        
        // Load new texture
        const texture = this.textureLoader.load(
            imageUrl,
            (loadedTexture) => {
                // Configure texture
                loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
                loadedTexture.wrapS = THREE.RepeatWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                
                // Cache the texture
                this.loadedTextures[cacheKey] = loadedTexture;
                
                // Apply to body
                this.applyTextureToBody(loadedTexture);
            },
            undefined,
            (error) => {
                console.warn('Failed to load car image for color:', color, error);
                // Fallback to colored material
                this.updateColorFallback(color);
            }
        );
    }
    
    /**
     * Apply texture to car body mesh
     * @param {THREE.Texture} texture - The texture to apply
     */
    applyTextureToBody(texture) {
        this.layers.body.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name === 'carBody') {
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    }
    
    /**
     * Fallback color update if image fails to load
     * @param {string} color - Color name
     */
    updateColorFallback(color) {
        this.layers.body.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name === 'carBody') {
                child.material = new THREE.MeshBasicMaterial({
                    color: this.getColorHex(color),
                    side: THREE.DoubleSide
                });
            }
        });
    }
    
    /**
     * Update car model
     * @param {string} carModel - Car model identifier
     */
    updateCarModel(carModel) {
        this.currentCarModel = carModel;
        // Reload body with new model's image
        this.updateColor(this.currentColor);
    }
    
    /**
     * Update wheels in real-time
     * @param {string} wheelType - Wheel type (standard, alloy, chrome, sport, luxury)
     */
    updateWheels(wheelType) {
        this.currentWheels = wheelType;
        
        // Update all wheels
        this.layers.wheels.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name.startsWith('wheel_')) {
                child.material.color.setHex(this.getWheelColor(wheelType));
            }
        });
    }
    
    /**
     * Update interior in real-time
     * @param {string} interiorType - Interior type (fabric, leather, premium-leather, sport)
     */
    updateInterior(interiorType) {
        this.currentInterior = interiorType;
        
        // Update all interior components
        this.layers.interior.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.color.setHex(this.getInteriorColor(interiorType));
            }
        });
    }
    
    /**
     * Add or remove accessories overlay
     * @param {string} accessory - Accessory name
     * @param {boolean} add - Whether to add or remove
     */
    updateAccessory(accessory, add) {
        if (add) {
            // Add accessory if not already present
            if (!this.currentAccessories.includes(accessory)) {
                this.currentAccessories.push(accessory);
            }
        } else {
            // Remove accessory
            this.currentAccessories = this.currentAccessories.filter(a => a !== accessory);
        }
        
        // Update accessories overlay
        this.updateAccessoriesOverlay();
    }
    
    /**
     * Update accessories overlay on the car
     */
    updateAccessoriesOverlay() {
        // Remove existing accessories
        Object.keys(this.layers.accessories).forEach(key => {
            if (this.layers.accessories[key]) {
                this.carGroup.remove(this.layers.accessories[key]);
                delete this.layers.accessories[key];
            }
        });
        
        // Add selected accessories
        this.currentAccessories.forEach(accessory => {
            this.createAccessoryOverlay(accessory);
        });
    }
    
    /**
     * Create visual overlay for an accessory
     * @param {string} accessory - Accessory name
     */
    createAccessoryOverlay(accessory) {
        const accessoryGroup = new THREE.Group();
        
        switch(accessory) {
            case 'sunroof':
                // Create sunroof as a transparent rectangle on top of car
                const sunroofGeometry = new THREE.PlaneGeometry(0.8, 0.6);
                const sunroofMaterial = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                const sunroof = new THREE.Mesh(sunroofGeometry, sunroofMaterial);
                sunroof.rotation.x = -Math.PI / 2;
                sunroof.position.set(0, 1.1, 0);
                accessoryGroup.add(sunroof);
                break;
                
            case 'led-lights':
                // Create LED headlights
                const lightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                const lightMaterial = new THREE.MeshStandardMaterial({
                    color: 0x00ffff,
                    emissive: 0x00ffff,
                    emissiveIntensity: 0.5
                });
                
                // Left headlight
                const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
                leftLight.position.set(-0.6, 0.7, 1.8);
                accessoryGroup.add(leftLight);
                
                // Right headlight
                const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
                rightLight.position.set(0.6, 0.7, 1.8);
                accessoryGroup.add(rightLight);
                break;
                
            // Add more accessories as needed
        }
        
        if (accessoryGroup.children.length > 0) {
            this.layers.accessories[accessory] = accessoryGroup;
            this.carGroup.add(accessoryGroup);
        }
    }
    
    /**
     * Toggle between exterior and interior view
     * @param {string} view - 'exterior' or 'interior'
     */
    setView(view) {
        this.currentView = view;
        
        if (view === 'interior') {
            // Show interior, hide body
            this.layers.interior.visible = true;
            this.layers.body.visible = false;
            this.layers.wheels.visible = false;
            
            // Adjust camera for interior view (inside the sphere)
            // Position camera at center for interior 360 view
            this.camera.position.set(0, 0, 0);
        } else {
            // Show exterior, hide interior
            this.layers.interior.visible = false;
            this.layers.body.visible = true;
            this.layers.wheels.visible = true;
            
            // Position camera outside sphere for exterior view
            // Camera is positioned to view the car from outside
            this.camera.position.set(0, 0, 0.1); // Very close to center, looking outward
        }
        
        this.camera.lookAt(0, 0, 0);
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        // Update camera aspect ratio
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
    
    /**
     * Convert color name to hex value
     * @param {string} colorName - Color name
     * @returns {number} Hex color value
     */
    getColorHex(colorName) {
        const colors = {
            'white': 0xffffff,
            'black': 0x000000,
            'red': 0xdc3545,
            'blue': 0x007bff,
            'silver': 0xc0c0c0
        };
        return colors[colorName] || 0xffffff;
    }
    
    /**
     * Get wheel color based on wheel type
     * @param {string} wheelType - Wheel type
     * @returns {number} Hex color value
     */
    getWheelColor(wheelType) {
        const colors = {
            'standard': 0x333333,
            'alloy': 0x888888,
            'chrome': 0xcccccc,
            'sport': 0x000000,
            'luxury': 0x444444
        };
        return colors[wheelType] || 0x333333;
    }
    
    /**
     * Get interior color based on interior type
     * @param {string} interiorType - Interior type
     * @returns {number} Hex color value
     */
    getInteriorColor(interiorType) {
        const colors = {
            'fabric': 0x8b4513,
            'leather': 0x2c1810,
            'premium-leather': 0x1a0f0a,
            'sport': 0x000000
        };
        return colors[interiorType] || 0x8b4513;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Car3DViewer;
}
