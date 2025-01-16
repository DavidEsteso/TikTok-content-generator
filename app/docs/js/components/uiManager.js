import {appState} from '../stateManager.js';
import { translations } from '../config/translations.js';
import { validationUtils } from '../utils/validationUtils.js';
import { factManager } from './factManager.js';
import { fileManager } from './fileManager.js';
import { svgIcons } from '../config/svgIcons.js';

export const uiManager = {
    validateIntro() {
        const isValid = validationUtils.validateTextField('introText', 'introPlayButton');
        appState.updateValidation('intro', isValid);
    },

    validateNarration() {
        const isValid = validationUtils.validateTextField('narrationText', 'narrationPlayButton');
        appState.updateValidation('narration', isValid);
    },
    toggleLanguage() {
        // Alterna el idioma actual
        const state = appState.getState();
        const newLanguage = state.settings.language === 'en' ? 'es' : 'en';
        appState.updateSettings('language', newLanguage);
        state.settings.language = newLanguage;

        // Traduce los textos
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[newLanguage][key]) {
                element.textContent = translations[newLanguage][key];
            }
        });
    
        // Traduce los placeholders
        document.querySelectorAll('[data-placeholder-key]').forEach(element => {
            const key = element.getAttribute('data-placeholder-key');
            if (translations[newLanguage][key]) {
                element.placeholder = translations[newLanguage][key];
            }
        });
    
        // Traduce los valores de los botones
        document.querySelectorAll('button[data-lang-key]').forEach(button => {
            const key = button.getAttribute('data-lang-key');
            if (translations[newLanguage][key]) {
                button.textContent = translations[newLanguage][key];
            }
        });
    },

    toggleVideoType() {
        const videoType = document.getElementById('videoType').value;
        const factsContainer = document.getElementById('factsContainer');
        const narrationContainer = document.getElementById('narrationContainer');
        appState.updateSettings('videoType', videoType);

        switch (videoType) {
            case 'facts':
                factsContainer.style.display = 'flex';
                narrationContainer.style.display = 'none';
                document.getElementById('narrationText').value = '';
                factManager.validateFacts();
                break;
            case 'narration':
                factsContainer.style.display = 'none';
                narrationContainer.style.display = 'flex';
                document.querySelectorAll('textarea[name="factText"]')
                    .forEach(fact => fact.value = '');
                break;
        }
    },

    toggleMusicSection() {
        const musicSvg = svgIcons.music;
        const trashSvg = svgIcons.trash;

        const musicContainer = document.getElementById('musicContainer');
        const toggleMusicButton = document.getElementById('toggleMusicButton');
    
        const state = appState.getState();
        const isAddingMusic = !state.settings.showMusicSection;
        appState.updateSettings('showMusicSection', isAddingMusic);
        appState.updateValidation('musicLink', !isAddingMusic);
    
        musicContainer.style.display = isAddingMusic ? 'flex' : 'none';
        toggleMusicButton.innerHTML = isAddingMusic ? trashSvg : musicSvg;
        fileManager.removeFile('music');
    },

    showLoadingScreen() {
        appState.updateUI('showLoadingScreen', true);
        document.getElementById('loadingScreen').style.display = 'flex';
    },

    hiddeLoadingScreen() {
        appState.updateUI('showLoadingScreen', false);
        document.getElementById('loadingScreen').style.display = 'none';
    },
     
    updateLinkValidation(type, isValid, title, thumbnail) {
        const input = document.getElementById(type + 'Link');
        const thumbnailElement = document.getElementById(type + 'Thumbnail');
        const titleElement = document.getElementById(type + 'Title');
        const fileButton = document.getElementById(type + 'FileButton');
        const span = document.getElementById(type + 'Span');
    
        if (isValid) {
            input.style.borderColor = '';
            thumbnailElement.src = thumbnail;
            thumbnailElement.style.display = 'block';
            titleElement.style.display = 'block';
            fileButton.style.display = 'none';
    
            const maxLength = 20; 
            const truncatedText = title.length > maxLength 
                ? title.substring(0, 17) + '...' 
                : title;
    
            titleElement.textContent = truncatedText;
    
            
            if (type === 'video') {
                videoLinkValid = true;
            } else if (type === 'music') {
                musicLinkValid = true;
            }
        } else {
            if (input.value.trim() === '' || type === 'exit') {
                input.style.borderColor = '';
            } else {
                input.style.borderColor = 'red';
            }
           
            thumbnailElement.style.display = 'none';
            thumbnailElement.src = '';
            titleElement.textContent = '';
            fileButton.style.display = 'initial  ';
            if (type === 'video') {
                videoLinkValid = false;
            } else if (type === 'music') {
                musicLinkValid = false;
            }
        }
    },

    applyColor(color) {
        const textElement = document.getElementById('fontPicker');
        textElement.style.color = color;
        appState.updateSettings('color', color);
    },

    applyFont (font) {
        appState.updateSettings('font', font);
    },

    handleFragment() {
        const fragment = document.querySelector('input[name="radio"]:checked').value;
        appState.updateSettings('fragments', fragment);
    }
};