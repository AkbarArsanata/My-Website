/**
 * Footer Module
 * Handles footer-specific functionality
 */

class Footer {
  constructor() {
    this.init();
  }

  init() {
    this.updateCopyrightYear();
    this.addSocialLinkEffects();
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
      // Add hover effects
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px)';
        link.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
        link.style.boxShadow = '';
      });
      
      // Add click feedback
      link.addEventListener('mousedown', () => {
        link.style.transform = 'translateY(0) scale(0.95)';
      });
      
      link.addEventListener('mouseup', () => {
        link.style.transform = 'translateY(-5px)';
      });
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