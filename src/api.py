from fastapi import FastAPI
import pandas as pd
import os
import json

app = FastAPI(title="Analisis Analfabetismo Digital Ecuador")

# Ruta al archivo procesado
file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', '2023_filtrado_limpio1.csv')
df = pd.read_csv(file_path).fillna("")  # Reemplaza NaN con cadena vacía al cargar

@app.get("/data")
def get_data():
    """Retorna todos los datos en JSON"""
    return df.to_dict(orient='records')

@app.get("/summary")
def get_summary():
    """Retorna un resumen básico"""
    with open(os.path.join(os.path.dirname(__file__), '..', 'cleaned_data', 'summary.json'), 'r') as f:
        summary = json.load(f)
    return summary

@app.get("/filter/{column}/{value}")
def filter_data(column: str, value: str):
    """Filtra datos por columna y valor"""
    filtered = df[df[column] == value].fillna("")
    return filtered.to_dict(orient='records')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)