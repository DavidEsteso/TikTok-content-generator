let videoLinkValid = false;
let musicLinkValid = true;
let validText = false;
let factsCount = 1;
let currentLanguage = 'en';

const translations = {
    en: {
        generateVideo: 'Generate Video',
        videoType: 'Video Type:',
        facts: 'Facts',
        narration: 'Narration',
        introText: 'Introduction Text:',
        factsText: 'Facts:',
        remove: 'Remove',
        addFact: 'Add Fact',
        narrationText: 'Narration Text:',
        videoLink: 'YouTube Video Link:',
        musicLink: 'YouTube Music Link:',
        toggleMusic: 'Add Music to Video',
        generateVideoButton: 'Generate Video',
        toggleLanguage: 'Change Language',
        introPlaceholder: 'Enter introduction',
        factPlaceholder: 'Enter fact',
        narrationPlaceholder: 'Enter narration',
        videoLinkPlaceholder: 'Enter YouTube video link',
        musicLinkPlaceholder: 'Enter YouTube music link'
    },
    es: {
        generateVideo: 'Generar Video',
        videoType: 'Tipo de Video:',
        facts: 'Curiosidades',
        narration: 'Narración',
        introText: 'Texto de Introducción:',
        factsText: 'Curiosidades:',
        remove: 'Eliminar',
        addFact: 'Añadir curiosidad',
        narrationText: 'Texto de Narración:',
        videoLink: 'Enlace de Video de YouTube:',
        musicLink: 'Enlace de Música de YouTube:',
        toggleMusic: 'Agregar Música al Video',
        generateVideoButton: 'Generar Video',
        toggleLanguage: 'Cambiar Idioma',
        introPlaceholder: 'Ingrese introducción',
        factPlaceholder: 'Ingrese curiosidad',
        narrationPlaceholder: 'Ingrese narración',
        videoLinkPlaceholder: 'Ingrese enlace de video de YouTube',
        musicLinkPlaceholder: 'Ingrese enlace de música de YouTube'
    }
};

function setupListeners() {
    document.getElementById('videoLink').addEventListener('input', videoLinkListener);
    document.getElementById('musicLink').addEventListener('input', musicLinkListener);
}

function videoLinkListener() {
    const videoLinkInput = document.getElementById('videoLink');
    const videoLink = videoLinkInput.value;
    if (videoLink === '') {
        videoLinkInput.style.borderColor = '';
        videoLinkValid = false;
        updateLinkValidation('video', false, '', '');
    } else {
        getVideoInfo(videoLink)
            .then(info => {
                if (info) {
                    updateLinkValidation('video', true, info.title, info.thumbnail);
                } else {
                    updateLinkValidation('video', false, '', '');
                }
                validateForm();
            })
            .catch(error => {
                console.error('Error:', error);
                document.body.style.backgroundColor = getRandomColor();
                updateLinkValidation('video', false, '', '');
                validateForm();
            });
    }
}

function musicLinkListener() {
    const musicLinkInput = document.getElementById('musicLink');
    const musicLink = musicLinkInput.value;
    if (musicLink === '') {
        musicLinkInput.style.borderColor = '';
        musicLinkValid = false;
        updateLinkValidation('music', false, '', '');
    } else {
        getVideoInfo(musicLink)
            .then(info => {
                if (info) {
                    updateLinkValidation('music', true, info.title, info.thumbnail);
                } else {
                    updateLinkValidation('music', false, '', '');
                }
                validateForm();
            })
            .catch(error => {
                console.error('Error:', error);
                document.body.style.backgroundColor = getRandomColor();
                updateLinkValidation('music', false, '', '');
                validateForm();
            });
    }
}

function updateLinkValidation(type, isValid, title, thumbnail) {
    const input = document.getElementById(type + 'Link');
    const thumbnailElement = document.getElementById(type + 'Thumbnail');
    const titleElement = document.getElementById(type + 'Title');

    if (isValid) {
        input.style.borderColor = '';
        thumbnailElement.src = thumbnail;
        thumbnailElement.style.display = 'block';
        titleElement.textContent = title;
        titleElement.style.display = 'block';
        if (type === 'video') {
            videoLinkValid = true;
        } else if (type === 'music') {
            musicLinkValid = true;
        }
    } else {
        input.style.borderColor = 'red';
        thumbnailElement.style.display = 'none';
        thumbnailElement.src = '';
        titleElement.style.display = 'none';
        titleElement.textContent = '';
        if (type === 'video') {
            videoLinkValid = false;
        } else if (type === 'music') {
            musicLinkValid = false;
        }
    }
}

