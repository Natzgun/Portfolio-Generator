# Generador de Portafolio Académico

Aplicación web en Flask para generar portafolios académicos profesionales diseñados para estudiantes de Ciencias de la Computación, tanto para ingenieros de software como investigadores.

## Características

- 🎨 Interfaz minimalista y moderna
- 📱 Diseño completamente responsive
- 👨‍💼 Enfoque para ingenieros de software e investigadores
- 👁️ Vista previa en tiempo real
- 📥 Descarga de portafolio como archivo ZIP
- ✨ Principios de UX e Interacción Humano-Computador aplicados

## Requisitos

- Python 3.7 o superior
- pip

## Instalación

1. Clona o descarga este repositorio

2. Crea un entorno virtual (recomendado):
```bash
python -m venv venv
```

3. Activa el entorno virtual:

   **Para Fish shell:**
   ```fish
   source venv/bin/activate.fish
   ```

   **Para Bash/Zsh:**
   ```bash
   source venv/bin/activate
   ```

4. Instala las dependencias:
```bash
pip install -r requirements.txt
```

## Uso

1. Con el entorno virtual activado, ejecuta la aplicación:
```bash
python app.py
```

   **O usa directamente el Python del entorno virtual (sin activar):**
   ```bash
   ./venv/bin/python app.py
   ```

   **O usa el script incluido:**
   ```bash
   ./run.sh
   ```

2. Abre tu navegador en `http://localhost:5000`

3. En el landing page, haz clic en "Comenzar"

4. Completa el formulario con tu información:
   - Información básica (nombre, título, foto, sobre mí)
   - Información de contacto
   - Enfoque profesional (ingeniería de software y/o investigación)
   - Publicaciones (para investigadores)
   - Proyectos
   - Experiencia
   - Habilidades técnicas

5. Usa "Vista Previa" para ver cómo quedará tu portafolio

6. Haz clic en "Descargar" para obtener un archivo ZIP con tu portafolio

## Despliegue del Portafolio Generado

El archivo ZIP contiene:
- `index.html`: Tu portafolio completo (todo el CSS está incrustado)
- `README.md`: Instrucciones básicas

Puedes subir tu portafolio a:
- GitHub Pages
- Netlify
- Vercel
- Tu propio servidor web

O simplemente abrir `index.html` en tu navegador para verlo localmente.

## Estructura del Proyecto

```
porfolio-generator/
├── app.py                 # Aplicación Flask principal
├── requirements.txt       # Dependencias
├── templates/
│   ├── index.html        # Landing page
│   ├── generator.html    # Generador de portafolio
│   └── portfolio_template.html  # Template del portafolio generado
├── static/
│   ├── css/
│   │   ├── style.css     # Estilos del landing page
│   │   └── generator.css # Estilos del generador
│   └── js/
│       └── generator.js  # Lógica del generador
└── README.md
```

## Características Técnicas

- Diseño responsive con CSS Grid y Flexbox
- Sin dependencias externas de CSS/JS (excepto Flask)
- CSS incrustado en el HTML generado (portabilidad completa)
- Vista previa en tiempo real usando iframe
- Formularios dinámicos para publicaciones, proyectos y experiencia

## Licencia

Este proyecto es de código abierto y está disponible bajo los términos que desees.
