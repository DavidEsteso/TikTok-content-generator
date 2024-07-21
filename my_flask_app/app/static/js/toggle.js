

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

