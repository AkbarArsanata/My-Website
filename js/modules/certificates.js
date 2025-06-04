import { logError } from './utils.js';
let pdfjsLib = null;
import { certificatesData } from './certificatesData.js';

// Global variables
let currentCategory = "machine-learning-ai";
let showAll = false;

/**
 * Helper function to convert category IDs to display labels
 */
function categoryToLabel(category) {
    const categoryLabels = {
        "machine-learning-ai": "AI/ML",
        "data-engineering-databases": "Data Engineering",
        "data-visualization-analytics": "Data Analytics",
        "mlops-cloud-deployment": "MLOps & Cloud"
    };
    return categoryLabels[category] || category;
}

/**
 * Load Font Awesome dynamically if not already loaded
 */
function loadFontAwesome() {
    if (document.querySelector('link[href*="font-awesome"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';   
    document.head.appendChild(link);
}

/**
 * Load PDF.js library with fallback
 */
async function loadPDFJS() {
    if (window.pdfjsLib) {
        pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';   
        return;
    }
    try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');   
        pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';   
    } catch (error) {
        console.warn('CDN failed, trying local fallback');
        try {
            await loadScript('/lib/pdf.min.js');
            pdfjsLib = window.pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = '/lib/pdf.worker.min.js';
        } catch (err) {
            logError('Failed to load PDF.js', err);
            throw err;
        }
    }
}

/**
 * Load external script dynamically
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

/**
 * Create certificate card element
 */
function createCertificateCard(cert, category) {
    const card = document.createElement("div");
    card.className = "certificate-card";
    card.style.display = "block"; // Ensure card is visible
    card.innerHTML = `
        <div class="pdf-preview-container">
            <canvas class="pdf-canvas" data-pdf-url="${cert.pdfUrl}"></canvas>
            <div class="pdf-preview-overlay">
                <i class="fas fa-expand"></i>
            </div>
        </div>
        <div class="certificate-card-content">
            <span class="certificate-badge">${categoryToLabel(category)}</span>
            <h4>${cert.name}</h4>
            <p>Issued: ${cert.date}</p>
            <a href="#" class="view-pdf-btn" data-pdf-url="${cert.pdfUrl}" 
               data-title="${cert.name}" data-date="${cert.date}">
                <i class="fas fa-eye"></i> View Certificate
            </a>
        </div>
    `;
    return card;
}

/**
 * Main render function with forced re-render
 */
async function renderCertificates(category) {
    try {
        console.log(`Rendering certificates for ${category}, showAll: ${showAll}`);
        const certificateGrid = document.getElementById('certificate-grid');
        if (!certificateGrid) throw new Error('Certificate grid not found');

        // Force complete re-render by detaching and reattaching
        const parent = certificateGrid.parentNode;
        const tempContainer = document.createElement('div');
        parent.replaceChild(tempContainer, certificateGrid);

        const items = certificatesData[category];
        if (!items || !items.length) {
            certificateGrid.innerHTML = `
                <div class="no-certificates">
                    <i class="fas fa-info-circle"></i>
                    <p>No certificates found in this category</p>
                </div>
            `;
            parent.replaceChild(certificateGrid, tempContainer);
            return;
        }

        updateCertificateCounter(items.length);
        certificateGrid.innerHTML = "";
        const itemsToRender = showAll ? [...items] : items.slice(0, 3);
        itemsToRender.forEach(cert => {
            const card = createCertificateCard(cert, category);
            certificateGrid.appendChild(card);
        });

        parent.replaceChild(certificateGrid, tempContainer);
        await renderAllPDFPreviews();
        setupEventListeners(); // Setup again after rendering
        updateViewAllButton(items.length);
        currentCategory = category;
    } catch (error) {
        handleRenderError(error, category);
    }
}

/**
 * Update certificate counter UI
 */
function updateCertificateCounter(total) {
    const shownCount = document.getElementById('shown-count');
    const totalCount = document.getElementById('total-count');
    if (shownCount && totalCount) {
        shownCount.textContent = showAll ? total : Math.min(3, total);
        totalCount.textContent = total;
    }
}

/**
 * Toggle visibility of "View All" button
 */
function updateViewAllButton(totalItems) {
    const viewAllBtn = document.getElementById("view-all-btn");
    if (!viewAllBtn) return;
    viewAllBtn.style.display = totalItems > 3 ? "flex" : "none";
    viewAllBtn.innerHTML = showAll ? 
        '<span>Show Less</span><i class="fas fa-chevron-up"></i>' : 
        '<span>View All</span><i class="fas fa-chevron-down"></i>';
}

/**
 * Handle rendering errors
 */
function handleRenderError(error, category) {
    logError(`Error rendering ${category}`, error);
    const certificateGrid = document.getElementById('certificate-grid');
    if (certificateGrid) {
        certificateGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load certificates. Please try again.</p>
            </div>
        `;
    }
}

/**
 * Render all PDF previews using pdf.js
 */
async function renderAllPDFPreviews() {
    const canvases = document.querySelectorAll('.pdf-canvas');
    if (!canvases.length) return;
    for (const canvas of canvases) {
        const pdfUrl = canvas.getAttribute('data-pdf-url');
        if (!pdfUrl) continue;
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'pdf-loading';
        loadingDiv.innerHTML = `
            <div class="spinner"></div>
            <p>Loading preview...</p>
        `;
        canvas.parentElement.appendChild(loadingDiv);
        try {
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const context = canvas.getContext('2d');
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            loadingDiv.remove();
        } catch (err) {
            console.error(`Error loading PDF ${pdfUrl}:`, err);
            loadingDiv.innerHTML = `
                <i class="fas fa-file-pdf"></i>
                <p>Preview unavailable</p>
            `;
        }
    }
}

/**
 * Setup event listeners after rendering
 */
function setupEventListeners() {
    console.log("🔄 Setting up event listeners...");

    // View PDF buttons
    document.querySelectorAll('.view-pdf-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfUrl = btn.getAttribute('data-pdf-url');
            const title = btn.getAttribute('data-title');
            const date = btn.getAttribute('data-date');
            if (pdfUrl && title && date) {
                openPDFModal(pdfUrl, title, date);
            }
        });
    });

    // Click on PDF preview
    document.querySelectorAll('.pdf-preview-container').forEach(container => {
        container.addEventListener('click', (e) => {
            if (e.target.closest('.view-pdf-btn')) return;
            const pdfUrl = container.querySelector('.pdf-canvas')?.getAttribute('data-pdf-url');
            const card = container.closest('.certificate-card');
            const title = card?.querySelector('h4')?.textContent;
            const date = card?.querySelector('p')?.textContent?.replace('Issued: ', '');
            if (pdfUrl && title && date) {
                openPDFModal(pdfUrl, title, date);
            }
        });
    });

    // Close Modal Buttons
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-btn');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closePDFModal();
        });
    });

    // Click outside modal
    const pdfModal = document.getElementById('pdf-modal');
    if (pdfModal) {
        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                closePDFModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('pdf-modal');
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closePDFModal();
        }
    });
}

/**
 * Open PDF modal with specified URL and metadata
 */
function openPDFModal(pdfUrl, title, date) {
    const modal = document.getElementById('pdf-modal');
    const viewer = document.getElementById('pdf-viewer');
    const pdfTitle = document.getElementById('pdf-title');
    const pdfDate = document.getElementById('pdf-date');
    const downloadLink = document.getElementById('pdf-download');
    if (!modal || !viewer || !pdfTitle || !pdfDate || !downloadLink) return;

    pdfTitle.textContent = title;
    pdfDate.textContent = `Issued: ${date}`;
    downloadLink.setAttribute('href', pdfUrl);
    downloadLink.setAttribute('download', `${title}.pdf`);
    viewer.src = `${pdfUrl}#view=fitH`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close PDF modal
 */
function closePDFModal() {
    console.log("Closing PDF modal");
    const modal = document.getElementById('pdf-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const viewer = document.getElementById('pdf-viewer');
    if (viewer) {
        viewer.src = '';
    }
}

/**
 * Track changes to showAll with debug info
 */
function setShowAll(value, source = 'unknown') {
    const oldValue = showAll;
    showAll = value;
    console.log(`[DEBUG] showAll changed from ${oldValue} → ${showAll} [Source: ${source}]`);
}

/**
 * Initialize certificates module
 */
export async function initCertificates() {
    try {
        console.log('Initializing certificates system...');
        if (!document.getElementById('certificates')) {
            console.log('Certificates section not found, skipping initialization');
            return;
        }
        loadFontAwesome();
        await loadPDFJS();
        await renderCertificates(currentCategory);

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setShowAll(false, 'tab-switch');
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderCertificates(btn.dataset.category);
            });
        });

        const viewAllBtn = document.getElementById('view-all-btn');
        if (viewAllBtn && !viewAllBtn.dataset.listenerAdded) {
            viewAllBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                setShowAll(!showAll, 'toggle-button');
                try {
                    await renderCertificates(currentCategory);
                    if (showAll) {
                        setTimeout(() => {
                            const section = document.getElementById('certificates');
                            if (section) {
                                section.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }
                        }, 100);
                    }
                } catch (error) {
                    logError('Error in View All toggle', error);
                }
            });
            viewAllBtn.dataset.listenerAdded = 'true';
        }

        console.log('Certificates system initialized successfully');
    } catch (error) {
        logError('Initialization error', error);
    }
}

if (document.readyState !== 'loading') {
    initCertificates();
} else {
    document.addEventListener('DOMContentLoaded', initCertificates);
}