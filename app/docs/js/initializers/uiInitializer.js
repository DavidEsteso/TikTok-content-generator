// initializers/uiInitializer.js
import { validationUtils } from '../utils/validationUtils.js';
import { audioService } from '../services/audioService.js';
import { youtubeLinkHandler } from '../services/youtubeHandlerService.js';
import { videoService } from '../services/videoService.js';
import { factManager } from '../components/factManager.js';
import { fileManager } from '../components/fileManager.js';
import { uiManager } from '../components/uiManager.js';

class UIInitializer {
    initializeLanguageHandlers() {
        document.getElementById('languageSelect')?.addEventListener('change', (e) => {
            uiManager.toggleLanguage();
        });

        document.getElementById('videoType')?.addEventListener('change', () => {
            uiManager.toggleVideoType();
        });
    }

    initializeTextValidations() {
        document.getElementById('introText')?.addEventListener('input', () => {
            validationUtils.validateTextFieldDebounced('introText', 'introPlayButton');
            validationUtils.validateFormDebounced();
        });

        document.getElementById('narrationText')?.addEventListener('input', () => {
            validationUtils.validateTextFieldDebounced('narrationText', 'narrationPlayButton');
            validationUtils.validateFormDebounced();
        });
    }

    cleanup() {
        validationUtils.cleanup();
    }

    initializeAudioControls() {
        document.getElementById('introPlayButton')?.addEventListener('click', () => {
            audioService.playAudio('introText');
        });

        document.getElementById('narrationPlayButton')?.addEventListener('click', () => {
            audioService.playAudio('narrationText');
        });
        validationUtils.validateTextField('introText', 'introPlayButton');
        validationUtils.validateTextField('narrationText', 'narrationPlayButton');
    }

    initializeFactHandlers() {
        document.getElementById('addFactButton')?.addEventListener('click', () => {
            factManager.addFact();
        });
    }

    async initializeYouTubeHandlers() {
        youtubeLinkHandler.initialize();
    }

    initializeMusicControls() {
        document.getElementById('toggleMusicButton')?.addEventListener('click', () => {
            uiManager.toggleMusicSection();
        });
    }

    initializeColorAndFontPicker() {
        document.getElementById('colorPicker')?.addEventListener('input', (e) => {
            uiManager.applyColor(e.target.value);
        });
        document.getElementById('fontPicker')?.addEventListener('change', (e) => {
            uiManager.applyFont(e.target.value);
        });
    }

    initializeFileHandlers() {
        document.getElementById('videoFileButton')?.addEventListener('click', () => {
            fileManager.addFile('video');
        });
    
        document.getElementById('musicFileButton')?.addEventListener('click', () => {
            fileManager.addFile('music');
        });
    }

    initializeVideoGeneration() {
        document.getElementById('generateVideoButton')?.addEventListener('click', async () => {
            videoService.handleGenerateClick ();
        });
    }

    initializeFragmentRadio() {
        document.getElementById('fragment')?.addEventListener('click', () => {
            uiManager.handleFragment();
        });
    }

    initialize() {
        this.initializeLanguageHandlers();
        this.initializeTextValidations();
        this.initializeAudioControls();
        this.initializeFactHandlers();
        this.initializeYouTubeHandlers();
        this.initializeMusicControls();
        this.initializeColorAndFontPicker();
        this.initializeFileHandlers();
        this.initializeVideoGeneration();
        this.initializeFragmentRadio();
    }
}

export const uiInitializer = new UIInitializer();
