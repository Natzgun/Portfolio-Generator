from flask import Flask, render_template, request, jsonify, send_file, make_response
import os
import json
import zipfile
import io
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'portfolio-generator-secret-key'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generator')
def generator():
    return render_template('generator.html')

def group_publications_by_year(publications):
    """Agrupa publicaciones por año"""
    grouped = {}
    for pub in publications:
        year = pub.get('year', '')
        if year:
            if year not in grouped:
                grouped[year] = []
            grouped[year].append(pub)
    # Ordenar años descendente
    sorted_years = sorted(grouped.keys(), reverse=True)
    return {year: grouped[year] for year in sorted_years}

def filter_sections(data):
    """Filtra las secciones según las seleccionadas por el usuario"""
    sections = data.get('sections', [])
    
    # Si no hay secciones seleccionadas, mostrar todas
    if not sections:
        return data
    
    # Filtrar publicaciones
    if 'publications' not in sections:
        data['publications'] = []
        data['publications_by_year'] = {}
    
    # Filtrar proyectos
    if 'projects' not in sections:
        data['projects'] = []
    
    # Filtrar experiencia
    if 'experience' not in sections:
        data['experience'] = []
    
    return data

@app.route('/preview', methods=['POST'])
def preview():
    data = request.json
    data = filter_sections(data)
    if 'publications' in data and data['publications']:
        data['publications_by_year'] = group_publications_by_year(data['publications'])
    return render_template('portfolio_template.html', portfolio=data)

@app.route('/import-json', methods=['POST'])
def import_json():
    """Importa datos de un archivo JSON (data.json del portfolio)"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No se envió ningún archivo'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
        
        if not file.filename.endswith('.json'):
            return jsonify({'error': 'El archivo debe ser .json'}), 400
        
        content = file.read().decode('utf-8')
        data = json.loads(content)
        
        return jsonify(data)
    except json.JSONDecodeError as e:
        return jsonify({'error': f'Error al parsear JSON: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


import base64
import re

def process_uploaded_images(data, zip_file):
    """
    Procesa las imágenes subidas (base64) y las agrega al ZIP.
    Retorna el data modificado con las rutas correctas.
    """
    uploaded_images = data.pop('uploadedImages', {})
    
    for file_path, base64_data in uploaded_images.items():
        try:
            # Extraer el contenido base64 (remover el prefijo data:image/xxx;base64,)
            if ',' in base64_data:
                base64_content = base64_data.split(',')[1]
            else:
                base64_content = base64_data
            
            # Decodificar y agregar al ZIP
            image_bytes = base64.b64decode(base64_content)
            zip_file.writestr(file_path, image_bytes)
        except Exception as e:
            print(f"Error procesando imagen {file_path}: {e}")
    
    return data


@app.route('/download', methods=['POST'])
def download():
    """
    Descarga un portfolio estático con archivos separados: HTML, CSS, JS y JSON.
    El usuario solo necesita editar data.json para actualizar su portfolio.
    """
    data = request.json
    data = filter_sections(data)
    
    # Crear un buffer en memoria para el ZIP
    zip_buffer = io.BytesIO()
    
    # Ruta a los archivos estáticos
    static_files_path = os.path.join(os.path.dirname(__file__), 'templates', 'static_files')
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # 1. Agregar index.html
        with open(os.path.join(static_files_path, 'index.html'), 'r', encoding='utf-8') as f:
            zip_file.writestr('index.html', f.read().encode('utf-8'))
        
        # 2. Agregar styles.css
        with open(os.path.join(static_files_path, 'styles.css'), 'r', encoding='utf-8') as f:
            zip_file.writestr('styles.css', f.read().encode('utf-8'))
        
        # 3. Agregar script.js
        with open(os.path.join(static_files_path, 'script.js'), 'r', encoding='utf-8') as f:
            zip_file.writestr('script.js', f.read().encode('utf-8'))
        
        # 4. Procesar y agregar imágenes subidas
        data = process_uploaded_images(data, zip_file)
        
        # 5. Crear el archivo data.json con los datos del portfolio
        # Limpiar datos para JSON (remover publications_by_year si existe)
        json_data = {k: v for k, v in data.items() if k != 'publications_by_year'}
        json_content = json.dumps(json_data, ensure_ascii=False, indent=2)
        zip_file.writestr('data.json', json_content.encode('utf-8'))
        
        # 6. Crear un README detallado con instrucciones de actualización
        readme = f"""# 🎨 Tu Portfolio Personal