function validateFacts() {
    const addFactButton = document.getElementById('addFactButton');
    if (factsCount >= 5) {
        addFactButton.disabled = true;
        addFactButton.style.opacity = 0.3;
        addFactButton.style.cursor = 'not-allowed';
        return;
    } else {
        addFactButton.disabled = false;
        addFactButton.style.opacity = 1;
        addFactButton.style.cursor = 'pointer';
    }
    const removeFactButtons = document.querySelectorAll('.fact button');
    if (factsCount == 1) {
        removeFactButtons[0].disabled = true;
        removeFactButtons[0].style.opacity = 0.3;
        removeFactButtons[0].style.cursor = 'not-allowed';
    } else {
        removeFactButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = 1;
            button.style.cursor = 'pointer';
        });
    }
    validateForm();
}

function validateText() {
    const introText = document.getElementById('introText').value.trim();
    const narrationText = document.getElementById('narrationText').value.trim();
    const facts = document.querySelectorAll('textarea[name="fact[]"]');
    const allFactsFilled = Array.from(facts).every(fact => fact.value.trim() !== '');
    
    if (introText && (narrationText || allFactsFilled)) {
        validText = true;
    } else {
        validText = false;
    }
    validateForm();
}

function validateForm() {
    const generateVideoButton = document.getElementById('generateVideoButton');
    if (videoLinkValid && musicLinkValid && validText) {
        generateVideoButton.disabled = false;
        generateVideoButton.style.cursor = 'pointer';
        generateVideoButton.style.opacity = 1;
    } else {
        generateVideoButton.disabled = true;
        generateVideoButton.style.cursor = 'not-allowed';
        generateVideoButton.style.opacity = 0.3;
    }
}

function toggleVideoType() {
    const videoType = document.getElementById('videoType').value;
    const factsContainer = document.getElementById('factsContainer');
    const narrationContainer = document.getElementById('narrationContainer');
    if (videoType === 'facts') {
        factsContainer.style.display = 'block';
        narrationContainer.style.display = 'none';
    } else {
        factsContainer.style.display = 'none';
        narrationContainer.style.display = 'block';
    }
    validateText();
}

function addFact() {
    const container = document.getElementById('factList');
    const fact = document.createElement('div');
    const buttonText = currentLanguage === 'en' ? 'Remove' : 'Eliminar';
    const placeholder = currentLanguage === 'en' ? 'Enter fact' : 'Ingrese curiosidad';
    fact.className = 'fact';
    fact.innerHTML = `
        <textarea name="fact[]" rows="2" cols="80" maxlength="300" oninput="validateText()"></textarea>
        <button type="button" data-lang-key="remove" onclick="removeFact(this)" style="width: 80px; height: 55px;">${buttonText}</button>
    `;
    container.appendChild(fact);
    factsCount++;
    
    validateText();
    validateFacts();
}

function removeFact(button) {
    const fact = button.parentNode;
    fact.parentNode.removeChild(fact);
    factsCount--;
    validateText();
    validateFacts();
}

function toggleMusicSection() {
    const musicLinkLabel = document.getElementById('musicLinkLabel');
    const musicLinkInput = document.getElementById('musicLink');
    const musicDetails = document.getElementById('musicDetails');
    const toggleMusicButton = document.getElementById('toggleMusicButton');

    const isAddingMusic = musicLinkInput.style.display === 'none';
    if (isAddingMusic) {
        musicLinkInput.value = '';
        musicLinkInput.style.borderColor = '';
        musicLinkValid = false;
    } else {
        musicLinkValid = true;
    }
    musicLinkInput.style.display = isAddingMusic ? 'block' : 'none';
    musicLinkLabel.style.display = isAddingMusic ? 'block' : 'none';
    musicDetails.style.display = isAddingMusic ? 'block' : 'none';
    toggleMusicButton.textContent = isAddingMusic ? translations[currentLanguage].toggleMusic : translations[currentLanguage].toggleMusic;
    validateForm();
}

function generateFactsVideo() {
    const facts = document.querySelectorAll('textarea[name="fact[]"]');
    return Array.from(facts).map(fact => fact.value.trim()).join('\n');
}

function extractVideoId(youtubeLink) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=)?([^#\&\?]*).*/;
    const match = youtubeLink.match(regex);
    return match && match[5] ? match[5] : null;
}

function getVideoInfo(youtubeLink) {
    const videoId = extractVideoId(youtubeLink);

    if (!videoId) {
        return Promise.resolve(null);
    }

    return fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyDDA5bfvWAdBPXn-K_kD9BeU1M-ju3VSeY`)
        .then(response => response.json())
        .then(data => {
            if (data.items.length === 0) {
                return null;
            }
            const videoTitle = data.items[0].snippet.title;
            const videoThumbnail = data.items[0].snippet.thumbnails.default.url;
            return { title: videoTitle, thumbnail: videoThumbnail };
        });
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        element.textContent = translations[currentLanguage][key];
    });
    document.querySelectorAll('[data-placeholder-key]').forEach(element => {
        const key = element.getAttribute('data-placeholder-key');
        element.placeholder = translations[currentLanguage][key];
    });

    fetch('/toggle-language', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})  // Puedes enviar datos adicionales si es necesario
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupListeners();
    validateFacts();
    validateText();
    validateForm();
});
