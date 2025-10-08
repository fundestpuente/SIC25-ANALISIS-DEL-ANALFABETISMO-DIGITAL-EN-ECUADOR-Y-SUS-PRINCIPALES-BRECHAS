from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
import pandas as pd
import os
import json
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

# Importa tus módulos (ajusta según tu estructura)
from src.graphics import Graphics
from src.processing_data import Data
from src.cleaning import retornar_dataframe

# Rutas de archivos
base_dir = os.path.dirname(__file__)
processed_path = os.path.join(base_dir, 'data', 'processed', '2023_filtrado_limpio.csv')
graphics_path = os.path.join(base_dir, 'graphics')

# Cargar datos inicialmente
df = pd.read_csv(processed_path, index_col='ID del envio').fillna("") if os.path.exists(processed_path) else None

# Instancias de clases
data_instance = Data()
graphics_instance = Graphics()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global df
    print("🚀 Iniciando API de Análisis de Analfabetismo Digital...")
    
    try:
        # Crear directorio de gráficos si no existe
        if not os.path.exists(graphics_path):
            os.makedirs(graphics_path)
            print(f"📁 Directorio de gráficos creado: {graphics_path}")
        
        if not os.path.exists(processed_path):
            print("📊 Procesando datos desde archivo raw...")
            df = retornar_dataframe()
        else:
            print("📊 Cargando datos procesados...")
            df = pd.read_csv(processed_path, index_col='ID del envio').fillna("")
        
        print(f"✅ Datos cargados correctamente: {len(df)} registros")
        
        # Generar todas las imágenes al iniciar
        print("🖼️ Generando gráficos...")
        try:
            graphics_instance.grafico_prov_pun()
            print("✅ Gráfico de provincias generado")
        except Exception as e:
            print(f"⚠️ Error generando gráfico de provincias: {str(e)}")
            
        try:
            graphics_instance.grafico_gen_pun()
            print("✅ Gráfico de género/edad generado")
        except Exception as e:
            print(f"⚠️ Error generando gráfico de género/edad: {str(e)}")
            
        try:
            graphics_instance.grafico_empresa_ent()
            print("✅ Gráfico empresarial generado")
        except Exception as e:
            print(f"⚠️ Error generando gráfico empresarial: {str(e)}")
            
        try:
            graphics_instance.graphic_si_no()
            print("✅ Gráfico de tecnologías generado")
        except Exception as e:
            print(f"⚠️ Error generando gráfico de tecnologías: {str(e)}")
            
        try:
            graphics_instance.grafico_participacion_innovacion_ciiu_genero()
            print("✅ Gráfico de participación generado")
        except Exception as e:
            print(f"⚠️ Error generando gráfico de participación: {str(e)}")
            
        try:
            graphics_instance.dashboard_competencia_digital_ciiu()
            print("✅ Dashboard CIIU generado")
        except Exception as e:
            print(f"⚠️ Error generando dashboard CIIU: {str(e)}")
            
        try:
            graphics_instance.correlacion_graphic()
            print("✅ Gráfico de correlación generado")
        except Exception as e:
            print(f"⚠️ Error generando gráfico de correlación: {str(e)}")
            
        try:
            graphics_instance.boxplot_edad_fundamentos()
            print("✅ BoxPlot de edad generado")
        except Exception as e:
            print(f"⚠️ Error generando BoxPlot de edad: {str(e)}")
            
        try:
            graphics_instance.radar_deficiencias_edad()
            print("✅ Gráfico radar generado")
        except Exception as e:
            print(f"⚠️ Error generando gráfico radar: {str(e)}")
        
        print("🌐 API lista en http://localhost:8000")
        print("📚 Documentación disponible en http://localhost:8000/docs")
        
    except Exception as e:
        print(f"❌ Error durante el inicio: {str(e)}")
        raise e
    
    # Yield para indicar que el startup ha terminado
    yield
    
    # Cleanup (se ejecuta al cerrar la aplicación)
    print("🔄 Cerrando API...")

