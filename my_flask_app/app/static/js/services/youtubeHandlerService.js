import { appState } from '../stateManager.js';
import { youtubeService } from './youtubeService.js';
import { validationUtils } from '../utils/validationUtils.js';

class YouTubeLinkHandler {
    /**
     * Actualiza la UI basándose en la validación del link
     */
    updateUI(type, isValid, videoInfo = null) {
        const elements = {
            input: document.getElementById(`${type}Link`),
            thumbnail: document.getElementById(`${type}Thumbnail`),
            title: document.getElementById(`${type}Title`),
            fileButton: document.getElementById(`${type}FileButton`)
        };

        if (isValid && videoInfo) {
            this._updateValidUI(elements, videoInfo);
        } else {
            this._updateInvalidUI(elements, type);
        }
    }

    /**
     * Actualiza la UI para un link válido
     */
    _updateValidUI(elements, videoInfo) {
        const { input, thumbnail, title, fileButton } = elements;
        
        // Resetear estilos
        input.style.borderColor = '';
        
        // Actualizar thumbnail
        thumbnail.src = videoInfo.thumbnail;
        thumbnail.style.display = 'block';
        
        // Actualizar título
        const truncatedText = this._truncateText(videoInfo.title, 20);
        title.textContent = truncatedText;
        title.style.display = 'block';
        
        // Ocultar botón de archivo
        fileButton.style.display = 'none';
    }

    /**
     * Actualiza la UI para un link inválido
     */
    _updateInvalidUI(elements, type) {
        const { input, thumbnail, title, fileButton } = elements;
        
        // Actualizar borde del input
        input.style.borderColor = input.value.trim() === '' || type === 'exit' 
            ? '' 
            : 'red';
        
        // Resetear thumbnail y título
        thumbnail.style.display = 'none';
        thumbnail.src = '';
        title.textContent = '';
        
        // Mostrar botón de archivo
        fileButton.style.display = 'initial';
    }

    /**
     * Maneja la entrada de un nuevo link
     */
    async handleLinkInput(type, link) {
        if (link.trim() === '') {
            this._handleEmptyLink(type);
            return;
        }

        try {
            const videoInfo = await youtubeService.getVideoInfo(link);
            if (videoInfo) {
                this._handleValidLink(type, link, videoInfo);
            } else {
                this._handleInvalidLink(type);
            }
        } catch (error) {
            console.error(`Error processing ${type} link:`, error);
            this._handleInvalidLink(type);
        }
    }

    /**
     * Maneja un link vacío
     */
    _handleEmptyLink(type) {
        appState.updateValidation(`${type}Link`, false);
        appState.updateMedia(`${type}Link`, '');
        this.updateUI(type, false);
    }

    /**
     * Maneja un link válido
     */
    _handleValidLink(type, link, videoInfo) {
        appState.updateValidation(`${type}Link`, true);
        appState.updateMedia(`${type}Link`, link);
        appState.updateMedia(`${type}Info`, {
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail
        });
        this.updateUI(type, true, videoInfo);
    }

    /**
     * Maneja un link inválido
     */
    _handleInvalidLink(type) {
        appState.updateValidation(`${type}Link`, false);
        appState.updateMedia(`${type}Link`, '');
        appState.updateMedia(`${type}Info`, null);
        this.updateUI(type, false);
    }

    /**
     * Trunca el texto a una longitud máxima
     */
    _truncateText(text, maxLength) {
        return text.length > maxLength 
            ? text.substring(0, maxLength - 3) + '...' 
            : text;
    }

    /**
     * Inicializa los event listeners para un tipo de link
     */
    async initializeLink(type) {
        const linkInput = document.getElementById(`${type}Link`);
        if (!linkInput) return;

        // Event listener para input
        linkInput.addEventListener('input', async () => {
            await this.handleLinkInput(type, linkInput.value);
        });

        // Event listener para backspace
        linkInput.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                if (appState.getState().media[`${type}File`] != null) return;
                linkInput.value = '';
                this._handleEmptyLink(type);
            }
        });
    }

    /**
     * Inicializa todos los handlers
     */
    async initialize() {
        await Promise.all([
            this.initializeLink('video'),
            this.initializeLink('music')
        ]);
    }
}

export const youtubeLinkHandler = new YouTubeLinkHandler();