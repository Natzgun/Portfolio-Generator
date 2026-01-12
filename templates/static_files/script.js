// ============================================
// PORTFOLIO DINÁMICO - Lee datos de data.json
// ============================================
// 
// 🎯 PARA ACTUALIZAR TU PORTFOLIO:
// Solo edita el archivo "data.json" y haz commit a tu repositorio.
// ¡No necesitas modificar ningún otro archivo!
//
// ============================================

class Portfolio {
  constructor() {
    this.data = null;
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.render();
      this.setupNavigation();
      this.showApp();
    } catch (error) {
      console.error('Error loading portfolio:', error);
      this.showError();
    }
  }

  async loadData() {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar data.json');
    }
    this.data = await response.json();
  }

  showApp() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.title = `${this.data.name} - Portfolio`;
  }

  showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
  }

  formatName(name) {
    const parts = name.split(' ');
    if (parts.length > 2) {
      return `${parts[0]} ${parts[1][0]}. ${parts.slice(2).join(' ')}`;
    }
    return name;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  nl2br(text) {
    return this.escapeHtml(text).replace(/\n/g, '<br>');
  }

  hasSection(sectionName) {
    return this.data.sections && this.data.sections.includes(sectionName);
  }

  render() {
    this.renderNavbar();
    this.renderSidebar();
    this.renderMainContent();
  }

  renderNavbar() {
    // Nav name
    document.getElementById('nav-name').textContent = this.formatName(this.data.name);

    // Nav links
    const navLinks = document.getElementById('nav-links');
    let links = '';

    if (this.hasSection('publications') && this.data.publications?.length > 0) {
      links += '<a href="#publications">Publications</a>';
    }
    if (this.hasSection('projects') && this.data.projects?.length > 0) {
      links += '<a href="#portfolio">Portfolio</a>';
    }
    if (this.hasSection('experience') && this.data.experience?.length > 0) {
      links += '<a href="#experience">Experiencia</a>';
    }
    if (this.hasSection('about')) {
      links += '<a href="#about">About</a>';
    }

    navLinks.innerHTML = links;
  }

  renderSidebar() {
    // Profile image
    const imageContainer = document.getElementById('profile-image-container');
    if (this.data.profileImage) {
      imageContainer.innerHTML = `<img src="${this.escapeHtml(this.data.profileImage)}" alt="${this.escapeHtml(this.data.name)}" class="profile-image">`;
    } else {
      imageContainer.innerHTML = `<div class="profile-image-placeholder">${this.data.name[0].toUpperCase()}</div>`;
    }

    // Name and title
    document.getElementById('profile-name').textContent = this.data.name;
    document.getElementById('profile-title').textContent = this.data.title || '';

    // Contact info
    const contactInfo = document.getElementById('contact-info');
    let contactHtml = '';
    const contact = this.data.contact || {};

    if (contact.location) {
      contactHtml += `<div class="contact-item"><span class="contact-icon">📍</span><span>${this.escapeHtml(contact.location)}</span></div>`;
    }
    if (contact.email) {
      contactHtml += `<div class="contact-item"><span class="contact-icon">✉️</span><a href="mailto:${this.escapeHtml(contact.email)}">${this.escapeHtml(contact.email)}</a></div>`;
    }
    if (contact.researchgate) {
      contactHtml += `<div class="contact-item"><span class="contact-icon">R</span><a href="https://www.researchgate.net/profile/${this.escapeHtml(contact.researchgate)}" target="_blank">ResearchGate</a></div>`;
    }
    if (contact.linkedin) {
      contactHtml += `<div class="contact-item"><span class="contact-icon">in</span><a href="https://www.linkedin.com/in/${this.escapeHtml(contact.linkedin)}" target="_blank">LinkedIn</a></div>`;
    }
    if (contact.github) {
      contactHtml += `<div class="contact-item"><span class="contact-icon">🐙</span><a href="https://github.com/${this.escapeHtml(contact.github)}" target="_blank">Github</a></div>`;
    }
    if (contact.scholar) {
      contactHtml += `<div class="contact-item"><span class="contact-icon">🎓</span><a href="https://scholar.google.com/citations?user=${this.escapeHtml(contact.scholar)}" target="_blank">Google Scholar</a></div>`;
    }
    if (contact.orcid) {
      contactHtml += `<div class="contact-item"><span class="contact-icon">O</span><a href="https://orcid.org/${this.escapeHtml(contact.orcid)}" target="_blank">ORCID</a></div>`;
    }

    contactInfo.innerHTML = contactHtml;
  }

  renderMainContent() {
    const mainContent = document.getElementById('main-content');
    let html = '';

    // About section
    if (this.hasSection('about')) {
      html += this.renderAboutSection();
    }

    // Experience section
    if (this.hasSection('experience') && this.data.experience?.length > 0) {
      html += this.renderExperienceSection();
    }

    // Publications section
    if (this.hasSection('publications') && this.data.publications?.length > 0) {
      html += this.renderPublicationsSection();
    }

    // Projects section
    if (this.hasSection('projects') && this.data.projects?.length > 0) {
      html += this.renderProjectsSection();
    }

    mainContent.innerHTML = html;
  }

  renderAboutSection() {
    let aboutText = '';
    if (this.data.about) {
      aboutText = `<div class="about-text">${this.nl2br(this.data.about)}</div>`;
    } else {
      aboutText = `<div class="about-text"><p>Profesional en Ciencias de la Computación especializado en ${this.escapeHtml(this.data.title || '')}.</p></div>`;
    }

    let skillsHtml = '';
    if (this.data.skills?.length > 0) {
      const skillTags = this.data.skills.map(skill =>
        `<span class="skill-tag">${this.escapeHtml(skill)}</span>`
      ).join('');
      skillsHtml = `
        <div class="skills-section">
          <h3>Habilidades Técnicas</h3>
          <div class="skills-tags">${skillTags}</div>
        </div>
      `;
    }

    return `
      <section id="about" class="content-section">
        <h2 class="section-title">About me</h2>
        ${aboutText}
        ${skillsHtml}
      </section>
    `;
  }

  renderExperienceSection() {
    const experienceItems = this.data.experience.map(exp => {
      let meta = '';
      if (exp.organization) meta += `<span class="experience-org">${this.escapeHtml(exp.organization)}</span>`;
      if (exp.location) meta += `<span class="experience-location">${this.escapeHtml(exp.location)}</span>`;
      if (exp.startDate) {
        meta += `<span class="experience-date">${this.escapeHtml(exp.startDate)} - ${exp.endDate ? this.escapeHtml(exp.endDate) : 'Actual'}</span>`;
      }

      return `
        <div class="experience-item">
          <h3 class="experience-title">${this.escapeHtml(exp.title)}</h3>
          <div class="experience-meta">${meta}</div>
          ${exp.description ? `<p class="experience-description">${this.nl2br(exp.description)}</p>` : ''}
        </div>
      `;
    }).join('');

    return `
      <section id="experience" class="content-section">
        <h2 class="section-title">Experiencia</h2>
        ${experienceItems}
      </section>
    `;
  }

  renderPublicationsSection() {
    // Group publications by year
    const byYear = {};
    this.data.publications.forEach(pub => {
      const year = pub.year || 'Sin año';
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(pub);
    });

    // Sort years descending
    const sortedYears = Object.keys(byYear).sort((a, b) => b - a);

    let scholarIntro = '';
    if (this.data.contact?.scholar) {
      scholarIntro = `<p class="section-intro">You can also find my articles on <a href="https://scholar.google.com/citations?user=${this.escapeHtml(this.data.contact.scholar)}" target="_blank">my Google Scholar profile</a>.</p>`;
    }

    const yearsHtml = sortedYears.map(year => {
      const pubsHtml = byYear[year].map(pub => {
        let titleHtml = pub.url
          ? `<a href="${this.escapeHtml(pub.url)}" target="_blank">${this.escapeHtml(pub.title)}</a>`
          : this.escapeHtml(pub.title);

        let imageHtml = '';
        if (pub.image) {
          imageHtml = `
            <div class="publication-image">
              <img src="${this.escapeHtml(pub.image.trim())}" alt="${this.escapeHtml(pub.title)}">
            </div>
          `;
        }

        return `
          <div class="publication-item ${pub.image ? 'has-image' : ''}">
            ${imageHtml}
            <div class="publication-content">
              <h4 class="publication-title">${titleHtml}</h4>
              ${pub.authors ? `<p class="publication-authors">${this.escapeHtml(pub.authors)}</p>` : ''}
              ${pub.venue ? `<p class="publication-venue">Published in <em>${this.escapeHtml(pub.venue)}</em>${pub.year ? `, ${pub.year}` : ''}</p>` : ''}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="publications-year">
          <h3 class="year-title">${year}</h3>
          ${pubsHtml}
        </div>
      `;
    }).join('');

    return `
      <section id="publications" class="content-section">
        <h2 class="section-title">Publications</h2>
        ${scholarIntro}
        ${yearsHtml}
      </section>
    `;
  }

  renderProjectsSection() {
    const projectsHtml = this.data.projects.map(project => {
      let imageHtml = '';
      if (project.image) {
        imageHtml = `
          <div class="project-image">
            <img src="${this.escapeHtml(project.image)}" alt="${this.escapeHtml(project.name)}">
          </div>
        `;
      }

      let titleHtml = project.url
        ? `<a href="${this.escapeHtml(project.url)}" target="_blank">${this.escapeHtml(project.name)}</a>`
        : this.escapeHtml(project.name);

      return `
        <div class="project-card">
          ${imageHtml}
          <div class="project-content">
            <h3 class="project-title">${titleHtml}</h3>
            ${project.description ? `<p class="project-description">${this.nl2br(project.description)}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <section id="portfolio" class="content-section">
        <h2 class="section-title">Portfolio</h2>
        <div class="projects-grid">${projectsHtml}</div>
      </section>
    `;
  }

  setupNavigation() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        history.pushState(null, null, targetId);
      }
    });
  }
}

// Initialize portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', () => new Portfolio());
