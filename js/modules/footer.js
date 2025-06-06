/**
 * Footer Module
 * Handles footer-specific functionality including visitor history and UI interactions
 */

class Footer {
  constructor() {
    this.init();
  }

  init() {
    console.log('[LOCAL DEBUG] Inisialisasi Footer dimulai...');
    this.updateCopyrightYear();
    this.addSocialLinkEffects();
    this.recordVisit();           // Catat kunjungan saat ini
    this.displayVisitHistory();   // Tampilkan riwayat kunjungan
  }

  updateCopyrightYear() {
    try {
      const yearElement = document.getElementById('current-year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        console.log(`[LOCAL DEBUG] Copyright tahun diperbarui menjadi ${new Date().getFullYear()}`);
      }
    } catch (error) {
      console.error('Failed to update copyright year:', error);
    }
  }

  addSocialLinkEffects() {
    const socialLinks = document.querySelectorAll('.social-link');

    if (socialLinks.length === 0) {
      console.warn('[LOCAL DEBUG] Tidak ada .social-link ditemukan untuk efek interaksi.');
      return;
    }

    console.log(`[LOCAL DEBUG] Menambahkan efek hover ke ${socialLinks.length} ikon sosial`);

    socialLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px)';
        link.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
        link.style.boxShadow = '';
      });

      link.addEventListener('mousedown', () => {
        link.style.transform = 'translateY(0) scale(0.95)';
      });

      link.addEventListener('mouseup', () => {
        link.style.transform = 'translateY(-5px)';
      });
    });
  }

  recordVisit() {
    const key = 'visitor_history';
    let visits = JSON.parse(localStorage.getItem(key)) || [];

    const now = new Date().toLocaleString();

    visits.push(now);

    // Batasi hanya menyimpan 5 entri terakhir
    if (visits.length > 5) {
      visits.shift();
    }

    localStorage.setItem(key, JSON.stringify(visits));

    console.log(`[LOCAL DEBUG] Kunjungan dicatat: ${now}`);
  }

  displayVisitHistory() {
    const container = document.getElementById('riwayat-kunjungan');
    if (!container) {
      console.warn('[LOCAL DEBUG] #riwayat-kunjungan tidak ditemukan di DOM.');
      return;
    }

    const key = 'visitor_history';
    const visits = JSON.parse(localStorage.getItem(key)) || [];

    if (visits.length === 0) {
      container.innerHTML = '<p>Belum ada riwayat kunjungan.</p>';
      console.log('[LOCAL DEBUG] Belum ada riwayat kunjungan tersimpan.');
      return;
    }

    container.innerHTML = `
      <h4>Riwayat Kunjungan:</h4>
      <ul></ul>
    `;

    const ul = container.querySelector('ul');

    visits.slice().reverse().forEach((visitTime) => {
      const li = document.createElement('li');
      li.textContent = visitTime;
      ul.appendChild(li);
    });

    console.log(`[LOCAL DEBUG] Menampilkan ${visits.length} riwayat kunjungan`);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('[LOCAL DEBUG] DOMContentLoaded terpicu. Membuat instance Footer...');
  new Footer();
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Footer;
}
