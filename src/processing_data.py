
import pandas as pd
import matplotlib.pyplot as plt
import numpy

from src.cleaning import retornar_dataframe


class Data:
    def __init__(self):
        self.df = retornar_dataframe()

    def show_dataframe(self):
        print(self.df)

    def provincia_puntuacion(self):
        self.df['Puntuacion'] = pd.to_numeric(self.df['Puntuacion'], errors='coerce')
        self.df['Puntuacion'] = self.df['Puntuacion'].fillna(0)

        df_promedio_provincia = self.df.groupby('Provincia')['Puntuacion'].mean().reset_index()
        print(df_promedio_provincia)
        return df_promedio_provincia

    def genero_puntuacion_edad(self):
        df_edad_genero = self.df.copy()
        df_edad_genero = df_edad_genero.dropna(subset=['Edad','Genero'])
        df_edad_genero['Edad'] = pd.to_numeric(df_edad_genero['Edad'],errors='coerce')
        df_edad_genero['Puntuacion'] = pd.to_numeric(df_edad_genero['Puntuacion'], errors='coerce')

        df_edad_genero['Puntuacion'] = df_edad_genero['Puntuacion'].fillna(0)

        df_edad_genero['RangoEdad'] = pd.cut(df_edad_genero['Edad'], bins=[0,12,18,30,60,100],labels=['0-12','12-18','18-30','30-60','+60'],right=False)
        
        df_genero_puntuacion = (df_edad_genero.groupby(['Genero','RangoEdad'])['Puntuacion'].mean().reset_index())

        df_genero_puntuacion['Puntuacion'] = df_genero_puntuacion['Puntuacion'].fillna(0).round(2)
        print(df_genero_puntuacion)
        return df_genero_puntuacion

    def empresa_competencia(self):
        df_copia = self.df.copy()
        df_empresa_competencia = df_copia.rename(columns={'Registre su tipo de empresa organizacion ciudadano':'Empresa',
                                                          'Conoce su nivel de competencia digital e identifica claramente sus carencias con respecto a los requisitos de su entorno laboral': 'Entorno'})
        
        df_empresa_competencia['Si'] = df_empresa_competencia['Entorno'].apply(lambda x:1 if x =='Si' else 0)
        df_empresa_competencia['No'] = df_empresa_competencia['Entorno'].apply(lambda x:1 if x == 'No' else 0)

        df_si = df_empresa_competencia.groupby('Empresa')['Si'].sum().reset_index()
        df_no = df_empresa_competencia.groupby('Empresa')['No'].sum().reset_index()

        df_resultado = pd.merge(df_si,df_no,on='Empresa')

        print(df_resultado)
        return df_resultado

    def tecnologias_si_no(self):
        columnas_tecnologicas = [
            'Conoce las oportunidades que el IOT (Internet de las cosas) puede aportar en su trabajo y empresa',
            'Conoce las oportunidades que el IA (Inteligencia artificial) puede aportar en su trabajo y empresa',
            'Conoce o ha utilizado servicios de alojamiento de archivos en la nube',
            'Ha participado en consultas ciudadanas o encuestas a traves de internet (online) a propuestas de organizaciones publicas o sociales',
            'Participa en experiencias innovadoras relacionadas con el uso de nuevas tecnologias'
        ]
        
        resultados = []
        
        for columna in columnas_tecnologicas:
            if columna in self.df.columns:
                conteo = self.df[columna].value_counts()
                si_count = conteo.get('Si', 0)
                no_count = conteo.get('No', 0)
                
                resultados.append({
                    'Pregunta': columna,
                    'Si': si_count,
                    'No': no_count
                })
        
        df_resultado = pd.DataFrame(resultados)
        print(df_resultado)
        return df_resultado
    
    def correlacion_data(self):
        df = self.df.copy()
        columnas = [
            'Tiene conocimientos de computacion y navegacion en internet',
            'Identifica parametros que deben cumplir las paginas web y la informacion online para considerar su confiabilidad y calidad',
            'Sabe editar y modificar con herramientas digitales, el formato de diferentes tipos de archivo textos, fotografias, videos',
            'Conoce y actua con prudencia cuando recibe mensajes cuyo remitente, contenido o archivo adjunto sea desconocido (SPAM)',
            'Se interesa en conocer las politicas de privacidad de las plataformas que utiliza en Internet, asi como el tratamiento que hacen de sus datos personales',
            'Es capaz de evaluar y elegir de manera adecuada un dispositivo, software, aplicacion o servicio para realizar sus tareas'
        ]

        for col in columnas:
            df[col] = df[col].str.strip().str.lower().replace({'sí': 1, 'si': 1, 'no': 0})
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)

        corr = df[columnas].corr()
        return corr
