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
