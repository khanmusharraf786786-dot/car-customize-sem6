/* ============================================
   Authentication JavaScript
   Handles sign up and login functionality
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    // Initialize sign up form if it exists
    if (signupForm) {
        initializeSignupForm();
    }
    
    // Initialize login form if it exists
    if (loginForm) {
        initializeLoginForm();
    }
    
    // Check if user is already logged in
    checkAuthStatus();
});

/**
 * Initialize sign up form with validation and submission
 */
function initializeSignupForm() {
    const form = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    
    // Real-time validation on input
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        // Validate on blur (when user leaves the field)
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear errors on input
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Validate password match in real-time
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isValid = validateSignupForm();
        
        if (isValid) {
            // Show loading state
            setLoadingState(true, signupBtn);
            
            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim().toLowerCase(),
                password: document.getElementById('password').value,
                phone: document.getElementById('phone').value.trim() || null
            };
            
            // Send sign up request
            try {
                const response = await fetch('http://localhost:3000/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Success - show message and redirect
                    showAuthMessage('Account created successfully! Redirecting...', 'success');
                    
                    // Store user session
                    if (result.token) {
                        localStorage.setItem('authToken', result.token);
                        localStorage.setItem('user', JSON.stringify(result.user));
                    }
                    
                    // Redirect to main page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    // Error - show error message
                    showAuthMessage(result.message || 'Failed to create account. Please try again.', 'error');
                    setLoadingState(false, signupBtn);
                }
            } catch (error) {
                console.error('Sign up error:', error);
                showAuthMessage('Network error. Please check your connection and try again.', 'error');
                setLoadingState(false, signupBtn);
            }
        }
    });
}

/**
 * Initialize login form with validation and submission
 */
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    // Real-time validation
    const inputs = form.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        const isValid = validateLoginForm();
        
        if (isValid) {
            // Show loading state
            setLoadingState(true, loginBtn);
            
            // Get form data
            const formData = {
                email: document.getElementById('loginEmail').value.trim().toLowerCase(),
                password: document.getElementById('loginPassword').value,
                rememberMe: document.getElementById('rememberMe').checked
            };
            
            // Send login request
            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Success - store session
                    if (result.token) {
                        localStorage.setItem('authToken', result.token);
                        localStorage.setItem('user', JSON.stringify(result.user));
                    }
                    
                    // Show success message
                    showAuthMessage('Login successful! Redirecting...', 'success');
                    
                    // Redirect to main page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    // Error - show error message
                    showAuthMessage(result.message || 'Invalid email or password.', 'error');
                    setLoadingState(false, loginBtn);
                }
            } catch (error) {
                console.error('Login error:', error);
                showAuthMessage('Network error. Please check your connection and try again.', 'error');
                setLoadingState(false, loginBtn);
            }
        }
    });
}

/**
 * Validate sign up form
 * @returns {boolean} True if form is valid
 */
function validateSignupForm() {
    let isValid = true;
    
    // Validate full name
    const fullName = document.getElementById('fullName');
    if (!validateField(fullName)) isValid = false;
    
    // Validate email
    const email = document.getElementById('email');
    if (!validateField(email)) isValid = false;
    
    // Validate password
    const password = document.getElementById('password');
    if (!validateField(password)) isValid = false;
    
    // Validate confirm password
    if (!validatePasswordMatch()) isValid = false;
    
    // Validate phone (optional)
    const phone = document.getElementById('phone');
    if (phone && phone.value.trim() && !validateField(phone)) {
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate login form
 * @returns {boolean} True if form is valid
 */
function validateLoginForm() {
    let isValid = true;
    
    // Validate email
    const email = document.getElementById('loginEmail');
    if (!validateField(email)) isValid = false;
    
    // Validate password
    const password = document.getElementById('loginPassword');
    if (!validateField(password)) isValid = false;
    
    return isValid;
}

/**
 * Validate a single form field
 * @param {HTMLElement} field - The input field to validate
 * @returns {boolean} True if field is valid
 */
function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    const errorElement = document.getElementById(fieldId + 'Error');
    
    // Remove previous error styling
    field.classList.remove('error', 'success');
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, errorElement, 'This field is required');
        return false;
    }
    
    // Skip validation if field is optional and empty
    if (!field.hasAttribute('required') && !value) {
        clearFieldError(field, errorElement);
        return true;
    }
    
    // Validate based on field type
    switch(fieldId) {
        case 'fullName':
            if (value.length < 2) {
                showFieldError(field, errorElement, 'Name must be at least 2 characters');
                return false;
            }
            if (value.length > 50) {
                showFieldError(field, errorElement, 'Name must be less than 50 characters');
                return false;
            }
            break;
            
        case 'email':
        case 'loginEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, errorElement, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'password':
        case 'loginPassword':
            if (value.length < 6) {
                showFieldError(field, errorElement, 'Password must be at least 6 characters');
                return false;
            }
            break;
            
        case 'confirmPassword':
            return validatePasswordMatch();
            
        case 'phone':
            if (value && !/^[0-9]{10,15}$/.test(value)) {
                showFieldError(field, errorElement, 'Please enter a valid phone number (10-15 digits)');
                return false;
            }
            break;
    }
    
    // Field is valid
    field.classList.add('success');
    clearFieldError(field, errorElement);
    return true;
}

/**
 * Validate password match
 * @returns {boolean} True if passwords match
 */
function validatePasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (!password || !confirmPassword) return true; // Not on signup page
    
    if (password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, errorElement, 'Passwords do not match');
        return false;
    }
    
    clearFieldError(confirmPassword, errorElement);
    confirmPassword.classList.add('success');
    return true;
}

/**
 * Show field error message
 * @param {HTMLElement} field - The input field
 * @param {HTMLElement} errorElement - The error message element
 * @param {string} message - Error message to display
 */
function showFieldError(field, errorElement, message) {
    field.classList.add('error');
    field.classList.remove('success');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clear field error message
 * @param {HTMLElement} field - The input field
 * @param {HTMLElement} errorElement - The error message element (optional)
 */
function clearFieldError(field, errorElement) {
    field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Show authentication message (success/error)
 * @param {string} message - Message to display
 * @param {string} type - Message type: 'success', 'error', or 'info'
 */
function showAuthMessage(message, type) {
    const messageElement = document.getElementById('authMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `auth-message show ${type}`;
        
        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 5000);
        }
    }
}

/**
 * Set loading state for form submission
 * @param {boolean} isLoading - Whether form is loading
 * @param {HTMLElement} button - The submit button
 */
function setLoadingState(isLoading, button) {
    const loadingMessage = document.getElementById('loadingMessage');
    
    if (isLoading) {
        button.disabled = true;
        button.textContent = 'Processing...';
        if (loadingMessage) {
            loadingMessage.style.display = 'block';
        }
    } else {
        button.disabled = false;
        if (button.id === 'signupBtn') {
            button.textContent = 'Create Account';
        } else if (button.id === 'loginBtn') {
            button.textContent = 'Sign In';
        }
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
    }
}

/**
 * Check authentication status
 * Redirect to main page if already logged in (on auth pages)
 */
function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;
    
    // If user is logged in and on auth page, redirect to main page
    if (authToken && (currentPage.includes('login.html') || currentPage.includes('signup.html'))) {
        // Optional: Redirect to main page
        // window.location.href = 'index.html';
    }
}

/**
 * Logout function
 * Clears authentication data
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

/**
 * Get current user data
 * @returns {Object|null} User object or null
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
