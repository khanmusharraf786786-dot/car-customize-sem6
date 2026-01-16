/* ============================================
   Car Customization Platform - JavaScript
   ============================================ */

// Store base prices for different car models
// This object maps car model values to their base prices
const carBasePrices = {
    'sedan-basic': 25000,
    'sedan-premium': 35000,
    'suv-basic': 30000,
    'suv-premium': 45000,
    'sports-basic': 50000,
    'sports-premium': 70000
};

// Store color image URLs (using placeholder images - replace with actual car images)
// Each color has a different image URL to show the car in that color
const colorImages = {
    'white': 'https://via.placeholder.com/400x200/ffffff/666666?text=White+Car',
    'black': 'https://via.placeholder.com/400x200/000000/ffffff?text=Black+Car',
    'red': 'https://via.placeholder.com/400x200/dc3545/ffffff?text=Red+Car',
    'blue': 'https://via.placeholder.com/400x200/007bff/ffffff?text=Blue+Car',
    'silver': 'https://via.placeholder.com/400x200/c0c0c0/666666?text=Silver+Car'
};

// Global 3D car viewer instance
// This will be initialized when the page loads
let car3DViewer = null;

// Wait for the page to fully load before running JavaScript
// This ensures all HTML elements are available
document.addEventListener('DOMContentLoaded', function() {
    console.log('Car Customization Platform loaded');
    
    // Initialize 3D car viewer
    // This creates the interactive 3D car visualization
    try {
        car3DViewer = new Car3DViewer('car3DCanvas');
        console.log('3D Car Viewer initialized');
    } catch (error) {
        console.error('Failed to initialize 3D viewer:', error);
    }
    
    // Get references to all form elements
    const carModelSelect = document.getElementById('carModel');
    const colorRadios = document.querySelectorAll('input[name="color"]');
    const wheelsSelect = document.getElementById('wheels');
    const interiorSelect = document.getElementById('interior');
    const accessoriesCheckboxes = document.querySelectorAll('input[name="accessories"]');
    const customizeBtn = document.getElementById('customizeBtn');
    
    // Get view toggle buttons
    const exteriorViewBtn = document.getElementById('exteriorViewBtn');
    const interiorViewBtn = document.getElementById('interiorViewBtn');
    
    // Add event listeners to all form elements
    // When any option changes, recalculate the price and update 3D viewer
    
    // Listen for car model selection changes
    carModelSelect.addEventListener('change', function() {
        // Update 3D car model when car model changes
        if (car3DViewer) {
            car3DViewer.updateCarModel(carModelSelect.value);
        }
        update3DCar();
        calculatePrice();
    });
    
    // Listen for color selection changes
    colorRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Update 3D car color in real-time
            if (car3DViewer) {
                car3DViewer.updateColor(radio.value);
            }
            calculatePrice();
        });
    });
    
    // Listen for wheel selection changes
    wheelsSelect.addEventListener('change', function() {
        // Update 3D car wheels in real-time
        if (car3DViewer) {
            car3DViewer.updateWheels(wheelsSelect.value);
        }
        calculatePrice();
    });
    
    // Listen for interior selection changes
    interiorSelect.addEventListener('change', function() {
        // Update 3D car interior in real-time
        if (car3DViewer) {
            car3DViewer.updateInterior(interiorSelect.value);
        }
        calculatePrice();
    });
    
    // Listen for accessory checkbox changes
    accessoriesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Update 3D car accessories overlay in real-time
            if (car3DViewer) {
                car3DViewer.updateAccessory(checkbox.value, checkbox.checked);
            }
            calculatePrice();
        });
    });
    
    // Listen for view toggle buttons (exterior/interior)
    if (exteriorViewBtn) {
        exteriorViewBtn.addEventListener('click', function() {
            if (car3DViewer) {
                car3DViewer.setView('exterior');
            }
            // Update button states
            exteriorViewBtn.classList.add('active');
            interiorViewBtn.classList.remove('active');
        });
    }
    
    if (interiorViewBtn) {
        interiorViewBtn.addEventListener('click', function() {
            if (car3DViewer) {
                car3DViewer.setView('interior');
            }
            // Update button states
            interiorViewBtn.classList.add('active');
            exteriorViewBtn.classList.remove('active');
        });
    }
    
    // Listen for the "Customize Now" button click
    customizeBtn.addEventListener('click', handleCustomization);
    
    // Initialize price calculation on page load
    calculatePrice();
    
    // Initialize 3D car with default values
    update3DCar();
});

