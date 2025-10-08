# 📌 Análisis del analfabetismo digital en Ecuador y sus principales brechas👥🖥️

**Curso:** Samsung Innovation Campus – Módulo de Python (Ecuador 2025)  
**Seccion:** <ecuador03 | ecuador04>  
**Carpeta:** ecuador03/Análisis del analfabetismo digital en Ecuador y sus principales brechas

---

## 👥 Integrantes del Grupo
- Andrés Rodríguez 
- Camila Hernández 
- ⁠Luis Pezo
- ⁠Kevin Gómez
- ⁠Fernando Quezada 

---

## 📝 Descripción del Proyecto  
El proyecto analiza el analfabetismo digital en Ecuador para identificar las principales brechas en el uso de la tecnología entre distintos grupos y regiones del país.
Busca proporcionar información estratégica que permita diseñar programas de capacitación digital y políticas públicas inclusivas.
Los beneficiarios son empresas, instituciones públicas y comunidades que podrán usar estos datos para reducir la brecha digital y fomentar la inclusión tecnológica.

### 🎯 Funcionalidades Principales
- **Dashboard Interactivo**: Visualización dinámica de datos con múltiples vistas
- **API REST**: Endpoints para análisis de datos en tiempo real
- **Análisis por Demografía**: Segmentación por edad, género, ubicación geográfica
- **Visualizaciones Avanzadas**: 8 tipos de gráficos diferentes (radar, boxplot, correlación, etc.)
- **Filtros Dinámicos**: Exploración interactiva de los datos
- **Generación Automática**: Gráficos generados dinámicamente desde los datos
- **Responsive Design**: Interfaz adaptable a diferentes dispositivos

---

## ⚙️ Instrucciones de Instalación y Ejecución

### Requisitos
- Python 3.9+ (recomendado)
- Git

### Pasos

#### 🔧 Backend (API FastAPI)
1. Navegar al directorio de la API:
   ```bash
   cd analysis-api
   ```

2. Crear y activar entorno virtual:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```


3. Instalar dependencias:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Ejecutar la API:
   ```bash
   uvicorn api:app --reload --host 0.0.0.0 --port 8000
   ```
   O usar el script de inicio:
   ```bash
   .\start_api.bat  # Windows
   ```

#### 🖥️ Frontend (React Dashboard)
1. Navegar al directorio del frontend:
   ```bash
   cd front_end_analysis/project
   ```

2. Instalar dependencias de Node.js:
   ```bash
   npm install
   ```

3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

#### 🌐 URLs de acceso
- **API Backend**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Frontend Dashboard**: http://localhost:5173

---

## 📂 Estructura del Código
```
sic-nuevo-repo/
│
├── README.md                           # Documentación principal
├── analysis-api/                       # 🔧 Backend FastAPI
│   ├── api.py                         # API principal con endpoints
│   ├── requirements.txt               # Dependencias Python
│   ├── start_api.bat                  # Script de inicio Windows
│   ├── INICIO_API.md                  # Guía de inicio de la API
│   ├── data/                          # Datos del proyecto
│   │   ├── raw/2023.csv              # Datos originales
│   │   └── processed/                # Datos procesados
│   ├── graphics/                      # Gráficos generados por la API
│   └── src/                          # Módulos de análisis
│       ├── cleaning.py               # Limpieza de datos
│       ├── processing_data.py        # Procesamiento de datos
│       └── graphics.py               # Generación de gráficos
│
├── front_end_analysis/project/         # 🖥️ Frontend React
│   ├── package.json                   # Dependencias Node.js
│   ├── vite.config.ts                # Configuración Vite
│   ├── tailwind.config.js            # Configuración Tailwind
│   ├── public/graphics/               # Gráficos para el frontend
│   └── src/                          # Código fuente React
│       ├── App.tsx                   # Componente principal
│       ├── components/               # Componentes React
│       │   ├── DynamicDashboardClean.tsx  # Dashboard principal
│       │   ├── GraphicsViewer.tsx    # Visor de gráficos
│       │   ├── ApiStatusChecker.tsx  # Monitor de API
│       │   └── charts/               # Componentes de gráficos
│       └── utils/                    # Utilidades
│           └── api.ts                # Cliente API
│
└── project-bolt-sb1-pw6nfn54/          # 📊 Proyecto adicional
```

---

## ✅ Herramientas Implementadas
- **Backend:** Python 3.13 con FastAPI
- **Frontend:** React 18 + TypeScript + Vite
- **Análisis de datos:** `pandas`, `numpy`, `matplotlib`, `seaborn`
- **API y servidor:** `FastAPI`, `uvicorn`, `CORS middleware`
- **Visualización:** `matplotlib`, `seaborn` para gráficos, React componentes para dashboard
- **Estilos:** `Tailwind CSS`, `Lucide React Icons`
- **Manejo de datos:** CSV processing, JSON serialization
- **Control de versiones:** Git + GitHub
- **Estructura del proyecto:** Modular (Backend separado del Frontend)

---

## 💡 Buenas prácticas y reglas internas
- Trabajar únicamente dentro de la carpeta asignada al grupo.
- Commits claros: `feat: agrega función X`, `fix: corrige bug en Y`, `docs: actualiza README`.
- Mantener el README del proyecto actualizado con cambios importantes.


> **IMPORTANTE:** Este README es una plantilla base. Cada grupo debe editarlo y completarlo con la información real de su proyecto antes de la entrega.

¡Éxitos con tu proyecto! 🚀