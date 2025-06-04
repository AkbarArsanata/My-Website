import { projectsData } from './projectsData.js';

export function initProjects() {
  try {
    // DOM elements
    const projectGrid = document.getElementById('project-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMore');
    const projectModal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');
    const modalBody = document.querySelector('.modal-body');
    
    // Initial variables
    let currentFilter = 'all';
    let visibleCount = 3;
    let isLoading = false;
    
    // Format date
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    // Render projects
    const renderProjects = () => {
      const filteredProjects = currentFilter === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.category === currentFilter);
      
      const projectsToShow = filteredProjects.slice(0, visibleCount);
      
      projectGrid.innerHTML = projectsToShow.map(project => `
        <div class="project-card" data-id="${project.id}" data-category="${project.category}">
          <div class="project-media">
            <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
            ${project.featured ? `<span class="project-badge">Featured</span>` : ''}
          </div>
          <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            
            <div class="project-meta">
              <span class="project-date"><i class="far fa-calendar-alt"></i> ${formatDate(project.date)}</span>
              <div class="project-stats">
                <span class="project-stat"><i class="far fa-star"></i> ${project.stars}</span>
                <span class="project-stat"><i class="fas fa-code-branch"></i> ${project.forks}</span>
              </div>
            </div>
            
            <div class="project-tags">
              ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            
            <div class="project-actions">
              <button class="project-btn overview">
                <i class="fas fa-info-circle"></i> Overview
              </button>
              <a href="${project.projectUrl}" class="project-btn demo" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt"></i> View Project
              </a>
              <a href="${project.codeUrl}" class="project-btn code" target="_blank" rel="noopener">
                <i class="fab fa-github"></i> View Code
              </a>
            </div>
          </div>
        </div>
      `).join('');
      
      animateCards();
      updateLoadMoreButton();
    };
    
    const animateCards = () => {
      const cards = document.querySelectorAll('.project-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = 1;
          card.style.transform = 'translateY(0)';
        }, 100 * index);
      });
    };
    
    const updateLoadMoreButton = () => {
      if (!loadMoreBtn) return;
      
      const filteredProjects = currentFilter === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.category === currentFilter);
      
      const progress = (visibleCount / filteredProjects.length) * 113;
      const circle = document.querySelector('.circle-progress');
      if (circle) {
        circle.style.strokeDashoffset = 113 - progress;
      }
      
      loadMoreBtn.style.display = filteredProjects.length > visibleCount ? 'flex' : 'none';
    };
    
    const loadMoreProjects = () => {
      if (isLoading) return;
      
      isLoading = true;
      loadMoreBtn.classList.add('loading');
      
      setTimeout(() => {
        visibleCount += 3;
        renderProjects();
        isLoading = false;
        loadMoreBtn.classList.remove('loading');
      }, 800);
    };
    
    const getTechIcon = (tech) => {
      const icons = {
        'AI': 'fas fa-brain',
        'Python': 'fab fa-python',
        'TensorFlow': 'fas fa-robot',
        'React': 'fab fa-react',
        'D3.js': 'fas fa-chart-line',
        'JavaScript': 'fab fa-js',
        'Machine Learning': 'fas fa-brain',
        'Scikit-learn': 'fas fa-robot',
        'Pandas': 'fas fa-table'
      };
      return icons[tech] || 'fas fa-code';
    };

    // Show project modal
    const showProjectModal = (projectId) => {
      const project = projectsData.find(p => p.id === projectId);
      if (!project) return;
      
      // Add modal-active class to body
      document.body.classList.add('modal-active');
      
      modalBody.innerHTML = `
        <div class="modal-header">
          <div class="modal-header-content">
            <h3>${project.title}</h3>
            <div class="modal-meta">
              <span class="modal-date"><i class="far fa-calendar-alt"></i> ${formatDate(project.date)}</span>
              <div class="modal-stats">
                <span class="modal-stat"><i class="far fa-star"></i> ${project.stars} Stars</span>
                <span class="modal-stat"><i class="fas fa-code-branch"></i> ${project.forks} Forks</span>
              </div>
            </div>
          </div>
          <div class="modal-header-bg" style="background: linear-gradient(135deg, ${project.color1 || '#6e45e2'}, ${project.color2 || '#88d3ce'})"></div>
        </div>
        
        <div class="modal-content-wrapper">
          <div class="modal-media">
            <img src="${project.imageUrl}" alt="${project.title}" class="modal-image">
            <div class="image-overlay"></div>
          </div>
          
          <div class="modal-details">
            <div class="modal-description">
              <h4><i class="fas fa-info-circle"></i> Project Overview</h4>
              <p>${project.longDescription}</p>
              
              ${project.features ? `
                <div class="modal-features">
                  <h5><i class="fas fa-check-circle"></i> Key Features</h5>
                  <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
            
            <div class="modal-sidebar">
              <div class="modal-tech">
                <h4><i class="fas fa-code"></i> Tech Stack</h4>
                <div class="tech-stack">
                  ${project.tags.map(tag => `
                    <div class="tech-item" style="background: ${getTechColor(tag)}">
                      <i class="${getTechIcon(tag)}"></i>
                      <span>${tag}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              ${project.stats ? `
                <div class="modal-stats-grid">
                  ${Object.entries(project.stats).map(([key, value]) => `
                    <div class="stat-item">
                      <div class="stat-value">${value}</div>
                      <div class="stat-label">${key.replace(/-/g, ' ')}</div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <a href="${project.projectUrl}" class="modal-btn demo" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt"></i> View Project
          </a>
          <a href="${project.codeUrl}" class="modal-btn code" target="_blank" rel="noopener">
            <i class="fab fa-github"></i> View Code
          </a>
        </div>
        
        <div class="modal-footer">
          ${project.learnings ? `
            <div class="modal-learnings">
              <h4><i class="fas fa-lightbulb"></i> Key Learnings</h4>
              <p>${project.learnings}</p>
            </div>
          ` : ''}
        </div>
      `;
      
      projectModal.classList.add('active');
      
      // Add animation class after a short delay
      setTimeout(() => {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
          modalContent.classList.add('animate-in');
        }
      }, 10);
    };

    const getTechColor = (tech) => {
      const colors = {
        'AI': 'rgba(255, 126, 95, 0.1)',
        'Python': 'rgba(53, 114, 165, 0.1)',
        'TensorFlow': 'rgba(255, 152, 0, 0.1)',
        'React': 'rgba(97, 218, 251, 0.1)',
        'D3.js': 'rgba(249, 169, 89, 0.1)',
        'JavaScript': 'rgba(247, 223, 30, 0.1)',
        'Machine Learning': 'rgba(0, 150, 199, 0.1)',
        'Scikit-learn': 'rgba(30, 136, 229, 0.1)',
        'Pandas': 'rgba(20, 108, 148, 0.1)'
      };
      return colors[tech] || 'rgba(110, 69, 226, 0.1)';
    };

    const closeProjectModal = () => {
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) {
        modalContent.classList.remove('animate-in');
        modalContent.classList.add('animate-out');
      }
      
      setTimeout(() => {
        projectModal.classList.remove('active');
        document.body.classList.remove('modal-active');
        if (modalContent) {
          modalContent.classList.remove('animate-out');
        }
      }, 300);
    };
    
    // Event listeners
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        visibleCount = 3;
        renderProjects();
      });
    });
    
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMoreProjects);
    }

    projectGrid.addEventListener('click', (e) => {
      // Handle overview button click
      if (e.target.classList.contains('overview')) {
        const card = e.target.closest('.project-card');
        if (card) {
          const projectId = parseInt(card.dataset.id);
          showProjectModal(projectId);
        }
        return;
      }
      
      // Handle clicks on the card itself (if you want to keep that functionality)
      const card = e.target.closest('.project-card');
      if (card && !e.target.closest('.project-btn')) {
        const projectId = parseInt(card.dataset.id);
        showProjectModal(projectId);
      }
    });
    
    
    if (closeModal) {
      closeModal.addEventListener('click', closeProjectModal);
    }
    
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    });
    
    // Initial render
    setTimeout(() => {
      renderProjects();
    }, 500);
    
  } catch (error) {
    console.error('Error initializing projects showcase:', error);
  }
}
