let publicationCounter = 0;
let projectCounter = 0;
let experienceCounter = 0;

// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const formSections = document.querySelectorAll('.form-section');
    
    // Navegación por clic
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            updateActiveNav(this);
        });
    });
    
    // Mostrar primera sección por defecto
    if (formSections.length > 0) {
        showSection('basic');
    }
    
    // Detectar cambios en formularios para actualizar indicadores
    const form = document.getElementById('portfolio-form');
    if (form) {
        form.addEventListener('input', updateAllIndicators);
        form.addEventListener('change', updateAllIndicators);
    }
    
    // Inicializar indicadores
    updateAllIndicators();
});

function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function updateActiveNav(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Añadir publicación
function addPublication() {
    const container = document.getElementById('publications-container');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.id = `publication-${publicationCounter}`;
    div.innerHTML = `
        <div class="dynamic-item-header">
            <h3>Publicación ${publicationCounter + 1}</h3>
            <button type="button" class="btn-remove" onclick="removeItem('publication-${publicationCounter}')">Eliminar</button>
        </div>
        <div class="form-group">
            <label>Título *</label>
            <input type="text" name="publications[${publicationCounter}][title]" required>
        </div>
        <div class="form-group">
            <label>Autores</label>
            <input type="text" name="publications[${publicationCounter}][authors]" placeholder="Ej: Autor 1, Autor 2">
        </div>
        <div class="form-group">
            <label>Revista/Conferencia</label>
            <input type="text" name="publications[${publicationCounter}][venue]">
        </div>
        <div class="form-group">
            <label>Año</label>
            <input type="number" name="publications[${publicationCounter}][year]" min="1900" max="2100">
        </div>
        <div class="form-group">
            <label>URL (opcional)</label>
            <input type="url" name="publications[${publicationCounter}][url]">
        </div>
        <div class="form-group">
            <label>Imagen (URL o base64)</label>
            <input type="text" name="publications[${publicationCounter}][image]">
        </div>
    `;
    container.appendChild(div);
    publicationCounter++;
    
    // Actualizar indicadores
    updateIndicator('publications');
    
    // Agregar listeners a los nuevos campos
    const newInputs = div.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', updateAllIndicators);
    });
}

// Añadir proyecto
function addProject() {
    const container = document.getElementById('projects-container');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.id = `project-${projectCounter}`;
    div.innerHTML = `
        <div class="dynamic-item-header">
            <h3>Proyecto ${projectCounter + 1}</h3>
            <button type="button" class="btn-remove" onclick="removeItem('project-${projectCounter}')">Eliminar</button>
        </div>
        <div class="form-group">
            <label>Nombre *</label>
            <input type="text" name="projects[${projectCounter}][name]" required>
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea name="projects[${projectCounter}][description]" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label>URL (opcional)</label>
            <input type="url" name="projects[${projectCounter}][url]">
        </div>
        <div class="form-group">
            <label>Imagen (URL o base64)</label>
            <input type="text" name="projects[${projectCounter}][image]">
        </div>
    `;
    container.appendChild(div);
    projectCounter++;
    
    // Actualizar indicadores
    updateIndicator('projects');
    
    // Agregar listeners
    const newInputs = div.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', updateAllIndicators);
    });
}

// Añadir experiencia
function addExperience() {
    const container = document.getElementById('experience-container');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.id = `experience-${experienceCounter}`;
    div.innerHTML = `
        <div class="dynamic-item-header">
            <h3>Experiencia ${experienceCounter + 1}</h3>
            <button type="button" class="btn-remove" onclick="removeItem('experience-${experienceCounter}')">Eliminar</button>
        </div>
        <div class="form-group">
            <label>Título *</label>
            <input type="text" name="experience[${experienceCounter}][title]" required>
        </div>
        <div class="form-group">
            <label>Organización</label>
            <input type="text" name="experience[${experienceCounter}][organization]">
        </div>
        <div class="form-group">
            <label>Ubicación</label>
            <input type="text" name="experience[${experienceCounter}][location]">
        </div>
        <div class="form-group">
            <label>Fecha inicio</label>
            <input type="month" name="experience[${experienceCounter}][startDate]">
        </div>
        <div class="form-group">
            <label>Fecha fin (dejar vacío si es actual)</label>
            <input type="month" name="experience[${experienceCounter}][endDate]">
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea name="experience[${experienceCounter}][description]" rows="4"></textarea>
        </div>
    `;
    container.appendChild(div);
    experienceCounter++;
    
    // Actualizar indicadores
    updateIndicator('experience');
    
    // Agregar listeners
    const newInputs = div.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', updateAllIndicators);
    });
}

