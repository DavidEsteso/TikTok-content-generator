import {appState} from '../stateManager.js';
import { audioService } from '../services/audioService.js';
import { svgIcons } from '../config/svgIcons.js';

class FactManager {
    constructor() {
        this.bindEvents();
        this.validateFacts();
        this.initializeFirstFact();
    }

    bindEvents() {
        // Usando event delegation para los botones de remove
        const factsContainer = document.getElementById('factsAdder');
        if (factsContainer) {
            factsContainer.addEventListener('click', (e) => {
                const removeButton = e.target.closest('#removeFactButton');
                if (removeButton) {
                    this.removeFact(removeButton);
                }
            });
        }
    }

    initializeFirstFact() {
        const firstFactTextarea = document.getElementById('fact1');
        const firstPlayButton = document.getElementById('play1');
        
        if (firstFactTextarea) {
            firstFactTextarea.addEventListener('input', () => {
                this.validateFacts();
            });
        }
        
        if (firstPlayButton) {
            firstPlayButton.addEventListener('click', () => {
                audioService.playAudio('fact1');
            });
        }
    }

    removeFact(button) {
        const state = appState.getState();
        const label = button.closest('label');
        
        if (!label || state.facts.count <= 1) return;

        label.remove();
        
        appState.updateFacts('count', state.facts.count - 1);

        this.updateFactButtons();
        this.validateFacts();
    }

    addFact() {
        const state = appState.getState();
        if (state.facts.count >= 5) return;
    
        const container = document.getElementById('factsAdder');
        const nextId = state.facts.totalAdded + 1;
        const idFact = 'fact' + nextId;
        const idPlay = 'play' + nextId;
    
        const label = document.createElement('label');
        label.className = 'container';
        label.innerHTML = `
            <textarea 
            required
            placeholder="" 
            cols="80" 
            id="${idFact}" 
            name="factText" 
            rows="2" 
            class="input" 
            maxlength="300"
            ></textarea>
            <span class="link">Fact:</span>
        
            <div class="fact">
            <button type="button" id="${idPlay}" class="play-fact" style="width: 45px; height: 45px;">
                ${svgIcons.volumeUp}
            </button>
            <button type="button" id="removeFactButton" style="width: 45px; height: 45px;">
                ${svgIcons.trash}
            </button>
            </div>
        `;
    
        container.appendChild(label);

        // Bindear eventos después de agregar el elemento
        this.setupFactEvents(nextId);
    
        // Actualizar estado
        appState.updateFacts('count', state.facts.count + 1);
        appState.updateFacts('totalAdded', state.facts.totalAdded + 1);
    
        this.updateFactButtons();
        this.validateFacts();
    }

    setupFactEvents(factId) {
        const factTextarea = document.getElementById(`fact${factId}`);
        if (factTextarea) {
            // Add input event listener for real-time validation
            factTextarea.addEventListener('input', () => {
                this.validateFacts();
            });
        }

        this.setupFactPlayButton(factId);
    }

    updateFactButtons() {
        const state = appState.getState();
        const addFactButton = document.getElementById('addFactButton');
        const removeFactButtons = document.querySelectorAll('button[id="removeFactButton"]');
        
        if (addFactButton) {
            addFactButton.disabled = state.facts.count >= 5;
        }
        
        removeFactButtons.forEach(btn => {
            const isDisabled = state.facts.count <= 1;
            btn.disabled = isDisabled;
            btn.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
            btn.style.opacity = isDisabled ? 0.3 : 1;
            btn.style.pointerEvents = isDisabled ? 'none' : 'auto';
        });
    }

    validateFacts() {
        const facts = document.querySelectorAll('textarea[name="factText"]');
        facts.forEach(fact => {
            const playButton = document.getElementById(fact.id.replace('fact', 'play'));
            if (playButton) {
                const isValid = fact.value.trim().length > 0;
                playButton.disabled = !isValid;
                playButton.style.opacity = isValid ? 1 : 0.5;
            }
        });
        
        const isValid = Array.from(facts).some(fact => fact.value.trim().length > 0);
        appState.updateValidation('facts', isValid);
    }

    setupFactPlayButton(factId) {
        const playButton = document.getElementById(`play${factId}`);
        if (playButton) {
            playButton.addEventListener('click', () => {
                const factTextId = `fact${factId}`;
                audioService.playAudio(factTextId);
            });
        }
    }
}

export const factManager = new FactManager();