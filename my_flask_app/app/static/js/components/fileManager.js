import {appState} from '../stateManager.js';
import { svgIcons } from '../config/svgIcons.js';

function toggleButton(type, currentAction) {
    const button = document.getElementById(type + "FileButton");
    
    if (!button) return;

    button.replaceWith(button.cloneNode(true));
    const newButton = document.getElementById(type + "FileButton");
    
    if (currentAction === 'remove') {
        newButton.innerHTML = svgIcons.folderPlus;
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileManager.addFile(type);
        });
    } else {
        newButton.innerHTML = svgIcons.trash;
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileManager.removeFile(type);
        });
    }
    

}


export const fileManager = {
    addFile(type) {
        let fileInput = document.getElementById(type + "HiddenFileInput");
        const linkInput = document.getElementById(type + "Link");
        
        if (!fileInput) {
            fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = type === 'video' ? "video/*" : "audio/*";
            fileInput.id = type + "HiddenFileInput";
            fileInput.style.display = "none";
            
            fileInput.addEventListener("change", function() {
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    appState.updateMedia(`${type}File`, file);
                    appState.updateMedia(`${type}Link`, '');
                    
                    if (linkInput) {
                        linkInput.value = file.name;
                        linkInput.setAttribute('readonly', '');
                        linkInput.setAttribute('data-has-file', 'true');
                    }
                    toggleButton(type, 'add');
                }
            });
            document.body.appendChild(fileInput);
        }
        fileInput.click();
    },

    removeFile(type) {
        const fileInput = document.getElementById(type + "HiddenFileInput");
        const linkInput = document.getElementById(type + "Link");
        
        if (fileInput) {
            fileInput.remove();
        }
        
        if (linkInput) {
            linkInput.value = '';
            linkInput.removeAttribute('readonly');
            linkInput.removeAttribute('data-has-file', 'true');

        }
        
        appState.updateMedia(`${type}File`, null);
        toggleButton(type, 'remove');
    }
};