/**
 * Updates the 3D car model based on all current selections
 * This function synchronizes the 3D viewer with form selections
 */
function update3DCar() {
    if (!car3DViewer) return;
    
    // Get current selections
    const carModelSelect = document.getElementById('carModel');
    const selectedColor = document.querySelector('input[name="color"]:checked');
    const wheelsSelect = document.getElementById('wheels');
    const interiorSelect = document.getElementById('interior');
    const accessoriesCheckboxes = document.querySelectorAll('input[name="accessories"]:checked');
    
    // Update car model
    if (carModelSelect && carModelSelect.value) {
        car3DViewer.updateCarModel(carModelSelect.value);
    }
    
    // Update color
    if (selectedColor) {
        car3DViewer.updateColor(selectedColor.value);
    }
    
    // Update wheels
    if (wheelsSelect) {
        car3DViewer.updateWheels(wheelsSelect.value);
    }
    
    // Update interior
    if (interiorSelect) {
        car3DViewer.updateInterior(interiorSelect.value);
    }
    
    // Update accessories
    if (accessoriesCheckboxes) {
        // First, remove all accessories
        const allAccessories = ['sunroof', 'navigation', 'premium-sound', 'parking-sensors', 'heated-seats', 'led-lights'];
        allAccessories.forEach(acc => {
            car3DViewer.updateAccessory(acc, false);
        });
        
        // Then add selected accessories
        accessoriesCheckboxes.forEach(checkbox => {
            car3DViewer.updateAccessory(checkbox.value, true);
        });
    }
}

/**
 * Updates the car image based on selected color
 * This function is kept for backward compatibility but now uses 3D viewer
 * The 3D viewer handles all visual updates in real-time
 */
function updateCarImage() {
    // This function is now handled by the 3D viewer
    // The 3D viewer updates automatically when color changes
    update3DCar();
}

/**
 * Calculates the total price based on all selected options
 * This function runs whenever any customization option changes
 */
function calculatePrice() {
    // Get base price from selected car model
    const carModelSelect = document.getElementById('carModel');
    const selectedModel = carModelSelect.value;
    
    // Initialize base price to 0 if no model is selected
    let basePrice = 0;
    if (selectedModel && carBasePrices[selectedModel]) {
        basePrice = carBasePrices[selectedModel];
    }
    
    // Get color price from selected radio button
    const selectedColor = document.querySelector('input[name="color"]:checked');
    let colorPrice = 0;
    if (selectedColor) {
        // Get the price from the data-price attribute
        colorPrice = parseFloat(selectedColor.getAttribute('data-price')) || 0;
    }
    
    // Get wheels price from selected option
    const wheelsSelect = document.getElementById('wheels');
    const selectedWheels = wheelsSelect.options[wheelsSelect.selectedIndex];
    const wheelsPrice = parseFloat(selectedWheels.getAttribute('data-price')) || 0;
    
    // Get interior price from selected option
    const interiorSelect = document.getElementById('interior');
    const selectedInterior = interiorSelect.options[interiorSelect.selectedIndex];
    const interiorPrice = parseFloat(selectedInterior.getAttribute('data-price')) || 0;
    
    // Calculate accessories price (sum of all checked accessories)
    let accessoriesPrice = 0;
    const accessoriesCheckboxes = document.querySelectorAll('input[name="accessories"]:checked');
    accessoriesCheckboxes.forEach(checkbox => {
        const price = parseFloat(checkbox.getAttribute('data-price')) || 0;
        accessoriesPrice += price;
    });
    
    // Calculate total price
    const totalPrice = basePrice + colorPrice + wheelsPrice + interiorPrice + accessoriesPrice;
    
    // Update the price display on the page
    updatePriceDisplay(basePrice, colorPrice, wheelsPrice, interiorPrice, accessoriesPrice, totalPrice);
}

