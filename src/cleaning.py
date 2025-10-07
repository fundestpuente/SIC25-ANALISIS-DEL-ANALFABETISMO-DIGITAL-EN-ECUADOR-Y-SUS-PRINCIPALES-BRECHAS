import pandas as pd
import re
import unicodedata
import os

df = None
# Funciones
def limpiar_texto(s):
    if s is None or (isinstance(s, float) and pd.isna(s)):
        return ""
    s = str(s)
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('utf-8')
    s = s.replace("ñ", "ni").replace("Ñ", "Ni")
    s = re.sub(r'[¿?*":/]', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def limpiar_df_texto(df):
    for c in df.select_dtypes(include='object'):
        df[c] = df[c].map(limpiar_texto)
    return df

def realizar_limpieza():
    script_dir = os.path.dirname(__file__)

    # Crear directorios si no existen
    new_path = os.path.join(script_dir, '..', 'data','processed')
    new_path = os.path.abspath(new_path)

    if not os.path.exists(new_path):
        os.makedirs(new_path, exist_ok=True)

    # Cargar el archivo CSV original
    csv_path = os.path.join(script_dir, '..', 'data', 'raw', '2023.csv')
    csv_path = os.path.abspath(csv_path)
    df = pd.read_csv(csv_path)

    # Convertir todas las columnas a tipo string para un manejo uniforme
    for column in df.columns:
        df[column] = df[column].astype(str)

    # Limpiar las cabeceras
    df.columns = [limpiar_texto(c) for c in df.columns]

    # Limpiar el contenido textual
    df = limpiar_df_texto(df)

    # Estandarizar cabeceras
    for c in df.columns:
        if "actividad economica" in c and "CIIU" in c:
            df = df.rename(columns={c: "CIIU"})
            break
    for col in ["Provincia", "Genero", "Edad", "Puntuacion", "ID del envio"]:
        if col in df.columns:
            df = df.rename(columns={col: col})

    # # Selección de columnas deseadas
    columnas_deseadas = [
        "ID del envio",
        "Registre su tipo de empresa organizacion ciudadano",
        "Provincia",
        "Genero",
        "CIIU",
        "Tiene conocimientos de computacion y navegacion en internet",
        "Conoce las oportunidades que el IOT (Internet de las cosas) puede aportar en su trabajo y empresa",
        "Conoce las oportunidades que el IA (Inteligencia artificial) puede aportar en su trabajo y empresa",
        "Conoce como utilizar herramientas de busqueda avanzada en Internet para mejorar los resultados en funcion de sus necesidades",
        "Identifica parametros que deben cumplir las paginas web y la informacion online para considerar su confiabilidad y calidad",
        "Clasifica la informacion mediante archivos y carpetas para facilitar su localizacion posterior",
        "Conoce o ha utilizado servicios de alojamiento de archivos en la nube",
        "Ha participado en consultas ciudadanas o encuestas a traves de internet (online) a propuestas de organizaciones publicas o sociales",
        "Usted sabe como generar un perfil publico, personal o profesional en las Redes Sociales, controlando los detalles de la imagen que quiere transmitir",
        "Es capaz de utilizar los diferentes medios digitales para exponer de manera creativa esquemas graficos, mapas conceptuales, infografias",
        "Sabe editar y modificar con herramientas digitales, el formato de diferentes tipos de archivo textos, fotografias, videos",
        "Conoce los fundamentos de los procesos digitales y de la creacion de software. Entiendo los principios de la programacion",
        "Conoce y actua con prudencia cuando recibe mensajes cuyo remitente, contenido o archivo adjunto sea desconocido (SPAM)",
        "Se interesa en conocer las politicas de privacidad de las plataformas que utiliza en Internet, asi como el tratamiento que hacen de sus datos personales",
        "Se mantiene informado y actualizado sobre habitos saludables y seguros en el uso de la tecnologia, y los fomenta y los difunde",
        "Es capaz de evaluar y elegir de manera adecuada un dispositivo, software, aplicacion o servicio para realizar sus tareas",
        "Participa en experiencias innovadoras relacionadas con el uso de nuevas tecnologias",
        "Conoce su nivel de competencia digital e identifica claramente sus carencias con respecto a los requisitos de su entorno laboral",
        "Edad",
        "Puntuacion"
    ]

    df = df[[c for c in columnas_deseadas if c in df.columns]]

    # Establecer índice
    if "ID del envio" in df.columns:
        df = df.set_index("ID del envio")

    # Reemplazar todos los NaN con cadena vacía y asegurar tipos consistentes
    df = df.astype(str).fillna("")

    # Guardar el archivo procesado
    df.to_csv(f'{new_path}/2023_filtrado_limpio.csv', index=True)
    return df

def retornar_dataframe():
    df = realizar_limpieza()
    return df