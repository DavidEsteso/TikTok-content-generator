// Import all required modules from their respective files
import { validationUtils } from './utils/validationUtils.js';
import { factManager } from './components/factManager.js';
import { uiManager } from './components/uiManager.js';

// Global state object to manage application state
import { uiInitializer } from './initializers/uiInitializer.js';


// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    try {
        console.log('Initializing app...');
        
        // Inicializar UI y event listeners
        uiInitializer.initialize();
        
        // Setup inicial
        uiManager.toggleVideoType();

        
        console.log('Initialization complete');
    } catch (error) {
        console.error('Error during initialization:', error);
        uiManager.showError('Failed to initialize application. Please refresh the page or contact support.');
    }
});

window.addEventListener('unload', () => {
    uiInitializer.cleanup();
});

