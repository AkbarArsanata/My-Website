// Utility function to load HTML components
export async function loadComponent(componentName, containerId) {
    try {
        console.log(`Loading component: ${componentName}.html`);

        // Path is relative to index.html (root level)
        const response = await fetch(`html/${componentName}.html`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const container = document.getElementById(containerId);
        
        if (!container) {
            throw new Error(`Container with ID "${containerId}" not found`);
        }
        
        container.innerHTML = html;
        console.log(`Successfully loaded ${componentName}`);
        return true;
    } catch (error) {
        logError(`Failed to load component "${componentName}"`, error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error" style="color:red; padding:20px; border:1px solid red">
                    ⚠️ Error: Failed to load <strong>${componentName}</strong> component.
                    <br><small>${error.message}</small>
                </div>
            `;
        }
        return false;
    }
}

// Enhanced error logging function
export function logError(message, error) {
    const timestamp = new Date().toISOString();
    const errorDetails = error instanceof Error ? 
        `${error.message}\nStack: ${error.stack}` : 
        JSON.stringify(error);
    
    console.error(`[${timestamp}] ${message}:\n${errorDetails}`);
    
    // Optional: Send to external logging service
    // sendErrorToService({ message, errorDetails, timestamp });
}

// Helper to check if element exists in DOM
export function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

// Debounce helper for performance tuning (e.g. scroll/resize handlers)
export function debounce(func, wait = 100, immediate = false) {
    let timeout;
    return function (...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
