import subprocess

def add_centered_text_transitions_to_video(color,font,input_video, output_video, dur_sct,text, fontsize_ini=4, words_per_transition=3):
    # Utilizar ffprobe para obtener las dimensiones del video
    probe = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'default=noprint_wrappers=1:nokey=1', input_video],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    width, height = map(int, probe.stdout.strip().split('\n'))
    global fontsize
    fontsize = fontsize_ini + height * 0.04
    
    # Dividir el texto en secciones basadas en la palabra "SCT"
    sections = text.split('SCT')
    sections = [section.strip() for section in sections if section.strip()]

    # Construir los filtros drawtext para cada sección
    drawtext_filters = []
    total_sections = len(sections)
    current_time = 0
    
    for i, section in enumerate(sections):
        words = section.split()
        total_words = len(words)
        total_transitions = (total_words - 1) // words_per_transition + 1

        for j in range(total_transitions):
            start_index = j * words_per_transition
            end_index = min((j + 1) * words_per_transition, total_words)
            words_segment = ' '.join(words[start_index:end_index])
            
            # Calcular el tiempo de inicio y final para cada transición
            start_time = current_time
            end_time = start_time + dur_sct
            current_time += dur_sct
            
            # Calcular la posición vertical para el texto
            y_position = (height - fontsize) / 2 + 250
            
            # Construir el filtro drawtext para cada transición
            drawtext_filters.append(
                f"drawtext=text='{words_segment}':fontfile=fuentes/{font}:fontcolor={color.replace('#','').upper()}:fontsize={fontsize}:"
                f"shadowcolor=black@0.75:shadowx=2:shadowy=2:borderw=2:bordercolor=black:"
                f"x=(w-text_w)/2:y={y_position}:enable='between(t,{start_time+0.01},{end_time-0.01})'"
            )

    # Unir los filtros con una coma
    drawtext_filter = ",".join(drawtext_filters)
    
    # Comando para agregar texto centrado con transiciones
    command = [
        'ffmpeg', '-y','-i', input_video, '-vf', drawtext_filter,
        '-codec:a', 'copy', output_video
    ]
    
    # Ejecutar el comando
    subprocess.run(command, check=True)