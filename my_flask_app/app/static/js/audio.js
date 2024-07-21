
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


