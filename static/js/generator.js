let publicationCounter = 0;
let projectCounter = 0;
let experienceCounter = 0;

// Almacén de imágenes subidas: mapea inputId -> {fileName, base64}
const uploadedImages = {};

// ==================== Toast Notifications ====================

function showToast(type, title, message) {
    // Crear contenedor si no existe
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Animar entrada
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== Manejo de Imágenes ====================

// Manejar subida de imagen y convertir a base64
function handleImageUpload(input, targetInputId, previewId) {
    const file = input.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. El tamaño máximo es 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Data = e.target.result;

        // Guardar el base64 en el input (para que funcione la vista previa)
        const targetInput = document.getElementById(targetInputId);
        if (targetInput) {
            // Guardar el base64 directamente en el value (para vista previa)
            targetInput.value = base64Data;
            targetInput.dataset.isUploaded = 'true';

            // Guardar la referencia para descarga con nombre de archivo
            const fileName = `assets/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            uploadedImages[targetInputId] = {
                fileName: fileName,
                base64: base64Data
            };
        }

        // Mostrar preview
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.innerHTML = `
                <img src="${base64Data}" alt="Preview">
                <button type="button" class="btn-remove-image" onclick="removeImage('${targetInputId}', '${previewId}', '${input.id}')">✕</button>
            `;
        }
    };
    reader.readAsDataURL(file);
}

// Remover imagen subida
function removeImage(targetInputId, previewId, fileInputId) {
    const targetInput = document.getElementById(targetInputId);
    if (targetInput) {
        // Remover del almacén
        delete uploadedImages[targetInputId];
        targetInput.value = '';
        targetInput.dataset.isUploaded = 'false';
    }

    const preview = document.getElementById(previewId);
    if (preview) {
        preview.innerHTML = '';
    }

    const fileInput = document.getElementById(fileInputId);
    if (fileInput) {
        fileInput.value = '';
    }
}

// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav-item');
    const formSections = document.querySelectorAll('.form-section');

    // Navegación por clic
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
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

    // Manejar checkboxes de secciones para mostrar/ocultar
    setupSectionToggles();
});

// Configurar toggles de secciones
function setupSectionToggles() {
    const toggles = {
        'toggle-experience': 'section-experience',
        'toggle-publications': 'section-publications',
        'toggle-projects': 'section-projects'
    };

    Object.entries(toggles).forEach(([toggleId, sectionId]) => {
        const checkbox = document.getElementById(toggleId);
        const section = document.getElementById(sectionId);
        const navItem = document.querySelector(`[data-section="${sectionId.replace('section-', '')}"]`);

        if (checkbox && section) {
            // Estado inicial
            if (checkbox.checked) {
                section.classList.remove('hidden');
                if (navItem) navItem.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
                if (navItem) navItem.classList.add('hidden');
            }

            // Escuchar cambios
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    section.classList.remove('hidden');
                    if (navItem) navItem.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                    if (navItem) navItem.classList.add('hidden');
                }
                updateAllIndicators();
            });
        }
    });
}

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
    const imageInputId = `pub-image-${publicationCounter}`;
    const imageFileId = `pub-image-file-${publicationCounter}`;
    const imagePreviewId = `pub-image-preview-${publicationCounter}`;

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
            <label>Imagen</label>
            <div class="image-input-group">
                <div class="image-upload-option">
                    <label class="btn-upload btn-upload-small">
                        <input type="file" id="${imageFileId}" accept="image/*" data-target="${imageInputId}" data-preview="${imagePreviewId}">
                        📁 Subir
                    </label>
                    <span class="upload-or">o</span>
                    <input type="text" id="${imageInputId}" name="publications[${publicationCounter}][image]" placeholder="URL de imagen">
                </div>
                <div class="image-preview image-preview-small" id="${imagePreviewId}"></div>
            </div>
        </div>
    `;
    container.appendChild(div);

    // Agregar event listener para el input de archivo
    const fileInput = document.getElementById(imageFileId);
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            handleImageUpload(this, this.dataset.target, this.dataset.preview);
        });
    }

    publicationCounter++;

    // Actualizar indicadores
    updateIndicator('publications');

    // Agregar listeners a los nuevos campos
    const newInputs = div.querySelectorAll('input:not([type="file"]), textarea');
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
    const imageInputId = `proj-image-${projectCounter}`;
    const imageFileId = `proj-image-file-${projectCounter}`;
    const imagePreviewId = `proj-image-preview-${projectCounter}`;

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
            <label>Imagen</label>
            <div class="image-input-group">
                <div class="image-upload-option">
                    <label class="btn-upload btn-upload-small">
                        <input type="file" id="${imageFileId}" accept="image/*" data-target="${imageInputId}" data-preview="${imagePreviewId}">
                        📁 Subir
                    </label>
                    <span class="upload-or">o</span>
                    <input type="text" id="${imageInputId}" name="projects[${projectCounter}][image]" placeholder="URL de imagen">
                </div>
                <div class="image-preview image-preview-small" id="${imagePreviewId}"></div>
            </div>
        </div>
    `;
    container.appendChild(div);

    // Agregar event listener para el input de archivo
    const fileInput = document.getElementById(imageFileId);
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            handleImageUpload(this, this.dataset.target, this.dataset.preview);
        });
    }

    projectCounter++;

    // Actualizar indicadores
    updateIndicator('projects');

    // Agregar listeners
    const newInputs = div.querySelectorAll('input:not([type="file"]), textarea');
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

// Almacenar porcentajes de cada sección para el cálculo total
const sectionProgress = {
    basic: 0,
    contact: 0,
    sections: 0,
    experience: 0,
    publications: 0,
    projects: 0,
    skills: 0
};

// Actualizar todos los indicadores
function updateAllIndicators() {
    updateIndicator('basic');
    updateIndicator('contact');
    updateIndicator('sections');
    updateIndicator('experience');
    updateIndicator('publications');
    updateIndicator('projects');
    updateIndicator('skills');
    updateOverallProgress();
}

// Actualizar barra de progreso general
function updateOverallProgress() {
    const percentages = Object.values(sectionProgress);
    const average = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);

    const overallPercent = document.getElementById('overall-percent');
    const overallBar = document.getElementById('overall-progress-bar');

    if (overallPercent) {
        overallPercent.textContent = `${average}%`;
    }
    if (overallBar) {
        overallBar.style.width = `${average}%`;
    }
}

// Actualizar indicador de una sección específica
function updateIndicator(sectionId) {
    const statusElement = document.getElementById(`status-${sectionId}`);
    if (!statusElement) return;

    let percentage = 0;

    switch (sectionId) {
        case 'basic':
            const basicFields = ['name', 'title', 'profile-image', 'about'];
            const basicFilled = basicFields.filter(field => {
                const el = document.getElementById(field);
                return el && el.value.trim().length > 0;
            }).length;
            percentage = Math.round((basicFilled / basicFields.length) * 100);
            break;

        case 'contact':
            const contactFields = ['location', 'email', 'github', 'linkedin', 'researchgate', 'scholar', 'orcid'];
            const contactFilled = contactFields.filter(field => {
                const el = document.getElementById(field);
                return el && el.value.trim().length > 0;
            }).length;
            percentage = Math.round((contactFilled / contactFields.length) * 100);
            break;

        case 'sections':
            const sectionCheckboxes = document.querySelectorAll('input[name="sections"]:checked');
            percentage = sectionCheckboxes.length > 0 ? 100 : 0;
            break;

        case 'experience':
            const expItems = document.querySelectorAll('#experience-container .dynamic-item');
            if (expItems.length === 0) {
                percentage = 0;
            } else {
                let totalFields = 0;
                let filledFields = 0;
                expItems.forEach(item => {
                    const inputs = item.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        totalFields++;
                        if (input.value.trim().length > 0) filledFields++;
                    });
                });
                percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
            }
            break;

        case 'publications':
            const pubItems = document.querySelectorAll('#publications-container .dynamic-item');
            if (pubItems.length === 0) {
                percentage = 0;
            } else {
                let totalFields = 0;
                let filledFields = 0;
                pubItems.forEach(item => {
                    const inputs = item.querySelectorAll('input:not([type="file"]), textarea');
                    inputs.forEach(input => {
                        totalFields++;
                        if (input.value.trim().length > 0) filledFields++;
                    });
                });
                percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
            }
            break;

        case 'projects':
            const projItems = document.querySelectorAll('#projects-container .dynamic-item');
            if (projItems.length === 0) {
                percentage = 0;
            } else {
                let totalFields = 0;
                let filledFields = 0;
                projItems.forEach(item => {
                    const inputs = item.querySelectorAll('input:not([type="file"]), textarea');
                    inputs.forEach(input => {
                        totalFields++;
                        if (input.value.trim().length > 0) filledFields++;
                    });
                });
                percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
            }
            break;

        case 'skills':
            const skills = document.getElementById('skills')?.value.trim() || '';
            percentage = skills.length > 0 ? 100 : 0;
            break;
    }

    // Guardar el porcentaje
    sectionProgress[sectionId] = percentage;

    // Actualizar texto y estado visual
    statusElement.textContent = `${percentage}%`;
    statusElement.className = 'nav-status';

    if (percentage === 0) {
        statusElement.classList.add('empty');
    } else if (percentage < 100) {
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
            previewWindow.onload = function () {
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

// Descargar portfolio con JSON editable
async function downloadPortfolio() {
    const data = collectFormData();

    if (!data.name || !data.title) {
        alert('Por favor completa al menos el nombre y título');
        return;
    }

    // Preparar las imágenes subidas para el servidor
    // Crear un mapeo de base64 -> fileName
    const imagesToUpload = {};
    const base64ToFileName = {};

    for (const [inputId, imageData] of Object.entries(uploadedImages)) {
        imagesToUpload[imageData.fileName] = imageData.base64;
        base64ToFileName[imageData.base64] = imageData.fileName;
    }

    // Crear una copia de data para modificar
    const downloadData = JSON.parse(JSON.stringify(data));

    // Función para reemplazar base64 por ruta de archivo
    function replaceBase64WithPath(value) {
        if (value && value.startsWith('data:image/') && base64ToFileName[value]) {
            return base64ToFileName[value];
        }
        return value;
    }

    // Reemplazar base64 por rutas de archivo en los datos
    // Profile image
    downloadData.profileImage = replaceBase64WithPath(downloadData.profileImage);

    // Publications images
    if (downloadData.publications) {
        downloadData.publications.forEach(pub => {
            pub.image = replaceBase64WithPath(pub.image);
        });
    }

    // Projects images
    if (downloadData.projects) {
        downloadData.projects.forEach(proj => {
            proj.image = replaceBase64WithPath(proj.image);
        });
    }

    // Agregar las imágenes al payload
    downloadData.uploadedImages = imagesToUpload;

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadData)
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

            // Mostrar toast de éxito
            showToast('success', '¡Portfolio descargado!', 'Edita data.json para actualizar tu portfolio');
        } else {
            showToast('error', 'Error', 'No se pudo descargar el portafolio');
        }
    } catch (error) {
        console.error('Error al descargar:', error);
        showToast('error', 'Error', 'No se pudo descargar el portafolio');
    }
}

// Manejar cambios en las secciones seleccionadas
document.addEventListener('DOMContentLoaded', function () {
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

// ==================== JSON Import ====================

// Importar datos desde JSON (data.json del portfolio)
async function importJSON(input) {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/import-json', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            loadDataIntoForm(result);
            showToast('success', '¡Datos cargados!', 'Ahora puedes editar y descargar tu portfolio');
        } else {
            showToast('error', 'Error', result.error);
        }
    } catch (error) {
        console.error('Error al importar:', error);
        showToast('error', 'Error', 'No se pudo importar el archivo JSON');
    }

    // Limpiar el input para permitir reimportar el mismo archivo
    input.value = '';
}

// Cargar datos importados en el formulario
function loadDataIntoForm(data) {
    // Limpiar formulario
    clearForm();

    // Información básica
    if (data.name) document.getElementById('name').value = data.name;
    if (data.title) document.getElementById('title').value = data.title;
    if (data.profileImage) document.getElementById('profile-image').value = data.profileImage;
    if (data.about) document.getElementById('about').value = data.about;

    // Contacto
    if (data.contact) {
        if (data.contact.location) document.getElementById('location').value = data.contact.location;
        if (data.contact.email) document.getElementById('email').value = data.contact.email;
        if (data.contact.github) document.getElementById('github').value = data.contact.github;
        if (data.contact.linkedin) document.getElementById('linkedin').value = data.contact.linkedin;
        if (data.contact.researchgate) document.getElementById('researchgate').value = data.contact.researchgate;
        if (data.contact.scholar) document.getElementById('scholar').value = data.contact.scholar;
        if (data.contact.orcid) document.getElementById('orcid').value = data.contact.orcid;
    }

    // Secciones
    if (data.sections && Array.isArray(data.sections)) {
        document.querySelectorAll('input[name="sections"]').forEach(checkbox => {
            checkbox.checked = data.sections.includes(checkbox.value);
        });
    }

    // Habilidades
    if (data.skills && Array.isArray(data.skills)) {
        document.getElementById('skills').value = data.skills.join(', ');
    }

    // Experiencia
    if (data.experience && Array.isArray(data.experience)) {
        data.experience.forEach(exp => {
            addExperience();
            const container = document.getElementById('experience-container');
            const lastItem = container.lastElementChild;
            if (lastItem) {
                const inputs = lastItem.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    const match = input.name.match(/experience\[\d+\]\[(\w+)\]/);
                    if (match && exp[match[1]]) {
                        input.value = exp[match[1]];
                    }
                });
            }
        });
    }

    // Publicaciones
    if (data.publications && Array.isArray(data.publications)) {
        data.publications.forEach(pub => {
            addPublication();
            const container = document.getElementById('publications-container');
            const lastItem = container.lastElementChild;
            if (lastItem) {
                const inputs = lastItem.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    const match = input.name.match(/publications\[\d+\]\[(\w+)\]/);
                    if (match && pub[match[1]]) {
                        input.value = pub[match[1]];
                    }
                });
            }
        });
    }

    // Proyectos
    if (data.projects && Array.isArray(data.projects)) {
        data.projects.forEach(proj => {
            addProject();
            const container = document.getElementById('projects-container');
            const lastItem = container.lastElementChild;
            if (lastItem) {
                const inputs = lastItem.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    const match = input.name.match(/projects\[\d+\]\[(\w+)\]/);
                    if (match && proj[match[1]]) {
                        input.value = proj[match[1]];
                    }
                });
            }
        });
    }

    // Actualizar indicadores y secciones visibles
    updateAllIndicators();

    // Disparar evento change en los checkboxes de secciones para mostrar/ocultar
    const event = new Event('change');
    document.querySelectorAll('input[name="sections"]').forEach(checkbox => {
        checkbox.dispatchEvent(event);
    });
}

// Limpiar formulario
function clearForm() {
    // Limpiar campos básicos
    document.getElementById('name').value = '';
    document.getElementById('title').value = '';
    document.getElementById('profile-image').value = '';
    document.getElementById('about').value = '';

    // Limpiar contacto
    ['location', 'email', 'github', 'linkedin', 'researchgate', 'scholar', 'orcid'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // Limpiar habilidades
    document.getElementById('skills').value = '';

    // Limpiar contenedores dinámicos
    document.getElementById('experience-container').innerHTML = '';
    document.getElementById('publications-container').innerHTML = '';
    document.getElementById('projects-container').innerHTML = '';

    // Resetear contadores
    experienceCounter = 0;
    publicationCounter = 0;
    projectCounter = 0;

    // Resetear checkboxes de secciones
    document.querySelectorAll('input[name="sections"]').forEach(checkbox => {
        checkbox.checked = checkbox.value === 'about';
    });

    updateAllIndicators();
}