# Crear la aplicación FastAPI
app = FastAPI(
    title="Analisis Analfabetismo Digital Ecuador",
    description="API para análisis de datos de analfabetismo digital en Ecuador",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "*"  
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Access-Control-Allow-Headers",
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials"
    ],
    expose_headers=[
        "Access-Control-Allow-Headers",
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials"
    ]
)

# Endpoint de salud y verificación de CORS
@app.get("/health")
def health_check():
    """Endpoint de verificación de salud de la API"""
    return {
        "status": "healthy",
        "message": "API funcionando correctamente",
        "cors": "enabled",
        "data_count": len(df) if df is not None else 0,
        "timestamp": pd.Timestamp.now().isoformat()
    }

# Endpoint para verificar CORS específicamente
@app.options("/{path:path}")
def options_handler(path: str):
    """Maneja las peticiones OPTIONS para CORS"""
    return {"message": "CORS preflight handled"}

@app.get("/data")
def get_data():
    """Retorna todos los datos en JSON"""
    return df.to_dict(orient='records')

@app.get("/summary")
def get_summary():
    """Retorna un resumen básico"""
    summary = df.describe().to_dict()
    return summary

@app.get("/filter/{column}/{value}")
def filter_data(column: str, value: str):
    """Filtra datos por columna y valor"""
    filtered = df[df[column] == value].fillna("")
    return filtered.to_dict(orient='records')

# Endpoints para análisis (mantener estos)
@app.get("/analysis/provincia_puntuacion")
def analysis_provincia_puntuacion():
    result = data_instance.provincia_puntuacion()
    return result.to_dict(orient='records')

@app.get("/analysis/genero_puntuacion_edad")
def analysis_genero_puntuacion_edad():
    try:
        result = data_instance.genero_puntuacion_edad()
        # Limpiar valores NaN antes de convertir a JSON
        result_clean = result.fillna(0).replace([float('inf'), -float('inf')], 0)
        return result_clean.to_dict(orient='records')
    except Exception as e:
        print(f"Error en genero_puntuacion_edad: {str(e)}")
        return {"error": f"Error procesando datos: {str(e)}", "data": []}

@app.get("/analysis/empresa_competencia")
def analysis_empresa_competencia():
    result = data_instance.empresa_competencia()
    return result.to_dict(orient='records')

@app.get("/analysis/tecnologias_si_no")
def analysis_tecnologias_si_no():
    result = data_instance.tecnologias_si_no()
    return result.to_dict(orient='records')

@app.get("/analysis/participacion_innovacion_ciiu_genero")
def analysis_participacion_innovacion_ciiu_genero():
    result = data_instance.participacion_innovacion_ciiu_genero()
    return result.to_dict(orient='index')

@app.get("/analysis/dashboard_competencia_digital_ciiu")
def analysis_dashboard_competencia_digital_ciiu():
    df_copy, preguntas_originales, mapa_preguntas = data_instance.dashboard_competencia_digital_ciiu()
    return {
        "df": df_copy.to_dict(orient='records'),
        "preguntas_originales": preguntas_originales,
        "mapa_preguntas": mapa_preguntas
    }

@app.get("/analysis/correlacion_data")
def analysis_correlacion_data():
    result = data_instance.correlacion_data()
    return result.to_dict()

@app.get("/analysis/edad_fundamentos_digitales")
def analysis_edad_fundamentos_digitales():
    result = data_instance.edad_fundamentos_digitales()
    return result.to_dict(orient='records')

