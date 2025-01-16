import { createDebounce } from './debounceUtils.js';
import { setButtonState } from './buttonStateUtils.js';
import { appState } from '../stateManager.js';

class ValidationUtils {
    constructor() {
        // Crear versiones debounced de las funciones de validación
        this.validateTextFieldDebounced = createDebounce(
            this._validateTextField.bind(this),
            { delay: 300 }
        );

        this.validateFormDebounced = createDebounce(
            this._validateForm.bind(this),
            { delay: 200, leading: true }
        );
    }

    _validateTextField(textId, playButtonId) {
        const text = document.getElementById(textId)?.value.trim() ?? '';
        const valid = text !== '';
        const playButton = document.getElementById(playButtonId);
        
        if (playButton) {
            setButtonState(playButton, valid);
        }
        
        return valid;
    }

    _validateForm() {
        const generateVideoButton = document.getElementById('generateVideoButton');
        const state = appState.getState();
        
        const validText = this._validateTextField('introText', 'introPlayButton') &&
            (this._validateTextField('narrationText', 'narrationPlayButton') || 
             state.validFacts);
            
        const validVideo = state.videoLinkValid || state.fileSourceLink;
        const validMusic = state.musicLinkValid;
        const allValid = validText && validVideo && validMusic;
        
        if (generateVideoButton) {
            setButtonState(generateVideoButton, allValid);
        }
        
        // Actualizar estado global
        appState.updateValidation('form', allValid);
        
        return allValid;
    }

    // Métodos públicos sin debounce para uso directo
    validateTextField(textId, playButtonId) {
        return this._validateTextField(textId, playButtonId);
    }

    validateForm() {
        return this._validateForm();
    }

    // Métodos específicos de validación
    validateIntro() {
        const isValid = this.validateTextField('introText', 'introPlayButton');
        appState.updateValidation('intro', isValid);
        return isValid;
    }

    validateNarration() {
        const isValid = this.validateTextField('narrationText', 'narrationPlayButton');
        appState.updateValidation('narration', isValid);
        return isValid;
    }

    // Método para limpiar los debounces
    cleanup() {
        this.validateTextFieldDebounced.cancel();
        this.validateFormDebounced.cancel();
    }
}

export const validationUtils = new ValidationUtils();