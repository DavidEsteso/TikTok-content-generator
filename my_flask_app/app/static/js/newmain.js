// Import all required modules from their respective files
import { translations } from './config/translations.js';
import { CONSTANTS } from './config/constants.js';
import { youtubeService } from './services/youtubeService.js';
import { audioService } from './services/audioService.js';
import { videoService } from './services/videoService.js';
import { validationUtils } from './utils/validationUtils.js';
import { factManager } from './components/factManager.js';
import { fileManager } from './components/fileManager.js';
import { uiManager } from './components/uiManager.js';

// Global state object to manage application state
// Contains flags and values used across the application
const state = {
    videoLinkValid: false,      // Flag for video link validation
    musicLinkValid: true,       // Flag for music link validation
    validText: false,           // Flag for text content validation
    validIntro: false,          // Flag for introduction text validation
    validNarration: false,      // Flag for narration text validation
    validFacts: false,          // Flag for facts validation
    factsCount: 1,              // Counter for current number of facts
    totalFacts: 10,             // Maximum number of allowed facts
    currentLanguage: CONSTANTS.DEFAULT_LANGUAGE,  // Current application language
    fileSourceLink: true,       // Flag for file source type
    selectedColor: 0,           // Selected color value
    videoFile: null             // Stored video file reference
};

/**
 * Sets up all event listeners for the application
 * Initializes input handlers, button clicks, and form submissions
 */
function setupListeners() {
    // Set up video and music link input listeners
    document.getElementById('videoLink').addEventListener('input', videoLinkListener);
    document.getElementById('musicLink').addEventListener('input', musicLinkListener);

    // Set up text field input listeners with validation
    document.getElementById('introText').addEventListener('input', () => {
        state.validIntro = validationUtils.validateTextField('introText', 'introPlayButton');
        validationUtils.validateForm();
    });

    document.getElementById('narrationText').addEventListener('input', () => {
        state.validNarration = validationUtils.validateTextField('narrationText', 'narrationPlayButton');
        validationUtils.validateForm();
    });

    // Set up audio playback button listeners
    document.getElementById('introPlayButton').addEventListener('click', () => {
        audioService.playAudio('introText');
    });

    document.getElementById('narrationPlayButton').addEventListener('click', () => {
        audioService.playAudio('narrationText');
    });

    // Set up video type change handler
    document.getElementById('videoType').addEventListener('change', uiManager.toggleVideoType);

    // Set up language toggle handler
    document.getElementById('languageToggle').addEventListener('click', () => {
        state.currentLanguage = state.currentLanguage === 'en' ? 'es' : 'en';
        uiManager.toggleLanguage(state.currentLanguage, translations);
    });

    // Set up color selection handler
    document.getElementById('colorSelector').addEventListener('input', (e) => {
        state.selectedColor = e.target.value;
        uiManager.applyColor(state.selectedColor);
    });

    // Set up video generation button handler
    document.getElementById('generateVideoButton').addEventListener('click', handleVideoGeneration);
}

/**
 * Handles video link input changes and validation
 * Validates YouTube links and updates UI accordingly
 */
async function videoLinkListener() {
    const videoLinkInput = document.getElementById('videoLink');
    const videoLink = videoLinkInput.value;

    if (videoLink === '') {
        // Reset video link validation if input is empty
        videoLinkInput.style.borderColor = '';
        state.videoLinkValid = false;
        uiManager.updateLinkValidation('video', false, '', '');
    } else {
        try {
            // Attempt to get video info from YouTube
            const info = await youtubeService.getVideoInfo(videoLink);
            if (info) {
                uiManager.updateLinkValidation('video', true, info.title, info.thumbnail);
                state.videoLinkValid = true;
            } else {
                uiManager.updateLinkValidation('video', false, '', '');
                state.videoLinkValid = false;
            }
        } catch (error) {
            console.error('Error:', error);
            uiManager.updateLinkValidation('video', false, '', '');
            state.videoLinkValid = false;
        }
    }
    validationUtils.validateForm();
}

/**
 * Handles music link input changes and validation
 * Similar to videoLinkListener but for music links
 */
async function musicLinkListener() {
    const musicLinkInput = document.getElementById('musicLink');
    const musicLink = musicLinkInput.value;

    if (musicLink === '') {
        // Reset music link validation if input is empty
        musicLinkInput.style.borderColor = '';
        state.musicLinkValid = false;
        uiManager.updateLinkValidation('music', false, '', '');
    } else {
        try {
            // Attempt to get music video info from YouTube
            const info = await youtubeService.getVideoInfo(musicLink);
            if (info) {
                uiManager.updateLinkValidation('music', true, info.title, info.thumbnail);
                state.musicLinkValid = true;
            } else {
                uiManager.updateLinkValidation('music', false, '', '');
                state.musicLinkValid = false;
            }
        } catch (error) {
            console.error('Error:', error);
            uiManager.updateLinkValidation('music', false, '', '');
            state.musicLinkValid = false;
        }
    }
    validationUtils.validateForm();
}

/**
 * Handles the video generation process
 * Collects form data and initiates video generation
 */
async function handleVideoGeneration() {
    uiManager.showLoadingScreen();

    try {
        // Create FormData object and collect form inputs
        const formData = new FormData();
        const videoType = document.getElementById('videoType').value;
        const introText = document.getElementById('introText').value.trim();
        const content = getContentByVideoType(videoType);
        const selectedFont = document.getElementById('fontSelector').value;
        const selectedRadio = getSelectedRadioValue();

        // Append all collected data to FormData
        formData.append('introText', introText);
        formData.append('videoType', videoType);
        formData.append('content', JSON.stringify(content));
        formData.append('videoLink', document.getElementById('videoLink').value.trim());
        formData.append('musicLink', document.getElementById('musicLink').value.trim());
        formData.append('lang', state.currentLanguage);
        formData.append('font', selectedFont);
        formData.append('color', state.selectedColor);
        formData.append('radio', selectedRadio);

        // Append files if they exist
        if (state.videoFile) formData.append('videoFile', state.videoFile);
        if (document.getElementById('musicHiddenFileInput')?.files[0]) {
            formData.append('musicFile', document.getElementById('musicHiddenFileInput').files[0]);
        }

        // Generate and preview the video
        const videoUrl = await videoService.generateVideo(formData);
        videoService.previewVideo(videoUrl);

    } catch (error) {
        console.error('Error generating video:', error);
        uiManager.showError('Error generating video');
    } finally {
        uiManager.hideLoadingScreen();
    }
}

/**
 * Gets content based on video type selection
 * @param {string} videoType - The type of video being generated
 * @returns {Array} Array of content items
 */
function getContentByVideoType(videoType) {
    if (videoType === 'facts') {
        // Collect and filter facts from text areas
        return Array.from(document.querySelectorAll('textarea[name="factText"]'))
            .map(fact => fact.value.trim())
            .filter(fact => fact !== '');
    } else if (videoType === 'narration') {
        // Get narration text if available
        const narrationText = document.getElementById('narrationText').value.trim();
        return narrationText ? [narrationText] : [];
    }
    return [];
}

/**
 * Gets the selected radio button value
 * @returns {string|null} Selected radio value or null if none selected
 */
function getSelectedRadioValue() {
    const radios = document.querySelectorAll('.mydict input[type="radio"]');
    for (const radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

// Export main application functions and state for use in other modules
export const mainApp = {
    state,
    setupListeners,
    handleVideoGeneration
};

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    uiManager.toggleVideoType();
    setupListeners();
    factManager.validateFacts();
    validationUtils.validateIntro();
    validationUtils.validateNarration();
    validationUtils.validateForm();
});