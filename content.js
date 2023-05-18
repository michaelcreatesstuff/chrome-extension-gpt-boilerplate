chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    const pageContent = document.body.innerText;
    chrome.runtime.sendMessage({
      action: "summarizeContent",
      content: pageContent,
    });
  }
});
