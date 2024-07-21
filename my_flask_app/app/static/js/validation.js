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
        if (input.value.trim() === '') {
            input.style.borderColor = '';
        } else {
            input.style.borderColor = 'red';
        }
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
