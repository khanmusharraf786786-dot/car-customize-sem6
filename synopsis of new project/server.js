/* ============================================
   Car Customization Platform - Backend Server
   Node.js with Express.js
   ============================================ */

// Import the Express framework module
// Express is a web application framework for Node.js that simplifies server creation
const express = require('express');

// Import the CORS (Cross-Origin Resource Sharing) module
// CORS allows the frontend (running on a different port/origin) to communicate with the backend
const cors = require('cors');

// Import the path module (built-in Node.js module)
// Used for handling file and directory paths
const path = require('path');

// Import body-parser module
// body-parser extracts the entire body portion of an incoming request stream
// and makes it available on req.body for easy access
const bodyParser = require('body-parser');

// Create an Express application instance
// This app object has methods for routing HTTP requests, configuring middleware, etc.
const app = express();

// Define the port number for the server to listen on
// process.env.PORT allows the port to be set via environment variable (useful for deployment)
// If PORT is not set, default to 3000
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware Configuration
// ============================================

// Enable CORS middleware for all routes
// This allows requests from any origin (frontend can be on different port/domain)
// In production, you might want to restrict this to specific origins
app.use(cors());

// Configure body-parser to parse JSON data from request bodies
// json() method returns middleware that only parses JSON
// The limit option sets the maximum request body size (50mb in this case)
// When a request with Content-Type: application/json is received,
// body-parser will parse it and make it available as req.body
app.use(bodyParser.json({ limit: '50mb' }));

// Configure body-parser to parse URL-encoded data
// urlencoded() parses incoming requests with urlencoded payloads
// extended: true allows parsing of rich objects and arrays
// This is useful for form submissions
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the current directory
// express.static() is a built-in middleware function that serves static files
// __dirname is the directory where the current script is located
// This allows the server to serve HTML, CSS, and JavaScript files directly
app.use(express.static(__dirname));

// ============================================
// Data Storage (In-Memory)
// ============================================

// Store customization data in memory
// In a real application, this would be stored in a database (MongoDB)
// This is a simple array to store all customization requests
let customizationData = [];

// Store user data in memory (for academic project)
// In production, this would be stored in a database with password hashing
// WARNING: This is a simplified implementation for academic purposes only
let users = [];

// Simple token generation (for academic project)
// In production, use proper JWT tokens or session management
function generateToken(userId) {
    // Simple token: timestamp + random string + userId
    // In production, use a proper JWT library like jsonwebtoken
    return Buffer.from(`${Date.now()}-${Math.random().toString(36)}-${userId}`).toString('base64');
}

// ============================================
// API Routes
// ============================================

/**
 * Root route - serves the main HTML page
 * GET /
 */
