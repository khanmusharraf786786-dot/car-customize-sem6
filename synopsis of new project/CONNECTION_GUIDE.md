# Frontend-Backend Connection Guide

## Overview
This document explains how the frontend (HTML/CSS/JavaScript) connects to the backend (Node.js/Express) server.

## Connection Flow

### 1. Frontend (script.js)
When the user clicks "Customize Now" button:

```javascript
// Frontend sends POST request to backend
fetch('http://localhost:3000/customize', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)  // Converts JavaScript object to JSON string
})
```

**What happens:**
- Collects all form data (car model, color, wheels, interior, accessories)
- Creates a JavaScript object with the data
- Converts it to JSON string using `JSON.stringify()`
- Sends HTTP POST request to `http://localhost:3000/customize`

### 2. Backend (server.js)
The Express server receives the request:

```javascript
// Backend receives and processes the request
app.post('/customize', (req, res) => {
    const data = req.body;  // body-parser makes data available here
    // Process and save data
    res.json({ success: true, ... });  // Send confirmation response
})
```

**What happens:**
- `body-parser` middleware parses the JSON string from request body
- Makes the data available as `req.body` (JavaScript object)
- Validates the data
- Stores it in memory (or database)
- Sends JSON response back to frontend

### 3. Frontend Receives Response
The frontend handles the response:

```javascript
.then(response => response.json())  // Parse JSON response
.then(result => {
    // Show success message or summary page
    showSummaryPage(data, result);
})
```

## Key Components

### body-parser Middleware
- **Purpose**: Parses incoming request bodies
- **What it does**: Converts JSON strings to JavaScript objects
- **Location**: Configured in `server.js` before routes

```javascript
app.use(bodyParser.json());  // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true }));  // Parse form data
```

### CORS Middleware
- **Purpose**: Allows frontend to communicate with backend
- **Why needed**: Frontend and backend run on different ports/origins
- **Location**: Configured in `server.js`

```javascript
app.use(cors());  // Enable Cross-Origin Resource Sharing
```

## Testing the Connection

1. **Start the backend server:**
   ```bash
   npm install
   npm start
   ```

2. **Open the frontend:**
   - Navigate to `http://localhost:3000` in your browser
   - The server serves the HTML file directly

3. **Test the connection:**
   - Fill out the customization form
   - Click "Customize Now"
   - Check browser console for success message
   - Check server console for received data

## Troubleshooting

### Connection Failed
- **Check**: Is the server running? (Look for "Server is running" message)
- **Check**: Is the port 3000 available?
- **Check**: Browser console for CORS errors

### Data Not Received
- **Check**: Server console for incoming requests
- **Check**: Request headers include `Content-Type: application/json`
- **Check**: body-parser is configured before routes

### Response Not Received
- **Check**: Network tab in browser DevTools
- **Check**: Server is sending response with `res.json()`
- **Check**: No errors in server console

## Data Flow Diagram

```
Frontend (Browser)
    │
    │ 1. User clicks "Customize Now"
    │
    ▼
JavaScript (script.js)
    │
    │ 2. Collect form data
    │ 3. Create data object
    │ 4. JSON.stringify(data)
    │
    ▼
HTTP POST Request
    │ URL: http://localhost:3000/customize
    │ Method: POST
    │ Headers: Content-Type: application/json
    │ Body: JSON string
    │
    ▼
Backend Server (server.js)
    │
    │ 5. CORS middleware allows request
    │ 6. body-parser parses JSON
    │ 7. Data available in req.body
    │
    ▼
POST /customize Route Handler
    │
    │ 8. Validate data
    │ 9. Process and save
    │ 10. Generate response
    │
    ▼
HTTP Response
    │ Status: 200 OK
    │ Body: JSON { success: true, ... }
    │
    ▼
Frontend (Browser)
    │
    │ 11. Receive response
    │ 12. Parse JSON
    │ 13. Display summary page
    │
    ▼
User sees confirmation
```

## Summary

- **Frontend sends**: JSON string via HTTP POST
- **Backend receives**: Parsed JavaScript object via body-parser
- **Backend sends**: JSON response with confirmation
- **Frontend receives**: Parsed response and displays result

The connection is established through:
1. HTTP protocol (POST request)
2. JSON data format
3. body-parser middleware (parsing)
4. CORS middleware (cross-origin support)
