from src.graphics import Graphics

if __name__ == '__main__':
    graphics = Graphics()
    graphics.grafico_participacion_innovacion_ciiu_genero()

    print("Generando boxplot de edad por fundamentos digitales...")
    graphics.boxplot_edad_fundamentos()
    
    print("Generando gráfico de radar de deficiencias por edad...")
    graphics.radar_deficiencias_edad()
