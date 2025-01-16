class StateManager {
    constructor() {
        this._state = {
            validation: {
                intro: false,
                narration: false,
                facts: false,
                videoLink: false,
                musicLink: true,
            },
            media: {
                videoFile: null,
                musicFile: null,
                videoLink: '',
                musicLink: '',
            },
            facts: {
                count: 1,
                totalAdded: 1,
            },
            settings: {
                language: 'en',
                color: '#000000',
                font: 'anime-ace',
                videoType: 'narration',
                showMusicSection: false,
                fragments: 'original',
            },
            ui: {
                isGenerating: false,
                showLoadingScreen: false,
            }
        };
        this._subscribers = [];
    }

    getState() {
        return { ...this._state };
    }

    updateValidation(field, value) {
        this._state.validation[field] = value;
        this._notifySubscribers();
    }

    updateMedia(type, value) {
        this._state.media[type] = value;
        this._notifySubscribers();
    }

    updateSettings(setting, value) {
        this._state.settings[setting] = value;
        this._notifySubscribers();
    }

    updateFacts(key, value) {
        this._state.facts[key] = value;
        this._notifySubscribers();
    }

    updateUI(key, value) {
        this._state.ui[key] = value;
        this._notifySubscribers();
    }

    subscribe(callback) {
        this._subscribers.push(callback);
        return () => {
            this._subscribers = this._subscribers.filter(sub => sub !== callback);
        };
    }

    _notifySubscribers() {
        this._subscribers.forEach(callback => callback(this._state));
    }
}

export const appState = new StateManager();