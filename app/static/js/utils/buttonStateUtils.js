export const setButtonState = (button, state) => {
    if (!button) return;
    
    button.disabled = !state;
    button.style.opacity = state ? 1 : 0.3;
    button.style.cursor = state ? 'pointer' : 'not-allowed';
    button.style.pointerEvents = state ? 'auto' : 'none';
};