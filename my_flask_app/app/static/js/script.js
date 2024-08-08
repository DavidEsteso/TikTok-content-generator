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
let selectedColor=0;

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
    const fileButton = document.getElementById(type + 'FileButton');

    if (isValid) {
        input.style.borderColor = '';
        thumbnailElement.src = thumbnail;
        thumbnailElement.style.display = 'block';
        titleElement.textContent = title;
        titleElement.style.display = 'block';
        fileButton.style.display = 'none';
        if (type === 'video') {
            videoLinkValid = true;
        } else if (type === 'music') {
            musicLinkValid = true;
        }
    } else {
        if (input.value.trim() === '') {
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
}





function setButtonState(button, state) {
    button.disabled = !state;
    button.style.opacity = state ? 1 : 0.3;
    button.style.cursor = state ? 'pointer' : 'not-allowed';
    button.style.pointerEvents = state ? 'auto' : 'none';
}

function checkFactsValidity() {
    const facts = document.querySelectorAll('textarea[name="factText"]');
    validFacts = Array.from(facts).some(fact => fact.value.trim() !== '');
}

function validateFacts() {
    checkFactsValidity();

    const facts = document.querySelectorAll('textarea[name="factText"]');
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


function applyColor(inputElement) {
    selectedColor = inputElement.value;
    const textElement = document.getElementById('fontSelector');
    textElement.style.color = selectedColor;
}



function addFact() {
    if (factsCount >= 5) return; // Limitar a 5 hechos

    const container = document.getElementById('factsAdder');
    factsCount++;
    const idFact = 'fact' + totalFacts;
    const idPlay = 'play' + totalFacts;

    const label = document.createElement('label');
    label.className = 'container';
    label.innerHTML = `
        <textarea required="" placeholder="" cols="80" id="${idFact}" name="factText" rows="2" class="input" maxlength="300" oninput="validateFacts()"></textarea>
        <span class="link">Fact:</span>

        <div class="fact">
            <button type="button" id="${idPlay}" class="play-fact" onclick="playFact(event)" style="width: 45px; height: 45px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="volume-up" viewBox="0 0 16 16">
                    <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
                    <path d="M10.025 8a4.5 4.5 0 0 1-1.318 3.182L8 10.475A3.5 3.5 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.5 4.5 0 0 1 10.025 8M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11"/>
                </svg>
            </button>
            <button type="button" id="removeFactButton" onclick="removeFact(this)" style="width: 45px; height: 45px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="trash" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </button>
        </div>
    `;

    container.appendChild(label);

    // Deshabilitar el botón "Add Fact" si ya hay 5 hechos
    document.getElementById('addFactButton').disabled = factsCount >= 5;

    const removeFactButtons = document.querySelectorAll('button[id="removeFactButton"]');
    removeFactButtons.forEach(btn => {
        btn.disabled = factsCount <= 1;
        btn.style.cursor = factsCount <= 1 ? 'not-allowed' : 'pointer';
        btn.style.opacity = factsCount <= 1 ? 0.3 : 1;
        btn.style.pointerEvents = factsCount <= 1 ? 'none' : 'auto';
    });

    totalFacts++;
    validateFacts();
}

function removeFact(button) {
    const label = button.closest('label');
    label.remove();
    factsCount--;

    // Habilitar el botón "Add Fact" si hay menos de 5 hechos
    document.getElementById('addFactButton').disabled = factsCount >= 5;

    const removeFactButtons = document.querySelectorAll('button[id="removeFactButton"]');
    removeFactButtons.forEach(btn => {
        btn.disabled = factsCount <= 1;
        btn.style.cursor = factsCount <= 1 ? 'not-allowed' : 'pointer';
        btn.style.opacity = factsCount <= 1 ? 0.3 : 1;
        btn.style.pointerEvents = factsCount <= 1 ? 'none' : 'auto';
    });

    validateFacts();
}




function playNarration() {
    playAudio('narrationText');
}

function playIntro() {
    playAudio('introText');
}

function playFact(event) {
    const button = event.currentTarget;
    const id = button.id;
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
                linkInput.value = '';
                updateLinkValidation(type, false, '', '');
                const file = fileInput.files[0];
                linkInput.style.display = "none";
                fileButton.style.display = "none";
                div.innerHTML = `
                    <div class="${type}">
                        <p id="${type}FileName" style="margin-right: 10px;">${file.name}</p>
                        <button type="button" id="${type}RemoveFileButton" style="width: 45px; height: 45px;">
                            <svg xmlns="http://www.w3.org/2000/svg" class="trash" width="16" height="16" fill="currentColor"     viewBox="0 0 16 16">
                             <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>
                    </div>
                `;
                details.style.display = "none";
                fileInput.style.display="none";
                div.appendChild(fileInput)
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

    const trashSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="trash" viewBox="0 0 16 16">
                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
                    <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
                </svg>
            `;
    const xSquareSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
    `;


    const musicContainer = document.getElementById('musicContainer');
    const toggleMusicButton = document.getElementById('toggleMusicButton');

    const isAddingMusic = musicContainer.style.display === 'none';

    if (!isAddingMusic) {

        removeFile('music');
    }

    musicContainer.style.display = isAddingMusic ? 'flex' : 'none';
    toggleMusicButton.innerHTML = toggleMusicButton.innerHTML.includes('trash') ? xSquareSvg : trashSvg;
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
    linkInput.style.display = "flex";
    fileButton.style.display = "flex";
    details.style.display = "flex";
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
            factsContainer.style.display = 'flex';
            narrationContainer.style.display = 'none';
            const narration = document.getElementById('narrationText');
            narration.value = '';
            validateFacts();
            break;
        case 'narration':
            factsContainer.style.display = 'none';
            narrationContainer.style.display = 'flex';
            const facts = document.querySelectorAll('textarea[name="factText"]');
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

    //RadioButton
    const radios = document.querySelectorAll('.mydict input[type="radio"]');
    let selectedValue;
    // Itera sobre cada radio para encontrar el que está seleccionado
    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }

    // Recopilar información de hechos (facts) o narración
    let content = [];

    if (videoType === 'facts') {
        const facts = document.querySelectorAll('textarea[name="factText"]');
        content = Array.from(facts).map(fact => fact.value.trim()).filter(fact => fact !== '');
    } else if (videoType === 'narration') {
        const narrationText = document.getElementById('narrationText').value.trim();
        if (narrationText) {
            content.push(narrationText);
        }
    }

    var font = document.getElementById('fontSelector').value;

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
    formData.append('radio', selectedValue)
    formData.append('font',font)
    formData.append('color',selectedColor)

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
        previewVideo(href)
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        //aElement.click();
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

function previewVideo(videoUrl) {
    // Get the modal
    var modal = document.getElementById("videoModal");

    // Get the video element and the download button
    var video = document.getElementById("previewVideo");
    var videoSource = document.getElementById("videoSource");
    var downloadButton = document.getElementById("downloadButton");

    // Function to fetch video
    function fetchAndDisplayVideo() {
        fetch(videoUrl) // URL of the video
            .then(response => response.blob())
            .then(blob => {
                var url = URL.createObjectURL(blob);
                videoSource.src = url;
                video.load();
                downloadButton.href = url;
                modal.style.display = "block"; // Open the modal
            })
            .catch(error => {
                console.error('Error fetching video:', error);
            });
    }

    // When the user clicks on <span> (x), close the modal
    document.getElementsByClassName("close")[0].onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Fetch and display the video
    fetchAndDisplayVideo();
}

