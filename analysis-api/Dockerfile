FROM python:3.11-slim

WORKDIR /app

# Copia los archivos de dependencias y el código
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Exponer el puerto (ajústalo según tu configuración, por defecto 8000 para FastAPI)
EXPOSE 8000

# Comando para ejecutar la app
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]