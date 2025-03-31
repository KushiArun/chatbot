const chatLog = document.getElementById("chat-log"),
  userInput = document.getElementById("user-input"),
  sendButton = document.getElementById("send-button"),
  buttonIcon = document.getElementById("button-icon"),
  info = document.querySelector(".info");




const API_KEY = ""; //  Replace with your actual Gemini API Key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  appendMessage("user", message);
  userInput.value = "";

  // Construct API request
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ],
  };

  fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Full API Response:", JSON.stringify(data, null, 2)); // 🔹 Debugging: See full response

      if (
        !data ||
        !data.candidates ||
        !data.candidates[0]?.content?.parts[0]?.text
      ) {
        appendMessage("bot", "Error: No valid response from Gemini API.");
        return;
      }

      const botMessage = data.candidates[0].content.parts[0].text;
      appendMessage("bot", botMessage);
      resetButtonIcon();
    })
    .catch((error) => {
      appendMessage(
        "bot",
        "Error: Something went wrong! Check API key or internet connection."
      );
      console.error("API Error:", error);
      resetButtonIcon();
    });
}

function appendMessage(sender, message) {
  info.style.display = "none";
  buttonIcon.classList.remove("fa-solid", "fa-paper-plane");
  buttonIcon.classList.add("fas", "fa-spinner", "fa-pulse");

  const messageElement = document.createElement("div"),
    iconElement = document.createElement("div"),
    chatElement = document.createElement("div"),
    icon = document.createElement("i");

  chatElement.classList.add("chat-box");
  iconElement.classList.add("icon");
  messageElement.classList.add(sender);
  messageElement.innerText = message;

  icon.classList.add(
    sender === "user" ? "fa-regular" : "fa-solid",
    sender === "user" ? "fa-user" : "fa-robot"
  );
  iconElement.setAttribute("id", sender === "user" ? "user-icon" : "bot-icon");

  iconElement.appendChild(icon);
  chatElement.appendChild(iconElement);
  chatElement.appendChild(messageElement);
  chatLog.appendChild(chatElement);
  chatLog.scrollTo = chatLog.scrollHeight;
}

function resetButtonIcon() {
  buttonIcon.classList.add("fa-solid", "fa-paper-plane");
  buttonIcon.classList.remove("fas", "fa-spinner", "fa-pulse");
}