Este portafolio fue generado el {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.

## 📁 Estructura de archivos

```
portfolio/
├── index.html    # Estructura HTML
├── styles.css    # Estilos CSS (personalizable)
├── script.js     # Lógica JavaScript
├── data.json     # ⭐ TUS DATOS - Edita este archivo para actualizar
├── assets/       # 📷 Tus imágenes subidas
└── README.md     # Este archivo
```

## 🚀 Cómo usar

### Ver localmente
⚠️ **Importante**: Debido a restricciones de seguridad del navegador, necesitas un servidor local:

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx serve

# Opción 3: VS Code
# Instala la extensión "Live Server" y haz clic derecho en index.html > "Open with Live Server"
```

Luego abre http://localhost:8000 en tu navegador.

### Subir a GitHub Pages
1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings > Pages > Source: main branch
4. Tu portfolio estará en: `https://tu-usuario.github.io/tu-repo`

## ✏️ Cómo actualizar tu portfolio

### 🎯 ¡SOLO EDITA `data.json`!

No necesitas tocar HTML, CSS ni JS. Simplemente:

1. Abre `data.json` en cualquier editor de texto
2. Modifica tus datos
3. Guarda y sube los cambios con git

### Estructura de data.json

```json
{{
  "name": "Tu Nombre",
  "title": "Tu Título Profesional",
  "profileImage": "https://url-de-tu-imagen.jpg",
  "about": "Tu descripción personal...",
  "sections": ["about", "experience", "publications", "projects"],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "contact": {{
    "email": "tu@email.com",
    "location": "Tu Ciudad, País",
    "github": "tu-usuario",
    "linkedin": "tu-perfil",
    "scholar": "tu-id-scholar",
    "orcid": "0000-0000-0000-0000",
    "researchgate": "tu-perfil"
  }},
  "experience": [
    {{
      "title": "Cargo",
      "organization": "Empresa",
      "location": "Ciudad",
      "startDate": "2020",
      "endDate": "2024",
      "description": "Descripción del trabajo..."
    }}
  ],
  "publications": [
    {{
      "title": "Título del Paper",
      "authors": "Autor 1, Autor 2",
      "venue": "Conferencia o Journal",
      "year": "2024",
      "url": "https://link-al-paper.com",
      "image": "https://imagen-opcional.jpg"
    }}
  ],
  "projects": [
    {{
      "name": "Nombre del Proyecto",
      "description": "Descripción del proyecto...",
      "url": "https://link-al-proyecto.com",
      "image": "https://imagen-del-proyecto.jpg"
    }}
  ]
}}
```

### Agregar una nueva publicación

Abre `data.json` y agrega un nuevo objeto en el array `publications`:

```json
{{
  "title": "Mi Nuevo Paper",
  "authors": "Tu Nombre, Coautor",
  "venue": "Nombre de la Conferencia 2025",
  "year": "2025",
  "url": "https://link-al-paper.com"
}}
```

### Agregar un nuevo proyecto

Agrega un nuevo objeto en el array `projects`:

```json
{{
  "name": "Mi Nuevo Proyecto",
  "description": "Descripción del proyecto...",
  "url": "https://github.com/usuario/proyecto",
  "image": "https://imagen.jpg"
}}
```

### Controlar qué secciones mostrar

Modifica el array `sections` para mostrar/ocultar secciones:

```json
"sections": ["about", "experience", "publications", "projects"]
```

Opciones disponibles:
- `"about"` - Sección Sobre mí
- `"experience"` - Experiencia laboral
- `"publications"` - Publicaciones académicas  
- `"projects"` - Portfolio de proyectos

## 🔄 Flujo de actualización con Git

```bash
# 1. Edita data.json con tus cambios

# 2. Guarda y sube los cambios
git add data.json
git commit -m "Actualizar portfolio: agregar nueva publicación"
git push

# 3. ¡Listo! GitHub Pages se actualiza automáticamente
```

## 💡 Tips

- **Imágenes locales**: Guarda tus imágenes en la carpeta `assets/` y referéncialas como `"assets/mi-imagen.jpg"`
- **Imágenes online**: Usa URLs públicas (GitHub, Imgur, etc.)
- **Validar JSON**: Usa https://jsonlint.com/ para verificar que tu JSON es válido
- **Vista previa**: Siempre prueba localmente antes de subir cambios

## 🎨 Personalización avanzada

### Cambiar colores
Edita las variables CSS al inicio de `styles.css`:

```css
:root {{
  --text-primary: #1f2937;      /* Color del texto principal */
  --text-secondary: #6b7280;    /* Color del texto secundario */
  --link-color: #2563eb;        /* Color de los enlaces */
  --link-hover: #1d4ed8;        /* Color de enlaces al hover */
  --bg-primary: #ffffff;        /* Color de fondo */
  --border-color: #e5e7eb;      /* Color de los bordes */
}}
```

### Cambiar fuentes
Modifica la propiedad `font-family` en `body` dentro de `styles.css`.

---
Generado con ❤️ por Portfolio Generator
"""
        zip_file.writestr('README.md', readme.encode('utf-8'))
    
    zip_buffer.seek(0)
    
    response = make_response(zip_buffer.read())
    response.headers['Content-Type'] = 'application/zip'
    response.headers['Content-Disposition'] = f'attachment; filename=portfolio_static_{datetime.now().strftime("%Y%m%d_%H%M%S")}.zip'
    
    return response

if __name__ == '__main__':
    os.makedirs('static/uploads', exist_ok=True)
    app.run(host='0.0.0.0', debug=True)
