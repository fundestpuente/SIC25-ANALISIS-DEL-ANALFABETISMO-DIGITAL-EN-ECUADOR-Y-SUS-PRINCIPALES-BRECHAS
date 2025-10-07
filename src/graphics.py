import matplotlib.pyplot as plt
import os
import seaborn as sns
import pandas as pd

from src.processing_data import Data
from matplotlib.colors import LinearSegmentedColormap


class Graphics:
    def __init__(self):
        self.data = Data()
    
    def generar_direccion(self):
        script_dir = os.path.dirname(__file__)
        new_path = os.path.join(script_dir,'..','graphics')
        new_path = os.path.abspath(new_path)

        if not os.path.exists(new_path):
            os.makedirs(new_path, exist_ok=True)
        
        return new_path
    
    def grafico_prov_pun(self):
        provincia_puntuacion = self.data.provincia_puntuacion().sort_values('Puntuacion',ascending=True)

        colores = sns.color_palette("Blues",len(provincia_puntuacion))
        plt.figure(figsize=(12,8))

        bars = plt.barh(provincia_puntuacion['Provincia'],provincia_puntuacion['Puntuacion'],color=colores,edgecolor='black',height=0.6)

        for bar in bars:
            width = bar.get_width()
            plt.text(width + 0.5, bar.get_y() + bar.get_height()/2,
                    f'{width:.2f}', va='center', fontsize=10, fontweight='bold', color='black')
        
        plt.xlabel=('Puntuacion Promedio')
        plt.ylabel=('Provincia')
        plt.grid(axis='x',linestyle='--',alpha=0.7)
        sns.despine(left=True, bottom=True)
        plt.title('Promedio de Puntuación por Provincia')
        plt.xticks(rotation=45)

        plt.tight_layout()

        ruta_guardado  = os.path.join(self.generar_direccion(),'grafico_provincia.png')
        plt.savefig(ruta_guardado, format='png', dpi=300, bbox_inches='tight')

        plt.show()
        plt.close()


    def grafico_gen_pun(self):
        df = self.data.genero_puntuacion_edad()

        rango_edad = ['0-12','12-18','18-30','30-60','+60']
        df['RangoEdad'] = pd.Categorical(df['RangoEdad'],categories=rango_edad,ordered=True)

        plt.figure(figsize=(12,8))

        norm = plt.Normalize(df['Puntuacion'].min(), df['Puntuacion'].max()) #type:ignore
        cmap = plt.cm.get_cmap('RdYlBu_r')

        df['Color'] = df['Puntuacion'].apply(lambda x: cmap(norm(x)))

        bars = sns.barplot(
            data=df,
            x='RangoEdad',
            y='Puntuacion',
            hue='Genero',
            dodge=True,
            palette=df['Color'].values #type: ignore
        )

        plt.title('Promedio de Puntuación por Género y Rango de Edad', fontsize=16, fontweight='bold')
        plt.xlabel('Rango de Edad', fontsize=12, fontweight='bold')
        plt.ylabel('Puntuación Promedio', fontsize=12, fontweight='bold')
        plt.xticks(fontsize=12,fontweight='bold',ha='center')
        plt.ylim(0, df['Puntuacion'].max() + 1)
        plt.legend(title='Género')
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        sns.despine(left=True, bottom=True)
        plt.tight_layout()
        
        ruta_guardado  = os.path.join(self.generar_direccion(),'grafico_edad.png')
        plt.savefig(ruta_guardado, format='png', dpi=300, bbox_inches='tight')

        plt.show()
        plt.close()

    def grafico_empresa_ent(self):
        df = self.data.empresa_competencia()

        df_melt = df.melt(
            id_vars='Empresa',
            value_vars=['Si','No'],
            var_name='Respuesta',
            value_name='Cantidad'
        )

        plt.figure(figsize=(12,8))
        ax = sns.barplot(
            data=df_melt,
            x='Empresa',
            y='Cantidad',
            hue='Respuesta',
            dodge=True,
            palette='Set2'
        )

        for container in ax.containers:
            ax.bar_label(container) #type:ignore

        plt.title('Competencia Digital por Tipo de Empresa', fontsize=14)
        plt.xticks(rotation=45,ha='right')
        plt.legend(title='Conoce su nivel de competencia')
        plt.tight_layout()

        ruta_guardado  = os.path.join(self.generar_direccion(),'grafico_empresa.png')
        plt.savefig(ruta_guardado, format='png', dpi=300, bbox_inches='tight')

        plt.show()
        plt.close()

    def graphic_si_no(self):
        
        df = self.data.tecnologias_si_no() 

        df = df.sort_values('Si', ascending=False)

        etiquetas_cortas = {
            "Conoce las oportunidades que el IOT (Internet de las cosas) puede aportar en su trabajo y empresa": "IoT",
            "Conoce las oportunidades que el IA (Inteligencia artificial) puede aportar en su trabajo y empresa": "IA",
            "Conoce o ha utilizado servicios de alojamiento de archivos en la nube": "Nube",
            "Ha participado en consultas ciudadanas o encuestas a traves de internet (online) a propuestas de organizaciones publicas o sociales": "Participación",
            "Participa en experiencias innovadoras relacionadas con el uso de nuevas tecnologias": "Innovación"
        }
        df['Etiqueta'] = df['Pregunta'].astype(str).map(lambda x: etiquetas_cortas.get(x, x))

        # 2) Pasar a formato largo para seaborn
        df_melt = df.melt(
            id_vars=['Pregunta', 'Etiqueta'],
            value_vars=['Si', 'No'],
            var_name='Respuesta',
            value_name='Cantidad'
        )

        # 3) Graficar
        plt.figure(figsize=(12, 8))
        ax = sns.barplot(
            data=df_melt,
            x='Etiqueta',
            y='Cantidad',
            hue='Respuesta',
            dodge=True,
            palette='Set2'
        )

        # Etiquetas en barras
        for container in ax.containers:
            ax.bar_label(container, fontsize=10) #type:ignore

        plt.title('Uso de Tecnologías Digitales (Sí vs No)', fontsize=16, fontweight='bold')
        plt.xlabel('Pregunta')
        plt.ylabel('Cantidad de respuestas')
        plt.grid(axis='y', linestyle='--', alpha=0.6)
        plt.legend(title='Respuesta')
        plt.tight_layout()
        ruta_guardado = os.path.join(self.generar_direccion(), 'grafico_tecnologias_si_no.png')
        plt.savefig(ruta_guardado, format='png', dpi=300, bbox_inches='tight')

        plt.show()
        plt.close()
