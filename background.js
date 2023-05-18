chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarizeContent") {
    chrome.storage.sync.get("apiKey", (data) => {
      if (data.apiKey) {
        const apiKey = data.apiKey;

        const apiUrl = "https://api.openai.com/v1/completions";

        const prompt = `Summarize the following text:\n\n${request.content}\n\nSummary:`;

        fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 0.5,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `API request failed with status ${response.status}`
              );
            }
            return response.json();
          })
          .then((data) => {
            if (data.choices && data.choices.length > 0) {
              const summary = data.choices[0].text.trim();
              chrome.runtime.sendMessage({
                action: "apiRequestCompleted",
                success: true,
                summary: summary,
              });
            } else {
              console.error("Error: No summary data received from the API");
              chrome.runtime.sendMessage({
                action: "apiRequestCompleted",
                success: false,
              });
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            chrome.runtime.sendMessage({
              action: "apiRequestCompleted",
              success: false,
            });
          });
      }
    });
  }
});
