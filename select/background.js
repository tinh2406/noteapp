console.log("Iam background.js");
let phone;
// const URL_STRING = "http://localhost:10002";
const URL_STRING = "http://nguyeqoctih.id.vn:10002";

chrome.storage.local.get("phone", (data) => {
  phone = data.phone;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.phone) {
    chrome.storage.local.set({ phone: request.phone });

    phone = request.phone;
    return;
  }

  chrome.storage.local.get("phone", (data) => {
    phone = data.phone;
    if (!phone) {
      sendResponse({ message: false, msg: "You must login to save data" });
      return;
    }

    const message = request.message;
    sendRequest(message, sendResponse);
  });
});

const sendRequest = (message, sendResponse) => {
  fetch(`${URL_STRING}/save`, {
    method: "POST",

    body: JSON.stringify({ message }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      phone,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      sendResponse({ message: true });
    })
    .catch((error) => {
      sendResponse({ message: false });
    });
};
