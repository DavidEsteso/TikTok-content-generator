
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                             <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>
                    </div>
                `;
                details.style.display = "none";
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
    details.style.display = "block";
}