/**
 * Updates the price display section with calculated values
 * @param {number} basePrice - Base price of selected car model
 * @param {number} colorPrice - Additional cost for selected color
 * @param {number} wheelsPrice - Additional cost for selected wheels
 * @param {number} interiorPrice - Additional cost for selected interior
 * @param {number} accessoriesPrice - Total cost of selected accessories
 * @param {number} totalPrice - Grand total of all costs
 */
function updatePriceDisplay(basePrice, colorPrice, wheelsPrice, interiorPrice, accessoriesPrice, totalPrice) {
    // Format numbers as currency (US dollars)
    const formatCurrency = (amount) => {
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };
    
    // Update each price element on the page
    document.getElementById('basePrice').textContent = formatCurrency(basePrice);
    document.getElementById('colorPrice').textContent = formatCurrency(colorPrice);
    document.getElementById('wheelsPrice').textContent = formatCurrency(wheelsPrice);
    document.getElementById('interiorPrice').textContent = formatCurrency(interiorPrice);
    document.getElementById('accessoriesPrice').textContent = formatCurrency(accessoriesPrice);
    document.getElementById('totalPrice').textContent = formatCurrency(totalPrice);
}

/**
 * Handles the "Customize Now" button click
 * Collects all customization data and sends it to the server
 */
function handleCustomization() {
    // Get all selected values
    const carModelSelect = document.getElementById('carModel');
    const selectedModel = carModelSelect.value;
    
    // Validate that a car model is selected
    if (!selectedModel) {
        alert('Please select a car model first!');
        return;
    }
    
    // Get selected color
    const selectedColor = document.querySelector('input[name="color"]:checked');
    const colorValue = selectedColor ? selectedColor.value : '';
    
    // Get selected wheels
    const wheelsSelect = document.getElementById('wheels');
    const wheelsValue = wheelsSelect.value;
    
    // Get selected interior
    const interiorSelect = document.getElementById('interior');
    const interiorValue = interiorSelect.value;
    
    // Get selected accessories (array of checked values)
    const accessoriesCheckboxes = document.querySelectorAll('input[name="accessories"]:checked');
    const accessories = Array.from(accessoriesCheckboxes).map(checkbox => checkbox.value);
    
    // Calculate final price
    calculatePrice();
    const totalPriceElement = document.getElementById('totalPrice');
    const totalPrice = totalPriceElement.textContent;
    
    // Create customization data object
    const customizationData = {
        carModel: selectedModel,
        color: colorValue,
        wheels: wheelsValue,
        interior: interiorValue,
        accessories: accessories,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString()
    };
    
    // Log the data (for debugging)
    console.log('Customization Data:', customizationData);
    
    // Send data to server
    sendToServer(customizationData);
}

/**
 * Sends customization data to the backend server
 * @param {Object} data - The customization data object
 */
function sendToServer(data) {
    // Show loading state on button
    const customizeBtn = document.getElementById('customizeBtn');
    const originalText = customizeBtn.textContent;
    customizeBtn.disabled = true;
    customizeBtn.textContent = 'Sending...';
    
    // Send POST request to server
    // fetch() is a modern JavaScript API for making HTTP requests
    // The URL points to the backend server's /customize endpoint
    fetch('http://localhost:3000/customize', {
        method: 'POST', // HTTP method - POST is used to send data to the server
        headers: {
            // Set the Content-Type header to tell the server we're sending JSON data
            // This is important so body-parser knows how to parse the request
            'Content-Type': 'application/json'
        },
        // Convert the JavaScript object to a JSON string
        // JSON.stringify() converts the data object into a JSON-formatted string
        // This is required because HTTP requests send data as text, not objects
        body: JSON.stringify(data)
    })
    .then(response => {
        // Check if response is OK
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        // Success - show summary page
        console.log('Server response:', result);
        showSummaryPage(data, result);
    })
    .catch(error => {
        // Error handling - show alert if server is not available
        console.error('Error sending data to server:', error);
        alert('Unable to connect to server. Please make sure the backend server is running.\n\nShowing local summary instead.');
        // Show summary page anyway (local mode)
        showSummaryPage(data, { message: 'Data saved locally (server unavailable)' });
    })
    .finally(() => {
        // Restore button state
        customizeBtn.disabled = false;
        customizeBtn.textContent = originalText;
    });
}

