# Car Customization Web Application

A web-based vehicle customization platform built as an academic project for BSc Computer Science.

## Project Overview

This project is a full-stack web application that allows users to customize vehicles by selecting:
- Car model and variant
- Exterior color
- Wheel styles
- Interior options
- Accessories

The application features real-time price calculation and sends customization data to a Node.js backend server.

## Technology Stack

### Frontend
- **HTML5** - Semantic markup for structure
- **CSS3** - Modern styling with responsive design
- **JavaScript (ES6+)** - Client-side interactivity and API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **CORS** - Cross-Origin Resource Sharing support

### Database (Future Scope)
- **MongoDB** - NoSQL database for persistent storage (optional)

## Project Structure

```
car-customization-platform/
│
├── index.html          # Main HTML page
├── styles.css          # CSS styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend Express server
├── package.json        # Node.js dependencies
└── README.md          # Project documentation
```

## Features

1. **Car Model Selection**
   - Dropdown menu with multiple car models and variants
   - Each model has a base price

2. **Color Customization**
   - Radio button selection for exterior colors
   - Visual color swatches
   - Real-time car image update based on color selection

3. **Wheel Selection**
   - Multiple wheel style options
   - Additional pricing for premium wheels

4. **Interior Options**
   - Various interior styles (Fabric, Leather, Premium Leather, Sport)
   - Price variations based on selection

5. **Accessories**
   - Multiple accessories available (checkboxes)
   - Sunroof, Navigation, Premium Sound, Parking Sensors, Heated Seats, LED Lights
   - Cumulative pricing for multiple selections

6. **Real-Time Price Calculation**
   - Dynamic price updates as options change
   - Price breakdown display
   - Total price calculation

7. **Data Submission**
   - Sends customization data to backend server
   - Displays summary page after submission

## Installation & Setup

### Prerequisites

- **Node.js** (version 14.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (Node Package Manager - comes with Node.js)
  - Verify installation: `npm --version`

### Step 1: Install Dependencies

Open a terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required packages:
- `express` - Web framework
- `cors` - CORS middleware

### Step 2: Start the Server

Run the following command to start the backend server:

```bash
npm start
```

Or for development with auto-reload (if nodemon is installed):

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Step 3: Open the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

## Usage Guide

1. **Select Car Model**
   - Choose a car model and variant from the dropdown
   - Base price will be displayed

2. **Choose Color**
   - Select an exterior color using radio buttons
   - Car preview image will update

3. **Select Wheels**
   - Choose wheel style from dropdown
   - Price will be added to total

4. **Choose Interior**
   - Select interior style from dropdown
   - Price will be added to total

5. **Add Accessories**
   - Check any desired accessories
   - Multiple selections allowed
   - Prices are cumulative

6. **Review Price**
   - View price breakdown in the price section
   - Total price updates in real-time

7. **Submit Customization**
   - Click "Customize Now" button
   - Data is sent to server
   - Summary page is displayed

## API Endpoints

### POST /customize
Submit customization data to the server.

**Request Body:**
```json
{
  "carModel": "sedan-premium",
  "color": "red",
  "wheels": "chrome",
  "interior": "leather",
  "accessories": ["sunroof", "navigation"],
  "totalPrice": "$42,050"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customization saved successfully",
  "id": "1234567890",
  "data": { ... }
}
```

### GET /api/customizations
Get all stored customizations.

### GET /api/customizations/:id
Get a specific customization by ID.

### DELETE /api/customizations/:id
Delete a customization by ID.

### GET /api/health
Health check endpoint.

## Code Structure & Comments

The codebase is designed to be beginner-friendly with:
- Extensive comments explaining each section
- Clear function names and structure
- Simple logic flow
- Academic project standards

### Frontend Files

- **index.html**: Semantic HTML structure with form elements
- **styles.css**: Modern CSS with responsive design and comments
- **script.js**: JavaScript with event listeners and price calculation logic

### Backend Files

- **server.js**: Express server with API routes and middleware
- **package.json**: Project configuration and dependencies

## Future Enhancements (MongoDB Integration)

To add MongoDB database support:

1. Install MongoDB and Mongoose:
```bash
npm install mongoose
```

2. Create database connection in `server.js`
3. Create schema for customization data
4. Replace in-memory storage with database operations

## Troubleshooting

### Server won't start
- Check if Node.js is installed: `node --version`
- Verify port 3000 is not in use
- Check for syntax errors in `server.js`

### Frontend not loading
- Ensure server is running
- Check browser console for errors
- Verify all files are in the same directory

### API requests failing
- Verify server is running on port 3000
- Check CORS configuration
- Review browser console for error messages

## Academic Project Notes

This project demonstrates:
- Frontend development (HTML, CSS, JavaScript)
- Backend development (Node.js, Express.js)
- RESTful API design
- Client-server communication
- Real-time UI updates
- Form handling and validation

## License

This project is created for academic purposes as part of a BSc Computer Science final-year project.

## Author

BSc Computer Science Final-Year Student

---

**Note**: This is an academic project. For production use, additional security measures, database integration, and error handling should be implemented.