app.get('/', (req, res) => {
    // Send the index.html file
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * Health check endpoint
 * GET /api/health
 * Returns server status
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Car Customization Platform API is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Customization endpoint - POST /customize
 * This route receives customization data from the frontend
 * and sends back a confirmation response
 * 
 * Route: POST /customize
 * Expected Request Body (JSON):
 * {
 *   "carModel": "sedan-premium",
 *   "color": "red",
 *   "wheels": "chrome",
 *   "interior": "leather",
 *   "accessories": ["sunroof", "navigation"],
 *   "totalPrice": "$42,050"
 * }
 */
app.post('/customize', (req, res) => {
    // Wrap everything in try-catch to handle any errors gracefully
    try {
        // Extract the request body data
        // body-parser middleware has already parsed the JSON and made it available here
        // req.body contains the data sent from the frontend
        const data = req.body;
        
        // Log the incoming request for debugging purposes
        // This helps track what data is being received
        console.log('Received customization request:', data);
        
        // Validate that required fields are present in the request
        // Check if carModel exists and is not empty
        if (!data.carModel || data.carModel.trim() === '') {
            // Return a 400 Bad Request status with error message
            // res.status() sets the HTTP status code
            // res.json() sends a JSON response
            return res.status(400).json({
                success: false,
                message: 'Missing required field: carModel is required'
            });
        }
        
        // Validate that color is present
        if (!data.color || data.color.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Missing required field: color is required'
            });
        }
        
        // Add server-side timestamp to the data
        // new Date() creates a new Date object with current date/time
        // toISOString() converts it to a string in ISO 8601 format (e.g., "2024-01-15T10:30:00.000Z")
        data.serverTimestamp = new Date().toISOString();
        
        // Generate a unique ID for this customization
        // Date.now() returns current timestamp in milliseconds
        // Math.random() generates a random number between 0 and 1
        // toString(36) converts to base-36 (uses 0-9 and a-z)
        // substr(2, 9) takes 9 characters starting from position 2
        // This creates a unique identifier like "1705123456abc123def"
        data.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        // Store the customization data in the in-memory array
        // push() adds the data object to the end of the array
        // In a real application, this would be saved to a database (MongoDB)
        customizationData.push(data);
        
        // Log the stored data for debugging
        // This confirms the data was received and stored correctly
        console.log('Customization saved successfully:', {
            id: data.id,
            carModel: data.carModel,
            color: data.color,
            totalPrice: data.totalPrice,
            timestamp: data.serverTimestamp
        });
        
        // Send a success response back to the frontend
        // res.json() automatically sets Content-Type to application/json
        // This is the confirmation response the frontend will receive
        res.json({
            success: true,
            message: 'Customization received and saved successfully',
            id: data.id,
            timestamp: data.serverTimestamp,
            data: data
        });
        
    } catch (error) {
        // Catch any errors that occur during processing
        // This prevents the server from crashing if something goes wrong
        
        // Log the error to the console for debugging
        console.error('Error processing customization request:', error);
        
        // Send an error response to the frontend
        // 500 is Internal Server Error status code
        res.status(500).json({
            success: false,
            message: 'Internal server error occurred while processing your request',
            error: error.message // Include error message for debugging (remove in production)
        });
    }
});

/**
 * Get all customizations endpoint
 * GET /api/customizations
 * Returns all stored customization data
 */
app.get('/api/customizations', (req, res) => {
    try {
        res.json({
            success: true,
            count: customizationData.length,
            data: customizationData
        });
    } catch (error) {
        console.error('Error fetching customizations:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * Get specific customization by ID
 * GET /api/customizations/:id
 * Returns a specific customization by its ID
 */
app.get('/api/customizations/:id', (req, res) => {
    try {
        const id = req.params.id;
        
        // Find customization with matching ID
        const customization = customizationData.find(item => item.id === id);
        
        if (!customization) {
            return res.status(404).json({
                success: false,
                message: 'Customization not found'
            });
        }
        
        res.json({
            success: true,
            data: customization
        });
        
    } catch (error) {
        console.error('Error fetching customization:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * Delete customization endpoint
 * DELETE /api/customizations/:id
 * Deletes a specific customization by ID
 */
app.delete('/api/customizations/:id', (req, res) => {
    try {
        const id = req.params.id;
        
        // Find index of customization with matching ID
        const index = customizationData.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Customization not found'
            });
        }
        
        // Remove the customization
        customizationData.splice(index, 1);
        
        res.json({
            success: true,
            message: 'Customization deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting customization:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// ============================================
// Error Handling Middleware
// ============================================

// Handle 404 errors (route not found)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// ============================================
// Start Server
// ============================================

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log('============================================');
    console.log('Car Customization Platform - Server Running');
    console.log('============================================');
    console.log(`Server is running on: http://localhost:${PORT}`);
    console.log(`API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`Customize Endpoint: http://localhost:${PORT}/customize`);
    console.log('============================================');
    console.log('Press Ctrl+C to stop the server');
    console.log('============================================');
});

// Export the app for testing purposes (optional)
module.exports = app;
