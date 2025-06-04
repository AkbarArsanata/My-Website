import { initComponents } from './components.js';  
import { initCertificates } from './certificates.js';
import { initProjects } from './projects.js';  // Updated import
import { setupNavigation } from './navigation.js';
import { loadComponent, logError } from './utils.js';

export async function initializeApp() {
    try {
        console.log('Initializing application...');
        
        await loadAllComponents();
        await initComponents();
        await setupNavigation();
        
        console.log('Application initialized successfully');
    } catch (error) {
        logError('Failed to initialize application', error);
        
        document.getElementById('app-container').innerHTML = `
            <div class="error-message">
                <h2>Application Error</h2>
                <p>We're having trouble loading the application. Please refresh the page.</p>
                <button onclick="window.location.reload()">Refresh Page</button>
            </div>
        `;
    }
}

async function loadAllComponents() {
    const components = [
        { 
            name: 'header', 
            container: 'header-container',
            init: null 
        },
        { 
            name: 'hero', 
            container: 'hero-container',
            init: null 
        },
        { 
            name: 'about', 
            container: 'about-container',
            init: null 
        },
        { 
            name: 'experience', 
            container: 'experience-container',
            init: null 
        },
        { 
            name: 'projects', 
            container: 'projects-container',
            init: initProjects  // This will now use the imported initProjects
        },
        { 
            name: 'certificates', 
            container: 'certificates-container',
            init: initCertificates 
        },
        { 
            name: 'contact', 
            container: 'contact-container',
            init: null 
        },
        { 
            name: 'footer', 
            container: 'footer-container',
            init: null 
        }
    ];

    try {
        console.log('Loading HTML components...');
        
        for (const comp of components) {
            try {
                document.getElementById(comp.container).innerHTML = `
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        Loading ${comp.name}...
                    </div>
                `;
                
                await loadComponent(comp.name, comp.container);
                
                if (comp.init) {
                    await comp.init();  // This will call initProjects() when loading projects
                }
                
                console.log(`${comp.name} component loaded successfully`);
                
            } catch (componentError) {
                logError(`Error loading ${comp.name} component`, componentError);
                
                document.getElementById(comp.container).innerHTML = `
                    <div class="component-error">
                        Failed to load ${comp.name.replace('-', ' ')} content.
                    </div>
                `;
                continue;
            }
        }
        
        console.log('All HTML components loaded');
    } catch (error) {
        logError('Critical error during component loading', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loading');
    initializeApp().finally(() => {
        document.body.classList.remove('loading');
    });
});