@app.get("/analysis/radar_deficiencias_edad")
def analysis_radar_deficiencias_edad():
    try:
        work, group_stats_no, n_by_group, items_text, labels = data_instance.radar_deficiencias_edad()
        
        # Limpiar valores NaN antes de convertir a JSON
        work_clean = work.fillna(0).replace([float('inf'), -float('inf')], 0)
        
        # Limpiar group_stats_no de valores NaN
        group_stats_clean = {}
        for key, value in group_stats_no.items():
            if isinstance(value, dict):
                group_stats_clean[key] = {k: (0 if pd.isna(v) or v in [float('inf'), -float('inf')] else v) 
                                        for k, v in value.items()}
            else:
                group_stats_clean[key] = 0 if pd.isna(value) or value in [float('inf'), -float('inf')] else value
        
        # Limpiar n_by_group de valores NaN
        n_by_group_clean = {k: (0 if pd.isna(v) or v in [float('inf'), -float('inf')] else v) 
                           for k, v in n_by_group.items()}
        
        return {
            "work": work_clean.to_dict(orient='records'),
            "group_stats_no": group_stats_clean,
            "n_by_group": n_by_group_clean,
            "items_text": items_text if items_text else [],
            "labels": labels if labels else []
        }
    except Exception as e:
        print(f"Error en radar_deficiencias_edad: {str(e)}")
        return {
            "error": f"Error procesando datos: {str(e)}",
            "work": [],
            "group_stats_no": {},
            "n_by_group": {},
            "items_text": [],
            "labels": []
        }

# Helper function para servir imágenes con manejo de errores
def serve_image(filename: str):
    """Función helper para servir imágenes con manejo de errores"""
    image_path = os.path.join(graphics_path, filename)
    
    if not os.path.exists(image_path):
        # Si no existe la imagen, intentar generarla
        try:
            if filename == 'grafico_provincia.png':
                graphics_instance.grafico_prov_pun()
            elif filename == 'grafico_edad.png':
                graphics_instance.grafico_gen_pun()
            elif filename == 'grafico_empresa.png':
                graphics_instance.grafico_empresa_ent()
            elif filename == 'grafico_tecnologias_si_no.png':
                graphics_instance.graphic_si_no()
            elif filename == 'grafico_participacion_innovacion_ciiu_genero.png':
                graphics_instance.grafico_participacion_innovacion_ciiu_genero()
            elif filename == 'correlacion_competencias.png':
                graphics_instance.correlacion_graphic()
            elif filename == 'boxplot_edad_por_respuesta.png':
                graphics_instance.boxplot_edad_fundamentos()
            elif filename == 'radar_deficiencias_edad.png':
                graphics_instance.radar_deficiencias_edad()
        except Exception as e:
            print(f"Error generando gráfico {filename}: {str(e)}")
    
    if os.path.exists(image_path):
        return FileResponse(image_path, media_type="image/png")
    else:
        # Retornar una imagen de error o placeholder
        return JSONResponse(
            status_code=404,
            content={"error": f"Gráfico no disponible: {filename}"}
        )

# Endpoints para servir imágenes con manejo de errores mejorado
@app.get("/graphics/provincia_puntuacion")
def get_provincia_puntuacion_image():
    return serve_image('grafico_provincia.png')

@app.get("/graphics/genero_puntuacion_edad")
def get_genero_puntuacion_edad_image():
    return serve_image('grafico_edad.png')

@app.get("/graphics/empresa_competencia")
def get_empresa_competencia_image():
    return serve_image('grafico_empresa.png')

@app.get("/graphics/tecnologias_si_no")
def get_tecnologias_si_no_image():
    return serve_image('grafico_tecnologias_si_no.png')

@app.get("/graphics/participacion_innovacion_ciiu_genero")
def get_participacion_innovacion_ciiu_genero_image():
    return serve_image('grafico_participacion_innovacion_ciiu_genero.png')

@app.get("/graphics/dashboard_competencia_digital_ciiu")
def get_dashboard_competencia_digital_ciiu_image():
    return serve_image('dashboard_competencia_digital_ciiu.png')

@app.get("/graphics/correlacion_data")
def get_correlacion_data_image():
    return serve_image('correlacion_competencias.png')

@app.get("/graphics/edad_fundamentos_digitales")
def get_edad_fundamentos_digitales_image():
    return serve_image('boxplot_edad_por_respuesta.png')

@app.get("/graphics/radar_deficiencias_edad")
def get_radar_deficiencias_edad_image():
    return serve_image('radar_deficiencias_edad.png')

# La aplicación está lista para ser ejecutada con uvicorn
# Usar: uvicorn api:app --reload --host 0.0.0.0 --port 8000