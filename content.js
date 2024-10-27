// content.js
function getArticleContent() {
    const title = document.querySelector('h1') ? document.querySelector('h1').innerText : "No title found";
    const paragraphs = Array.from(document.querySelectorAll('p'))
        .map(p => p.innerText)
        .filter(text => text.trim().length > 0); // Collect and filter paragraphs

    return {
        title: title,
        content: paragraphs.join('\n\n')
    };
}

// Send the gathered content to background.js
chrome.runtime.sendMessage({
    action: "sendPageInfo",
    data: getArticleContent()
});
