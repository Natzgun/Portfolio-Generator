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

@app.route('/download', methods=['POST'])
def download():
    data = request.json
    data = filter_sections(data)
    
    # Crear un buffer en memoria para el ZIP
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Agrupar publicaciones por año
        if 'publications' in data and data['publications']:
            data['publications_by_year'] = group_publications_by_year(data['publications'])
        # Crear el HTML principal
        html_content = render_template('portfolio_template.html', portfolio=data)
        zip_file.writestr('index.html', html_content.encode('utf-8'))
        
        # Crear un README básico
        readme = f"""# Portafolio Generado

Este portafolio fue generado el {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.

## Instrucciones

1. Extrae todos los archivos
2. Sube el contenido a un servicio de hosting como:
   - GitHub Pages
   - Netlify
   - Vercel
   - Tu propio servidor web

3. Abre index.html en tu navegador para ver el portafolio localmente

## Personalización

Puedes editar index.html directamente para personalizar tu portafolio.
"""
        zip_file.writestr('README.md', readme.encode('utf-8'))
    
    zip_buffer.seek(0)
    
    response = make_response(zip_buffer.read())
    response.headers['Content-Type'] = 'application/zip'
    response.headers['Content-Disposition'] = f'attachment; filename=portfolio_{datetime.now().strftime("%Y%m%d_%H%M%S")}.zip'
    
    return response

if __name__ == '__main__':
    os.makedirs('static/uploads', exist_ok=True)
    app.run(debug=True)
