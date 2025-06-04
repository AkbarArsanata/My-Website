/**
 * Footer Module
 * Handles footer-specific functionality including visitor history and counter
 */

class Footer {
  constructor() {
    this.init();
  }

  init() {
    this.updateCopyrightYear();
    this.addSocialLinkEffects();
    this.recordVisit();           // Catat kunjungan saat ini
    this.displayVisitHistory();   // Tampilkan riwayat kunjungan
    fetchVisitorCount();          // Ambil jumlah pengunjung dari Counter.dev
  }

  updateCopyrightYear() {
    try {
      const yearElement = document.getElementById('current-year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    } catch (error) {
      console.error('Failed to update copyright year:', error);
    }
  }

  addSocialLinkEffects() {
    const socialLinks = document.querySelectorAll('.social-link');

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
  }

  displayVisitHistory() {
    const container = document.getElementById('riwayat-kunjungan');
    if (!container) return;

    const key = 'visitor_history';
    const visits = JSON.parse(localStorage.getItem(key)) || [];

    if (visits.length === 0) {
      container.innerHTML = '<p>Belum ada riwayat kunjungan.</p>';
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
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Footer();
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Footer;
}

// Fungsi untuk mengambil jumlah pengunjung dari Counter.dev
async function fetchVisitorCount() {
    const siteId = 'YOUR_COUNTERDEV_ID_HERE'; // Ganti dengan ID dari counter.dev
    const apiUrl = `https://counter.dev/api/count/site?id=${siteId}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.total) {
            document.getElementById('counter-value').textContent = data.total;
        } else {
            document.getElementById('counter-value').textContent = '0';
        }
    } catch (error) {
        console.error('Gagal mengambil jumlah pengunjung:', error);
        document.getElementById('counter-value').textContent = '?';
    }
}