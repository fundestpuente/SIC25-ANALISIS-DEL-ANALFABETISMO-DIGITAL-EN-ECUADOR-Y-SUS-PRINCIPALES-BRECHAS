#!/usr/bin/env python3
"""
Script para iniciar el servidor FastAPI correctamente
"""
import uvicorn
import os
import sys

def main():
    """Inicia el servidor FastAPI usando uvicorn"""
    print("=" * 50)
    print("🚀 INICIANDO SERVIDOR API")
    print("=" * 50)
    print("📊 Análisis de Analfabetismo Digital - Ecuador")
    print("🌐 URL: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs") 
    print("🔄 Health: http://localhost:8000/health")
    print("=" * 50)
    print("💡 Para detener el servidor presiona Ctrl+C")
    print("=" * 50)
    
    try:
        # Ejecutar uvicorn con la configuración adecuada
        uvicorn.run(
            "api:app",  # Módulo:aplicación
            host="0.0.0.0",
            port=8000,
            reload=True,  # Recarga automática en desarrollo
            access_log=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n" + "=" * 50)
        print("🛑 Servidor detenido por el usuario")
        print("=" * 50)
    except Exception as e:
        print(f"\n❌ Error al iniciar servidor: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()