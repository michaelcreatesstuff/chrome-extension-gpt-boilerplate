const summarizeBtn = document.getElementById("summarizeBtn");
const spinner = document.getElementById("spinner");
const summaryContainer = document.getElementById("summaryContainer");
const summaryContent = document.getElementById("summaryContent");

summarizeBtn.addEventListener("click", () => {
  spinner.style.display = "inline-block";
  summarizeBtn.disabled = true;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "summarize" });
  });
});

// Save API key and show main content
document.getElementById("saveApiKey").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value;
  if (apiKey) {
    chrome.storage.sync.set({ apiKey }, () => {
      showMainContent();
    });
  }
});

// Show main content and hide API key input
function showMainContent() {
  document.getElementById("apiKeyInput").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}

// Load the saved API key and show main content if API key exists
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("apiKey", (data) => {
    if (data.apiKey) {
      showMainContent();
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "apiRequestCompleted") {
    spinner.style.display = "none";
    if (request.success) {
      summarizeBtn.disabled = false;
      summaryContent.textContent = request.summary;
      summaryContainer.style.display = "block";
      setTimeout(() => {
        summaryContainer.style.opacity = "1";
      }, 100);
    } else {
      summarizeBtn.disabled = false;
    }
  }
});