// Eliminar item
function removeItem(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
        updateAllIndicators();
    }
}

// Actualizar todos los indicadores
function updateAllIndicators() {
    updateIndicator('basic');
    updateIndicator('contact');
    updateIndicator('sections');
    updateIndicator('experience');
    updateIndicator('publications');
    updateIndicator('projects');
    updateIndicator('skills');
}

// Actualizar indicador de una sección específica
function updateIndicator(sectionId) {
    const statusElement = document.getElementById(`status-${sectionId}`);
    if (!statusElement) return;
    
    let filled = 0;
    let total = 0;
    
    switch(sectionId) {
        case 'basic':
            const name = document.getElementById('name')?.value.trim() || '';
            const title = document.getElementById('title')?.value.trim() || '';
            total = 2; // Solo nombre y título son requeridos
            filled = (name ? 1 : 0) + (title ? 1 : 0);
            break;
            
        case 'contact':
            const contactFields = ['location', 'email', 'github', 'linkedin', 'researchgate', 'scholar', 'orcid'];
            total = contactFields.length;
            filled = contactFields.filter(field => {
                const value = document.getElementById(field)?.value.trim() || '';
                return value.length > 0;
            }).length;
            break;
            
        case 'sections':
            const sectionCheckboxes = document.querySelectorAll('input[name="sections"]:checked');
            total = 1; // Mínimo 1 sección
            filled = sectionCheckboxes.length > 0 ? 1 : 0;
            break;
            
        case 'experience':
            const expItems = document.querySelectorAll('#experience-container .dynamic-item');
            total = 1; // Mínimo 1 item para considerar completa
            if (expItems.length === 0) {
                filled = 0;
            } else {
                // Verificar si al menos un item tiene título (requerido)
                const hasCompleteExp = Array.from(expItems).some(item => {
                    const titleInput = item.querySelector('input[name^="experience"][name*="[title]"]');
                    return titleInput && titleInput.value.trim().length > 0;
                });
                filled = hasCompleteExp ? 1 : 0.5; // 0.5 = parcial
            }
            break;
            
        case 'publications':
            const pubItems = document.querySelectorAll('#publications-container .dynamic-item');
            total = 1;
            if (pubItems.length === 0) {
                filled = 0;
            } else {
                const hasCompletePub = Array.from(pubItems).some(item => {
                    const titleInput = item.querySelector('input[name^="publications"][name*="[title]"]');
                    return titleInput && titleInput.value.trim().length > 0;
                });
                filled = hasCompletePub ? 1 : 0.5;
            }
            break;
            
        case 'projects':
            const projItems = document.querySelectorAll('#projects-container .dynamic-item');
            total = 1;
            if (projItems.length === 0) {
                filled = 0;
            } else {
                const hasCompleteProj = Array.from(projItems).some(item => {
                    const nameInput = item.querySelector('input[name^="projects"][name*="[name]"]');
                    return nameInput && nameInput.value.trim().length > 0;
                });
                filled = hasCompleteProj ? 1 : 0.5;
            }
            break;
            
        case 'skills':
            const skills = document.getElementById('skills')?.value.trim() || '';
            total = 1;
            filled = skills.length > 0 ? 1 : 0;
            break;
    }
    
    // Actualizar estado visual
    statusElement.className = 'nav-status';
    if (filled === 0) {
        statusElement.classList.add('empty');
    } else if (filled < total) {
        statusElement.classList.add('partial');
    } else {
        statusElement.classList.add('complete');
    }
}

