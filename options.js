document.getElementById("saveApiKey").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value;
  if (apiKey) {
    chrome.storage.sync.set({ apiKey }, () => {
      window.close();
    });
  }
});

// Load the saved API key when the options page is opened
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("apiKey", (data) => {
    if (data.apiKey) {
      document.getElementById("apiKey").value = data.apiKey;
    }
  });
});
