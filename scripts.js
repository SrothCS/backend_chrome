document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const contentDisplay = document.getElementById("content-display");
    const titleElement = document.querySelector(".content-title");
    const bodyElement = document.querySelector(".content-body");
    const readButton = document.getElementById("read-button");
    const repeatButton = document.getElementById("repeat-button");
    const aslDisplay = document.getElementById("asl-display");
    const aslImageContainer = document.getElementById("asl-image-container");

    let currentText = "";

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "displayPageInfo") {
            if (message.data && message.data.title && message.data.content) {
                loadingScreen.style.display = "none";
                titleElement.textContent = message.data.title;
                bodyElement.textContent = message.data.content;
                currentText = message.data.content.replace(/\s+/g, ' ').trim();

                contentDisplay.style.display = "block";
                readButton.style.display = "block";
            } else {
                loadingScreen.style.display = "flex";
                contentDisplay.style.display = "none";
            }
        }
    });

    async function fetchASLImage(character) {
        try {
            const response = await fetch("https://marinahhackscharacterslapi-production.up.railway.app/get-asl-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ character })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch ASL image");
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("Error fetching ASL image:", error);
            throw error;
        }
    }

    async function displayASLCharacters(text) {
        aslDisplay.style.display = "block";
        aslImageContainer.innerHTML = ""; // Clear previous images

        for (const char of text) {
            if (!/[a-zA-Z ]/.test(char)) continue;

            try {
                const imageUrl = await fetchASLImage(char.toLowerCase());
                const imgElement = document.createElement("img");
                imgElement.src = imageUrl;
                imgElement.alt = char;
                imgElement.style.width = "100px"; // Adjust as needed

                const charLabel = document.createElement("p");
                charLabel.textContent = char.toUpperCase();
                charLabel.style.color = "white";

                aslImageContainer.innerHTML = ""; // Clear previous character
                aslImageContainer.appendChild(imgElement);
                aslImageContainer.appendChild(charLabel);

                await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
            } catch (error) {
                console.error("Failed to display ASL character:", char, error);
            }
        }

        aslDisplay.style.display = "none";
        readButton.style.display = "none";
        repeatButton.style.display = "block";
    }

    // Event listener for the "Read" button
    readButton.addEventListener("click", () => {
        readButton.style.display = "none";
        displayASLCharacters(currentText);
    });

    // Event listener for the "Repeat" button
    repeatButton.addEventListener("click", () => {
        repeatButton.style.display = "none";
        displayASLCharacters(currentText);
    });
});
