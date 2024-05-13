document.addEventListener("DOMContentLoaded", function() {
    const whiteInput = document.getElementById("whiteInput");
    const blackInput = document.getElementById("blackInput");
    const convertButton = document.getElementById("convertButton");
    const whitePreview = document.getElementById("whitePreview");
    const blackPreview = document.getElementById("blackPreview");
    const resultPreview = document.getElementById("resultPreview");

    let whiteImage = null;
    let blackImage = null;

    // Function to handle image file selection
    function handleFileSelect(event, imageType) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
                if (imageType === "white") {
                    whiteImage = img;
                    whitePreview.innerHTML = "";
                    whitePreview.appendChild(img);
                } else if (imageType === "black") {
                    blackImage = img;
                    blackPreview.innerHTML = "";
                    blackPreview.appendChild(img);
                }
            };
        };

        reader.readAsDataURL(file);
    }

    // Event listener for white image input
    whiteInput.addEventListener("change", function(event) {
        handleFileSelect(event, "white");
    });

    // Event listener for black image input
    blackInput.addEventListener("change", function(event) {
        handleFileSelect(event, "black");
    });

    // Function to convert images and display result
    function convertImages() {
        if (!whiteImage || !blackImage) {
            alert("Please select both white and black screenshots.");
            return;
        }

        // Create canvas elements
        const whiteCanvas = document.createElement("canvas");
        const blackCanvas = document.createElement("canvas");
        const resultCanvas = document.createElement("canvas");
        const ctxResult = resultCanvas.getContext("2d");

        // Set canvas dimensions to match image dimensions
        whiteCanvas.width = whiteImage.width;
        whiteCanvas.height = whiteImage.height;
        blackCanvas.width = blackImage.width;
        blackCanvas.height = blackImage.height;
        resultCanvas.width = whiteImage.width;
        resultCanvas.height = whiteImage.height;

        // Draw images onto canvases
        const ctxWhite = whiteCanvas.getContext("2d");
        const ctxBlack = blackCanvas.getContext("2d");
        ctxWhite.drawImage(whiteImage, 0, 0);
        ctxBlack.drawImage(blackImage, 0, 0);

        // Get image data
        const whiteImageData = ctxWhite.getImageData(0, 0, whiteCanvas.width, whiteCanvas.height);
        const blackImageData = ctxBlack.getImageData(0, 0, blackCanvas.width, blackCanvas.height);

        // Process images to create transparent screenshot
        const resultImageData = differentiateAlpha(whiteImageData, blackImageData);
        ctxResult.putImageData(resultImageData, 0, 0);

        // Display result canvas
        resultPreview.innerHTML = "";
        resultPreview.appendChild(resultCanvas);
    }

    // Function to differentiate alpha and create transparent screenshot
    function differentiateAlpha(whiteImageData, blackImageData) {
        // Create a new ImageData object to store the result
        const resultImageData = new ImageData(whiteImageData.width, whiteImageData.height);

        // Loop through pixels
        for (let i = 0; i < whiteImageData.data.length; i += 4) {
            // Calculate alpha value
            const alpha = (255 - (whiteImageData.data[i] + whiteImageData.data[i + 1] + whiteImageData.data[i + 2]) / 3) +
                (blackImageData.data[i] + blackImageData.data[i + 1] + blackImageData.data[i + 2]) / 3;

            // Set alpha value in result image data
            resultImageData.data[i + 3] = alpha;

            // Calculate RGB values
            const red = alpha > 0 ? (255 * (blackImageData.data[i] / alpha)) : 0;
            const green = alpha > 0 ? (255 * (blackImageData.data[i + 1] / alpha)) : 0;
            const blue = alpha > 0 ? (255 * (blackImageData.data[i + 2] / alpha)) : 0;

            // Set RGB values in result image data
            resultImageData.data[i] = red;
            resultImageData.data[i + 1] = green;
            resultImageData.data[i + 2] = blue;
        }

        return resultImageData;
    }

    // Event listener for convert button
    convertButton.addEventListener("click", convertImages);
});