// Recopilar datos del formulario
function collectFormData() {
    const form = document.getElementById('portfolio-form');
    const formData = new FormData(form);
    const data = {};

    // Información básica
    data.name = formData.get('name') || '';
    data.title = formData.get('title') || '';
    data.profileImage = formData.get('profileImage') || '';
    data.about = formData.get('about') || '';

    // Contacto
    data.contact = {
        location: formData.get('location') || '',
        email: formData.get('email') || '',
        github: formData.get('github') || '',
        linkedin: formData.get('linkedin') || '',
        researchgate: formData.get('researchgate') || '',
        scholar: formData.get('scholar') || '',
        orcid: formData.get('orcid') || ''
    };

    // Secciones seleccionadas
    data.sections = formData.getAll('sections');

    // Habilidades
    const skillsStr = formData.get('skills') || '';
    data.skills = skillsStr.split(',').map(s => s.trim()).filter(s => s);

    // Publicaciones
    data.publications = [];
    const pubInputs = form.querySelectorAll('input[name^="publications["], textarea[name^="publications["]');
    const pubMap = {};
    pubInputs.forEach(input => {
        const match = input.name.match(/publications\[(\d+)\]\[(\w+)\]/);
        if (match) {
            const index = match[1];
            const field = match[2];
            if (!pubMap[index]) {
                pubMap[index] = {};
            }
            pubMap[index][field] = input.value || '';
        }
    });
    Object.keys(pubMap).forEach(key => {
        const pub = pubMap[key];
        if (pub.title) {
            data.publications.push(pub);
        }
    });

    // Proyectos
    data.projects = [];
    const projInputs = form.querySelectorAll('input[name^="projects["], textarea[name^="projects["]');
    const projMap = {};
    projInputs.forEach(input => {
        const match = input.name.match(/projects\[(\d+)\]\[(\w+)\]/);
        if (match) {
            const index = match[1];
            const field = match[2];
            if (!projMap[index]) {
                projMap[index] = {};
            }
            projMap[index][field] = input.value || '';
        }
    });
    Object.keys(projMap).forEach(key => {
        const proj = projMap[key];
        if (proj.name) {
            data.projects.push(proj);
        }
    });

    // Experiencia
    data.experience = [];
    const expInputs = form.querySelectorAll('input[name^="experience["], textarea[name^="experience["]');
    const expMap = {};
    expInputs.forEach(input => {
        const match = input.name.match(/experience\[(\d+)\]\[(\w+)\]/);
        if (match) {
            const index = match[1];
            const field = match[2];
            if (!expMap[index]) {
                expMap[index] = {};
            }
            expMap[index][field] = input.value || '';
        }
    });
    Object.keys(expMap).forEach(key => {
        const exp = expMap[key];
        if (exp.title) {
            data.experience.push(exp);
        }
    });

    return data;
}

// Vista previa - abre en nueva ventana
async function previewPortfolio() {
    const data = collectFormData();
    
    if (!data.name || !data.title) {
        alert('Por favor completa al menos el nombre y título');
        return;
    }

    try {
        const response = await fetch('/preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const html = await response.text();
        
        // Crear un blob URL y abrir en nueva ventana
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const previewWindow = window.open(url, '_blank');
        
        // Limpiar el URL después de un tiempo
        if (previewWindow) {
            previewWindow.onload = function() {
                setTimeout(() => URL.revokeObjectURL(url), 100);
            };
        } else {
            URL.revokeObjectURL(url);
            alert('Por favor permite ventanas emergentes para ver la vista previa');
        }
    } catch (error) {
        console.error('Error al generar vista previa:', error);
        alert('Error al generar la vista previa');
    }
}

// Descargar
async function downloadPortfolio() {
    const data = collectFormData();
    
    if (!data.name || !data.title) {
        alert('Por favor completa al menos el nombre y título');
        return;
    }

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio_${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            alert('Error al descargar el portafolio');
        }
    } catch (error) {
        console.error('Error al descargar:', error);
        alert('Error al descargar el portafolio');
    }
}

// Manejar cambios en las secciones seleccionadas
document.addEventListener('DOMContentLoaded', function() {
    const sectionToggles = document.querySelectorAll('input[name="sections"]');
    const sectionsMap = {
        'experience': document.getElementById('section-experience'),
        'publications': document.getElementById('section-publications'),
        'projects': document.getElementById('section-projects')
    };
    
    function toggleSections() {
        sectionToggles.forEach(toggle => {
            const sectionId = toggle.value;
            const section = sectionsMap[sectionId];
            if (section) {
                if (toggle.checked) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            }
        });
        updateIndicator('sections');
    }
    
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('change', toggleSections);
    });
    
    toggleSections();
});
