let videoLinkValid = false;
let musicLinkValid = true;
let validText = false;
let validIntro = false;
let validNarration = false;
let validFacts = false; 
let factsCount = 1;
let totalFacts = 10;
let currentLanguage = 'en';
let fileSourceLink = true;

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
    setButtonState(generateVideoButton, true);
}




function addFact() {
    if (factsCount >= 5) return;

    const container = document.getElementById('factList');
    factsCount++;
    const idFact = 'fact' + totalFacts;
    const idPlay = 'play' + totalFacts;
    const fact = document.createElement('div');
    fact.className = 'fact';
    fact.innerHTML = `
        <textarea name="fact[]" id="${idFact}" class="fact" rows="2" cols="80" maxlength="300" oninput="validateFacts()"></textarea>
        <button type="button" id="${idPlay}" class="play-fact" onclick="playFact(event)" style="width: 45px; height: 45px;">🔊</button>
        <button type="button" id="removeFactButton" onclick="removeFact(this)" style="width: 45px; height: 45px;">🗑️</button>
    `;
    container.appendChild(fact);

    setButtonState(document.getElementById('addFactButton'), factsCount < 5);

    const removeFactButtons = document.querySelectorAll('button[id="removeFactButton"]');
    removeFactButtons.forEach(btn => setButtonState(btn, factsCount > 1));
    totalFacts++;
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
        body: JSON.stringify({ 
            content: text,
            lang: currentLanguage
        })
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





function addFile(type) {
    let fileInput = document.getElementById(type + "HiddenFileInput");
    const fileButton = document.getElementById(type + "FileButton");
    const linkInput = document.getElementById(type + "Link");
    const details = document.getElementById(type + "Details");
    const container = document.getElementById(type + "Container");

    if (!fileInput) {
        const div = document.createElement("div");
        div.id = type + 'FileInputDiv';
        fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = type === 'video' ? "video/*" : "audio/*";
        fileInput.id = type + "HiddenFileInput";

        fileInput.addEventListener("change", function() {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                linkInput.style.display = "none";
                fileButton.style.display = "none";
                div.innerHTML = `
                    <div class="${type}">
                        <p id="${type}FileName" style="margin-right: 10px;">${file.name}</p>
                        <button type="button" id="${type}RemoveFileButton" style="width: 45px; height: 45px;">🗑️</button>
                    </div>
                `;
                details.style.display = "block";
                container.appendChild(div);

                document.getElementById(type + "RemoveFileButton").addEventListener("click", function() {
                    removeFile(type);
                });
            }
        });


        container.appendChild(div); 
    }

    fileInput.click(); 
}

function toggleMusicSection() {
    const musicContainer = document.getElementById('musicContainer');
    const toggleMusicButton = document.getElementById('toggleMusicButton');

    const isAddingMusic = musicContainer.style.display === 'none';

    if (!isAddingMusic) {

        removeFile('music');
    }

    musicContainer.style.display = isAddingMusic ? 'block' : 'none';
    toggleMusicButton.textContent = isAddingMusic ? translations[currentLanguage].toggleMusicNo : translations[currentLanguage].toggleMusicYes;
    toggleMusicButton.setAttribute('data-lang-key', isAddingMusic ? 'toggleMusicNo' : 'toggleMusicYes');

    validateForm();
}

function removeFile(type) {
    const container = document.getElementById(type + "Container");
    const fileInputDiv = document.getElementById(type + 'FileInputDiv');
    if (fileInputDiv) {
        fileInputDiv.remove(); 
    resetFileInput(type);
}
}

function resetFileInput(type) {
    const linkInput = document.getElementById(type + "Link");
    const fileButton = document.getElementById(type + "FileButton");
    const details = document.getElementById(type + "Details");
    linkInput.style.display = "block";
    fileButton.style.display = "block";
    linkInput.value = ""; 
    details.innerHTML = ""; 
    details.style.display = "none";
}

function resetMusicInputs() {

    resetFileInput('music');
}








function toggleVideoType() {
    const videoType = document.getElementById('videoType').value;
    const factsContainer = document.getElementById('factsContainer');
    const narrationContainer = document.getElementById('narrationContainer');

    switch (videoType) {
        case 'facts':
            factsContainer.style.display = 'block';
            narrationContainer.style.display = 'none';
            const narration = document.getElementById('narrationText');
            narration.value = '';
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
}


function generateVideo() {
    showLoadingScreen();
    // Recopilar información de introducción
    const introText = document.getElementById('introText').value.trim();

    // Determinar el tipo de video
    const videoType = document.getElementById('videoType').value;

    // Recopilar información de hechos (facts) o narración
    let content = [];

    if (videoType === 'facts') {
        const facts = document.querySelectorAll('textarea[name="fact[]"]');
        content = Array.from(facts).map(fact => fact.value.trim()).filter(fact => fact !== '');
    } else if (videoType === 'narration') {
        const narrationText = document.getElementById('narrationText').value.trim();
        if (narrationText) {
            content.push(narrationText);
        }
    }

    // Recopilar información de los enlaces de video y música
    const videoLink = document.getElementById('videoLink').value.trim();
    const musicLink = document.getElementById('musicLink').value.trim();

    // Verificar si se subieron archivos
    const videoFileInput = document.getElementById('videoHiddenFileInput');
    const musicFileInput = document.getElementById('musicHiddenFileInput');
    let videoFile = null;
    let musicFile = null;

    if (videoFileInput && videoFileInput.files.length > 0) {
        videoFile = videoFileInput.files[0];
    }

    if (musicFileInput && musicFileInput.files.length > 0) {
        musicFile = musicFileInput.files[0];
    }

    var formData = new FormData();
    formData.append('introText', introText);
    formData.append('videoType', videoType);
    formData.append('content', JSON.stringify(content));
    formData.append('videoLink', videoLink);
    formData.append('musicLink', musicLink);
    formData.append('lang', currentLanguage);
    formData.append('musicFile', musicFile);  
    formData.append('videoFile', videoFile);

    fetch('/generate-video/', {
        method: 'POST',     
        body: formData
    })
    .then(response => response.blob())
    .then(data => {
        hideLoadingScreen();
        const aElement = document.createElement("a");
        aElement.setAttribute("download", "output.mp4");
        const href = window.URL.createObjectURL(data);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
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
    toggleVideoType();
    setupListeners();
    validateFacts();
    validateIntro();
    validateNarration();
    validateForm();
});


function showLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'flex';
}

// Function to hide the loading screen
function hideLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'none';
}