<<<<<<< HEAD

    def correlacion_graphic(self):
        # Obtener matriz de correlación
        corr = self.data.correlacion_data()

        # Etiquetas cortas
        etiquetas_cortas = {
            'Tiene conocimientos de computacion y navegacion en internet': 'Comp-Internet',
            'Identifica parametros que deben cumplir las paginas web y la informacion online para considerar su confiabilidad y calidad': 'Confiabilidad',
            'Sabe editar y modificar con herramientas digitales, el formato de diferentes tipos de archivo textos, fotografias, videos': 'Edicion-Archivos',
            'Conoce y actua con prudencia cuando recibe mensajes cuyo remitente, contenido o archivo adjunto sea desconocido (SPAM)': 'Seguridad',
            'Se interesa en conocer las politicas de privacidad de las plataformas que utiliza en Internet, asi como el tratamiento que hacen de sus datos personales': 'Privacidad',
            'Es capaz de evaluar y elegir de manera adecuada un dispositivo, software, aplicacion o servicio para realizar sus tareas': 'Eval-Tecnologica'
        }

        corr.rename(index=etiquetas_cortas, columns=etiquetas_cortas, inplace=True)

        # Crear colormap suave de azul claro a rojo claro
        colors = ['#cce5ff', '#99ccff', '#ffcc99', '#ff9999']  # azul claro → rojo claro
        cmap = LinearSegmentedColormap.from_list("soft_cmap", colors)

        # Figura
        plt.figure(figsize=(10,8))

        # Graficar heatmap
        sns.heatmap(
            corr,
            annot=True,
            fmt=".2f",
            cmap=cmap,
            linewidths=0.5,
            linecolor='gray',
            cbar_kws={'shrink': 0.7, 'label': 'Correlación'},
            vmin=0, vmax=1  # azul = mínimo, rojo = máximo
        )

        # Rotación de etiquetas
        plt.xticks(rotation=45, ha='right', fontsize=10)
        plt.yticks(rotation=0, fontsize=10)

        plt.title("Mapa de calor de correlaciones entre competencias digitales", fontsize=14, fontweight='bold', pad=20)
        plt.tight_layout()

        ruta_guardado  = os.path.join(self.generar_direccion(),'correlacion_competencias.png')
        plt.savefig(ruta_guardado, format='png', dpi=300, bbox_inches='tight')

        plt.show()


                
=======
        
>>>>>>> f84f4d8ee6e3e0a65af75b8b70fb295cbdaa8966
