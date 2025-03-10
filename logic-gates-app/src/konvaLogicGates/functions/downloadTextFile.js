const handleDownload = (textContent) => {
    if (!textContent) {
        alert('There is no text to be downloaded');
        return; // Stop execution if textContent is empty
    }

    // Create a Blob object with the text content
    const blob = new Blob([textContent], { type: "text/plain" });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor (<a>) element for downloading
    const a = document.createElement("a");
    a.href = url;
    a.download = "Samplefile.txt"; // Set the filename

    // Simulate a click event to trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export default handleDownload;
