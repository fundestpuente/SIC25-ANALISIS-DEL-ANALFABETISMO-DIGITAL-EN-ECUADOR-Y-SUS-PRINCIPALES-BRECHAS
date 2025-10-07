import matplotlib.pyplot as plt
import os
import seaborn as sns
import pandas as pd

from src.processing_data import Data


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

