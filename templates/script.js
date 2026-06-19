let dropArea = document.getElementById("drop-area");
let imgView = document.getElementById("img-view");
let inputFile = document.getElementById("input-file");
let preview = document.getElementById("preview");
let uploadBtn = document.getElementById("upload");
let status = document.getElementById("status");

let selectedFile = null;

function uploadImage() {
    selectedFile = inputFile.files[0];

    if (!selectedFile) return;

    // Creates an in memory reference to the file
    let fileURL = URL.createObjectURL(selectedFile);

    // Returns what file type the uploaded file is as a string
    fileType = checkFileType(selectedFile);

    // If file type is accepted, this presents the image
    if (fileType == "Not Supported") return;
    if (fileType == "PDF") {
        imgView.style.backgroundImage = "";
        preview.innerHTML = `
            <iframe 
                src="${fileURL}" 
                width="100%" 
                height="600px">
            </iframe>`;
    }
    else if (fileType == "img") {
        preview.innerHTML = "";
        imgView.style.backgroundImage = `url(${fileURL})`;
    }
    status.textContent = `Selected: ${selectedFile.name}`;
}

// Used to return what type of file a file is
function checkFileType(file) {
    if (file.type === "application/pdf") {
        console.log("This is a PDF");
        return "PDF";
    } else if (file.type.startsWith("image/")) {
        console.log("This is an image");
        return "img";
    } else {
        console.log("Unsupported file type");
        return "Not Supported";
    }
}

inputFile.addEventListener("change", uploadImage);

uploadBtn.addEventListener("click", async () => {
    // Makes sure a document has been given
    if (!selectedFile) {
        status.textContent = "Please choose a file first.";
        console.log("A file hasn't been chosen, so there is nothing to upload.")
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    status.textContent = "Uploading...";

    try {
        const response = await fetch("http://localhost:8000/documents/upload", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const result = await response.json();

        status.textContent = `Uploaded successfully. Document ID: ${result.document_id}`;
    } catch (error) {
        console.error(error);
        status.textContent = "Upload failed.";
    }
});