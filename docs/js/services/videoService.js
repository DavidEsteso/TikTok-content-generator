import { uiManager } from '../components/uiManager.js';
import { appState } from '../stateManager.js';

export class VideoService {
    constructor() {
        this.isGenerating = false;
        this.handleGenerateClick = this.handleGenerateClick.bind(this);

    }


    async handleGenerateClick(event) {
        event?.preventDefault();
        if (this.isGenerating) return;
        
        const generateButton = document.getElementById('generateVideoButton');
        
        try {
            this.isGenerating = true;
            generateButton.disabled = true;
            uiManager.showLoadingScreen();
            
            const formData = this.prepareFormData();

            logFormData(formData);
            await this.sendToServer(formData);
            
        } catch (error) {
            console.error('Error generating video:', error);
            alert('Error generating video. Please try again.');
        } finally {
            this.isGenerating = false;
            generateButton.disabled = false;
            uiManager.hiddeLoadingScreen();
        }
    }

    prepareFormData() {
        const formData = new FormData();
        const state = appState.getState();

        // Configuración básica
        formData.append('videoType', state.settings.videoType);
        formData.append('lang', state.settings.language);
        formData.append('color', state.settings.color || '000000');
        formData.append('font', state.settings.font);
        formData.append('radio', document.querySelector('.mydict input[type="radio"]:checked')?.value || 'orig');

        // Contenido
        const introText = document.getElementById('introText')?.value?.trim() || '';
        formData.append('introText', introText);

        // Contenido según el tipo de video
        let content = [];
        if (state.settings.videoType === 'facts') {
            const facts = document.querySelectorAll('textarea[name="factText"]');
            content = Array.from(facts)
                .map(fact => fact.value.trim())
                .filter(fact => fact !== '');
        } else {
            content = [document.getElementById('narrationText')?.value?.trim()].filter(Boolean);
        }
        formData.append('content', JSON.stringify(content));

        // Media files and links
        const videoFile = document.getElementById('videoHiddenFileInput')?.files[0];
        const musicFile = document.getElementById('musicHiddenFileInput')?.files[0];
        const videoLink = document.getElementById('videoLink')?.value?.trim() || '';
        const musicLink = document.getElementById('musicLink')?.value?.trim() || '';

        if (videoFile) formData.append('videoFile', videoFile);
        if (musicFile) formData.append('musicFile', musicFile);
        formData.append('videoLink', videoLink);
        formData.append('musicLink', musicLink);

        // Debug log
        console.log('FormData prepared:', {
            videoType: state.settings.videoType,
            lang: state.settings.language,
            hasVideoFile: !!videoFile,
            hasMusicFile: !!musicFile,
            contentLength: content.length
        });

        return formData;
    }

    async sendToServer(formData) {
        try {
            const response = await fetch('/generate-video/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

/*             const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated-video.mp4';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a); */

        } catch (error) {
            console.error('Error sending to server:', error);
            throw error;
        }
    }
}

export const videoService = new VideoService();

function logFormData(formData) {
    console.log('=== FormData Contents ===');
    for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
            console.log(pair[0], ':', {
                fileName: pair[1].name,
                fileSize: pair[1].size,
                fileType: pair[1].type
            });
        } else {
            console.log(pair[0], ':', pair[1]);
        }
    }
    console.log('=====================');
}
