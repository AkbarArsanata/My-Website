import { initializeApp } from './modules/core.js';

document.addEventListener("DOMContentLoaded", () => {
    initializeApp().catch(error => {
        console.error("Failed to initialize app:", error);
    });

    // Load GoatCounter setelah DOM siap
    const goatScript = document.createElement('script');
    goatScript.src = '//gc.zgo.at/count.js';
    goatScript.async = true;
    goatScript.setAttribute('data-goatcounter', 'https://akbararsanata.goatcounter.com/count'); 
    goatScript.setAttribute('data-goatcounter-debug', '');

    // Kirim hit manual setelah script dimuat
    goatScript.onload = () => {
        if (typeof goatcounter !== 'undefined') {
            console.log('[DEBUG] GoatCounter berhasil dimuat');

            goatcounter.count({
                path: window.location.pathname || '/manual-hit',
                title: 'Debug Hit - Homepage',
                referrer: document.referrer
            });
        }
    };

    goatScript.onerror = () => {
        console.error('[ERROR] Gagal memuat script GoatCounter');
    };

    document.body.appendChild(goatScript);
});
