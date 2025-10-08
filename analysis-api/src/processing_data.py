import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

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
        df_edad_genero = df_edad_genero.dropna(subset=['Edad', 'Genero'])
        df_edad_genero['Edad'] = pd.to_numeric(df_edad_genero['Edad'], errors='coerce')
        df_edad_genero['Puntuacion'] = pd.to_numeric(df_edad_genero['Puntuacion'], errors='coerce')

        df_edad_genero['Puntuacion'] = df_edad_genero['Puntuacion'].fillna(0)

        df_edad_genero['RangoEdad'] = pd.cut(df_edad_genero['Edad'], bins=[0, 12, 18, 30, 60, 100], 
                                            labels=['0-12', '12-18', '18-30', '30-60', '+60'], right=False)
        
        df_genero_puntuacion = df_edad_genero.groupby(['Genero', 'RangoEdad'])['Puntuacion'].mean().reset_index()

        df_genero_puntuacion['Puntuacion'] = df_genero_puntuacion['Puntuacion'].fillna(0).round(2)
        print(df_genero_puntuacion)
        return df_genero_puntuacion

    def empresa_competencia(self):
        df_copia = self.df.copy()
        df_empresa_competencia = df_copia.rename(columns={
            'Registre su tipo de empresa organizacion ciudadano': 'Empresa',
            'Conoce su nivel de competencia digital e identifica claramente sus carencias con respecto a los requisitos de su entorno laboral': 'Entorno'
        })
        
        df_empresa_competencia['Si'] = df_empresa_competencia['Entorno'].apply(lambda x: 1 if x == 'Si' else 0)
        df_empresa_competencia['No'] = df_empresa_competencia['Entorno'].apply(lambda x: 1 if x == 'No' else 0)

        df_si = df_empresa_competencia.groupby('Empresa')['Si'].sum().reset_index()
        df_no = df_empresa_competencia.groupby('Empresa')['No'].sum().reset_index()

        df_resultado = pd.merge(df_si, df_no, on='Empresa')

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

    def participacion_innovacion_ciiu_genero(self):
        """
        Procesa datos de participación en experiencias innovadoras por CIIU y género
        """
        col = "Participa en experiencias innovadoras relacionadas con el uso de nuevas tecnologias"
        
        df_copy = self.df.copy()
        df_copy[col] = df_copy[col].map({'Si': 1, 'No': 0})
        
        ciiu_map = {
            'Actividades de los hogares como empleadores, actividades no diferenciadas de los hogares': 'Ac0',
            'Actividades de alojamiento y de servicio de comida.': 'Ac1',
            'Actividades de atencion de la salud humana y de asistencia social.': 'Ac2',
            'Como productores de bienes y servicios para uso propio.': 'Ac3',
            'Actividades de organizaciones y organos extraterritoriales.': 'Ac4',
            'Actividades de servicios administrativos y de apoyo.': 'Ac5',
            'Actividades financieras y de seguros.': 'Ac6',
            'Actividades inmobiliarias.': 'Ac7',
            'Actividades profesionales, cientificas y tecnicas.': 'Ac8',
            'Agricultura, ganadería y pesca.': 'Ac9',
            'Artes, entretenimiento y recreacion.': 'Ac10',
            'Comercio al por mayor y al por menor, reparacion de vehiculos automotores y motocicletas.': 'Ac11',
            'Construccion.': 'Ac12',
            'Ensenanza.': 'Ac13',
            'Industrias manufactureras.': 'Ac14',
            'Informacion y comunicacion.': 'Ac15',
            'Otras actividades de servicios.': 'Ac16',
            'Suministro de electricidad, gas, vapor y aire acondicionado.': 'Ac17',
            'Transporte y almacenamiento.': 'Ac18'
        }
        
        df_copy['CIIU'] = df_copy['CIIU'].map(ciiu_map)
        
        df_copy = df_copy[df_copy['Genero'].isin(['Femenino', 'Masculino'])]
        
        orden_ciiu = ['Ac1', 'Ac2', 'Ac3', 'Ac4', 'Ac5', 'Ac6', 'Ac7', 'Ac8', 'Ac9', 'Ac10',
                      'Ac11', 'Ac12', 'Ac13', 'Ac14', 'Ac15', 'Ac16', 'Ac17', 'Ac18']
        
        df_copy['CIIU'] = pd.Categorical(df_copy['CIIU'], categories=orden_ciiu, ordered=True)
        
        df_group = df_copy.groupby(['CIIU', 'Genero'], observed=True)[col].mean().unstack(fill_value=0) * 100
        
        print("Participación en experiencias innovadoras por CIIU y Género (%):")
        print(df_group)
        return df_group

    def dashboard_competencia_digital_ciiu(self):
        """
        Procesa datos para dashboard de competencia digital por CIIU
        """
        preguntas_originales = [
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
            "Conoce su nivel de competencia digital e identifica claramente sus carencias con respecto a los requisitos de su entorno laboral"
        ]
        
        preguntas_cortas = [f"Pregunta {i+1}" for i in range(len(preguntas_originales))]
        mapa_preguntas = dict(zip(preguntas_originales, preguntas_cortas))
        
        df_copy = self.df[self.df['Genero'].isin(['Femenino', 'Masculino'])].copy()
        
        ciiu_map = {
            'Actividades de alojamiento y de servicio de comida.': 'A1',
            'Actividades de atencion de la salud humana y de asistencia social.': 'A2',
            'Actividades profesionales, cientificas y tecnicas.': 'A3',
            'Agricultura, ganadería y pesca.': 'A4',
            'Artes, entretenimiento y recreacion.': 'A5',
            'Comercio al por mayor y al por menor, reparacion de vehiculos automotores y motocicletas.': 'A6',
            'Construccion.': 'A7',
            'Ensenanza.': 'A8',
            'Industrias manufactureras.': 'A9',
            'Informacion y comunicacion.': 'A10',
            'Otras actividades de servicios.': 'A11',
            'Transporte y almacenamiento.': 'A12'
        }
        
        df_copy['CIIU'] = df_copy['CIIU'].map(ciiu_map)
        df_copy = df_copy.dropna(subset=['CIIU'])
        
        orden_ciiu = [f"A{i}" for i in range(1, 13)]
        df_copy['CIIU'] = pd.Categorical(df_copy['CIIU'], categories=orden_ciiu, ordered=True)
        
        print("Dashboard de competencia digital por CIIU preparado")
        print(f"Total de preguntas: {len(preguntas_originales)}")
        print(f"Total de registros: {len(df_copy)}")
        
        return df_copy, preguntas_originales, mapa_preguntas

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
        
    def edad_fundamentos_digitales(self):
        """
        Procesa datos para el boxplot de edad por respuesta sobre fundamentos digitales
        """
        import numpy as np
        
        q_col = "Conoce los fundamentos de los procesos digitales y de la creacion de software. Entiendo los principios de la programacion"
        
        def norm_resp_bin(x):
            """Normaliza las respuestas a formato binario"""
            s = str(x).strip().lower()
            if s in ["si", "sí", "true", "1", "de acuerdo", "totalmente de acuerdo"]:
                return "Sí"
            if s in ["no", "false", "0", "en desacuerdo", "totalmente en desacuerdo"]:
                return "No"
            return np.nan
        
        data = self.df[[q_col, "Edad"]].copy()
        data["Respuesta"] = data[q_col].apply(norm_resp_bin)
        data["Edad"] = pd.to_numeric(data["Edad"], errors="coerce")
        data = data.dropna(subset=["Respuesta", "Edad"])
        
        stats = data.groupby("Respuesta")["Edad"].agg(['count', 'mean', 'std', 'min', 'max']).round(2)
        
        print("Estadísticas de edad por respuesta sobre fundamentos digitales:")
        print(stats)
        print(f"\nTotal de registros procesados: {len(data)}")
        
        return data

    def radar_deficiencias_edad(self):
        """
        Procesa datos para el gráfico de radar de deficiencias en habilidades digitales por edad
        """
        import numpy as np
        
        def find_col_contains(fragment):
            """Encuentra columna que contenga el fragmento especificado"""
            frag = fragment.lower()
            for c in self.df.columns:
                if frag in str(c).lower():
                    return c
            return None

        def norm_yesno(x):
            """Normaliza respuestas a valores numéricos"""
            s = str(x).strip().lower()
            if s in ["si", "sí", "true", "1", "de acuerdo", "totalmente de acuerdo"]:
                return 1.0
            if s in ["no", "false", "0", "en desacuerdo", "totalmente en desacuerdo"]:
                return 0.0
            return 0.0  # Cambiado de np.nan a 0 para evitar NaN

        items_text = [
            "Conoce como utilizar herramientas de busqueda avanzada en Internet",
            "Clasifica la informacion mediante archivos y carpetas",
            "Usted sabe como generar un perfil publico, personal o profesional en las Redes Sociales",
            "Es capaz de utilizar los diferentes medios digitales para exponer de manera creativa esquemas graficos",
            "Conoce los fundamentos de los procesos digitales y de la creacion de software. Entiendo los principios de la programacion",
            "Se mantiene informado y actualizado sobre habitos saludables y seguros en el uso de la tecnologia"
        ]
        item_cols = [find_col_contains(t) for t in items_text]

        age_col = "Edad" if "Edad" in self.df.columns else find_col_contains("edad")
        work = pd.DataFrame({"Edad": pd.to_numeric(self.df[age_col], errors="coerce")})
        
        for label, col in zip(items_text, item_cols):
            if col and col in self.df.columns:
                work[label] = self.df[col].apply(norm_yesno).fillna(0)  # Limpieza adicional

        bins = [15, 25, 35, 45, 55, 65, 120]
        labels = ["15–24", "25–34", "35–44", "45–54", "55–64", "65+"]
        work["grupo_edad"] = pd.cut(work["Edad"], bins=bins, labels=labels, right=False, include_lowest=True)

        # Calcular % de deficiencias (No) por grupo e ítem
        group_stats_no = (
            work.dropna(subset=["grupo_edad"])
                .groupby("grupo_edad", observed=True)[items_text]
                .apply(lambda d: (1.0 - d.mean()) * 100)
                .reindex(labels)
                .fillna(0)  # Asegurar que no haya NaN
        )

        # Contar n por grupo
        n_by_group = (
            work.dropna(subset=["grupo_edad"])
                .groupby("grupo_edad", observed=True)["Edad"]
                .count()
                .reindex(labels)
                .fillna(0)
                .astype(int)
        )

        print("Datos procesados para gráfico de radar:")
        print(f"Grupos de edad: {labels}")
        print(f"Total de registros: {len(work.dropna(subset=['grupo_edad']))}")
        print(f"Habilidades analizadas: {len(items_text)}")
        print(f"Group_stats_no sample: {group_stats_no.head().to_dict()}")  # Depuración
        
        return work, group_stats_no, n_by_group, items_text, labels