/**
 * Displays a summary page with all customization details
 * @param {Object} data - The customization data
 * @param {Object} serverResponse - Response from the server
 */
function showSummaryPage(data, serverResponse) {
    // Create summary HTML
    const summaryHTML = `
        <div class="summary-container">
            <h2>Customization Summary</h2>
            <div class="summary-section">
                <h3>Your Customization Details</h3>
                <div class="summary-item">
                    <strong>Car Model:</strong> ${getCarModelName(data.carModel)}
                </div>
                <div class="summary-item">
                    <strong>Color:</strong> ${data.color.charAt(0).toUpperCase() + data.color.slice(1)}
                </div>
                <div class="summary-item">
                    <strong>Wheels:</strong> ${getWheelsName(data.wheels)}
                </div>
                <div class="summary-item">
                    <strong>Interior:</strong> ${getInteriorName(data.interior)}
                </div>
                <div class="summary-item">
                    <strong>Accessories:</strong> ${data.accessories.length > 0 ? data.accessories.map(acc => getAccessoryName(acc)).join(', ') : 'None'}
                </div>
                <div class="summary-item total">
                    <strong>Total Price:</strong> ${data.totalPrice}
                </div>
            </div>
            <div class="summary-actions">
                <button onclick="window.location.reload()" class="btn-primary">Customize Another Car</button>
            </div>
        </div>
    `;
    
    // Replace main content with summary
    const main = document.querySelector('main');
    main.innerHTML = summaryHTML;
    
    // Add summary styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .summary-container {
            text-align: center;
            padding: 40px;
        }
        .summary-section {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
            text-align: left;
        }
        .summary-item {
            padding: 15px 0;
            border-bottom: 1px solid #e0e0e0;
            font-size: 1.1em;
        }
        .summary-item.total {
            border-bottom: none;
            border-top: 2px solid #667eea;
            margin-top: 15px;
            padding-top: 20px;
            font-size: 1.5em;
            color: #667eea;
        }
        .summary-actions {
            margin-top: 30px;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Helper function to get display name for car model
 * @param {string} modelValue - The model value from select
 * @returns {string} Display name
 */
function getCarModelName(modelValue) {
    const modelNames = {
        'sedan-basic': 'Sedan - Basic',
        'sedan-premium': 'Sedan - Premium',
        'suv-basic': 'SUV - Basic',
        'suv-premium': 'SUV - Premium',
        'sports-basic': 'Sports Car - Basic',
        'sports-premium': 'Sports Car - Premium'
    };
    return modelNames[modelValue] || modelValue;
}

/**
 * Helper function to get display name for wheels
 * @param {string} wheelsValue - The wheels value from select
 * @returns {string} Display name
 */
function getWheelsName(wheelsValue) {
    const wheelsNames = {
        'standard': 'Standard Wheels',
        'alloy': 'Alloy Wheels',
        'chrome': 'Chrome Wheels',
        'sport': 'Sport Wheels',
        'luxury': 'Luxury Wheels'
    };
    return wheelsNames[wheelsValue] || wheelsValue;
}

/**
 * Helper function to get display name for interior
 * @param {string} interiorValue - The interior value from select
 * @returns {string} Display name
 */
function getInteriorName(interiorValue) {
    const interiorNames = {
        'fabric': 'Fabric Interior',
        'leather': 'Leather Interior',
        'premium-leather': 'Premium Leather Interior',
        'sport': 'Sport Interior'
    };
    return interiorNames[interiorValue] || interiorValue;
}

/**
 * Helper function to get display name for accessories
 * @param {string} accessoryValue - The accessory value
 * @returns {string} Display name
 */
function getAccessoryName(accessoryValue) {
    const accessoryNames = {
        'sunroof': 'Sunroof',
        'navigation': 'Navigation System',
        'premium-sound': 'Premium Sound System',
        'parking-sensors': 'Parking Sensors',
        'heated-seats': 'Heated Seats',
        'led-lights': 'LED Headlights'
    };
    return accessoryNames[accessoryValue] || accessoryValue;
}
