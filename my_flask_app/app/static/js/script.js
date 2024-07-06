let videoLinkValid = false;
let musicLinkValid = true;
let validText = false;
let validIntro = false;
let validNarration = false;
let validFacts = false; 
let factsCount = 1;
let totalFacts = 2;
let currentLanguage = 'en';

const translations = {
    en: {
        generateVideo: 'Generate Video',
        videoType: 'Video Type:',
        facts: 'Facts',
        narration: 'Narration',
        introText: 'Introduction Text:',
        factsText: 'Facts:',
        addFact: 'Add Fact',
        narrationText: 'Narration Text:',
        videoLink: 'YouTube Video Link:',
        musicLink: 'YouTube Music Link:',
        toggleMusicYes: 'Add Music to Video',
        toggleMusicNo: 'Delete Music from Video',
        generateVideoButton: 'Generate Video',
        toggleLanguage: 'Change Language',
    },
    es: {
        generateVideo: 'Generar Video',
        videoType: 'Tipo de Video:',
        facts: 'Curiosidades',
        narration: 'Narración',
        introText: 'Texto de Introducción:',
        factsText: 'Curiosidades:',
        addFact: 'Añadir curiosidad',
        narrationText: 'Texto de Narración:',
        videoLink: 'Enlace de Video de YouTube:',
        musicLink: 'Enlace de Música de YouTube:',
        toggleMusicYes: 'Agregar Música al Video',
        toggleMusicNo: 'Eliminar Música del Video',
        generateVideoButton: 'Generar Video',
        toggleLanguage: 'Cambiar Idioma',
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




function setButtonState(button, state) {
    button.disabled = !state;
    button.style.opacity = state ? 1 : 0.3;
    button.style.cursor = state ? 'pointer' : 'not-allowed';
    button.style.pointerEvents = state ? 'auto' : 'none';
}

function checkFactsValidity() {
    const facts = document.querySelectorAll('textarea[name="fact[]"]');
    validFacts = Array.from(facts).some(fact => fact.value.trim() !== '');
}

function validateFacts() {
    checkFactsValidity();

    const facts = document.querySelectorAll('textarea[name="fact[]"]');
    facts.forEach(fact => {
        const playButton = document.getElementById(fact.id.replace('fact', 'play'));
        setButtonState(playButton, fact.value.trim() !== '');
    });

    validateForm();
}

function validateIntro() {
    validIntro = validateTextField('introText', 'introPlayButton');
    validateForm();
}

function validateNarration() {
    validNarration = validateTextField('narrationText', 'narrationPlayButton');
    validateForm();
}

function validateTextField(textId, playButtonId) {
    const text = document.getElementById(textId).value.trim();
    const valid = text !== '';
    setButtonState(document.getElementById(playButtonId), valid);
    return valid;
}

function validateForm() {
    const generateVideoButton = document.getElementById('generateVideoButton');
    validText = validIntro && (validNarration || validFacts);
    const allValid = videoLinkValid && musicLinkValid && validText;
    setButtonState(generateVideoButton, allValid);
}




function addFact() {
    if (factsCount >= 5) return;

    const container = document.getElementById('factList');
    factsCount++;
    const idPlay = 'play' + factsCount;
    const idFact = 'fact' + factsCount;

    const fact = document.createElement('div');
    fact.className = 'fact';
    fact.innerHTML = `
        <textarea name="fact[]" id="${idFact}" class="fact" rows="2" cols="80" maxlength="300" oninput="validateFacts()" placeholder="Enter fact"></textarea>
        <button type="button" id="${idPlay}" class="play-fact" onclick="playFact(event)" style="width: 45px; height: 45px;">🔊</button>
        <button type="button" id="removeFactButton" onclick="removeFact(this)" style="width: 45px; height: 45px;">🗑️</button>
    `;
    container.appendChild(fact);

    setButtonState(document.getElementById('addFactButton'), factsCount < 5);

    const removeFactButtons = document.querySelectorAll('button[id="removeFactButton"]');
    removeFactButtons.forEach(btn => setButtonState(btn, factsCount > 1));

    validateFacts();
}

function removeFact(button) {
    const fact = button.parentNode;
    fact.parentNode.removeChild(fact);
    factsCount--;
    if (factsCount == 1) {
        const removeFactButtons = document.querySelectorAll('button[id="removeFactButton"]');
        removeFactButtons.forEach(btn => setButtonState(btn, factsCount > 1));
    }
    setButtonState(document.getElementById('addFactButton'), factsCount < 5);
    validateFacts();
}




function playNarration() {
    playAudio('narrationText');
}

function playIntro() {
    playAudio('introText');
}

function playFact(event) {
    const id = event.target.id;
    const factId = id.replace('play', 'fact');
    playAudio(factId);
}

function playAudio(textId) {
    const text = document.getElementById(textId).value.trim();
    fetch('/play-audio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: text })
    })
    .then(response => response.blob())
    .then(data => {
        const url = window.URL.createObjectURL(data);
        const audio = new Audio(url);
        audio.play();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}







function toggleMusicSection() {
    const musicLinkLabel = document.getElementById('musicLinkLabel');
    const musicLinkInput = document.getElementById('musicLink');
    const musicDetails = document.getElementById('musicDetails');
    const toggleMusicButton = document.getElementById('toggleMusicButton');
    const musicThumbnail = document.getElementById('musicThumbnail');
    const musicVideoTitle = document.getElementById('musicTitle');

    const isAddingMusic = musicLinkInput.style.display === 'none';
    if (isAddingMusic) {
        musicLinkInput.value = '';
        musicLinkInput.style.borderColor = '';
        musicLinkValid = false;
    } else {
        musicLinkValid = true;
        musicThumbnail.style.display = 'none';
        musicThumbnail.src = '';
        musicVideoTitle.textContent = '';
    }

    musicLinkInput.style.display = isAddingMusic ? 'block' : 'none';
    musicLinkLabel.style.display = isAddingMusic ? 'block' : 'none';
    musicDetails.style.display = isAddingMusic ? 'block' : 'none';
    toggleMusicButton.textContent = isAddingMusic ? translations[currentLanguage].toggleMusicNo : translations[currentLanguage].toggleMusicYes;
    toggleMusicButton.setAttribute('data-lang-key', isAddingMusic ? 'toggleMusicNo' : 'toggleMusicYes');
    validateForm();
}

function toggleVideoType() {
    const videoType = document.getElementById('videoType').value;
    const factsContainer = document.getElementById('factsContainer');
    const narrationContainer = document.getElementById('narrationContainer');

    switch (videoType) {
        case 'facts':
            factsContainer.style.display = 'block';
            narrationContainer.style.display = 'none';
            narrationContainer.textContent = '';
            validateFacts();
            break;
        case 'narration':
            factsContainer.style.display = 'none';
            narrationContainer.style.display = 'block';
            const facts = document.querySelectorAll('textarea[name="fact[]"]');
            facts.forEach(fact => fact.value = ''); 
            validateNarration();
            break;
        default:
            factsContainer.style.display = 'none';
            narrationContainer.style.display = 'none';
            break;
    }
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
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
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


document.addEventListener('DOMContentLoaded', () => {
    setupListeners();
    validateFacts();
    validateIntro();
    validateNarration();
    validateForm();
});
