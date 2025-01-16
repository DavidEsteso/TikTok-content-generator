import {appState} from '../stateManager.js';

export const audioService = {
    async playAudio(textId) {
        try {
            const text = document.getElementById(textId).value.trim();
            const currentLanguage = appState.getState().settings.language;

            const response = await fetch('/play-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    content: text,
                    lang: currentLanguage
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server error response:', errorData);
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.blob();
            const url = window.URL.createObjectURL(data);
            const audio = new Audio(url);
            
            audio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
            });

            await audio.play();
        } catch (error) {
            console.error('Detailed error:', error);
        }
    }
};