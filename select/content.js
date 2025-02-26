console.log("Iam content.js");

const image = document.createElement("img");
image.src =
  "https://res.cloudinary.com/dnj9el5e9/image/upload/v1724610917/axtvcszxb7d6l91wjhqs.png";
image.width = 50;
image.height = 50;
image.style.width = "25px";
image.style.height = "25px";
image.style.backgroundColor = "white";

const element = document.createElement("div");
element.appendChild(image);
element.style.position = "absolute";
element.style.cursor = "pointer";
element.style.display = "none";
element.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
element.style.borderRadius = "50%";
element.style.overflow = "hidden";
element.style.justifyContent = "center";
element.style.alignItems = "center";

document.getElementsByTagName("html")[0].appendChild(element);

element.addEventListener("mousedown", () => {
  element.style.opacity = 0.8;
});
element.addEventListener("mouseup", () => {
  const selection = window.getSelection();

  if (!selection.isCollapsed && selection.toString().trim() !== "") {
    element.style.opacity = 1;
    chrome.runtime.sendMessage(
      { message: selection.toString() },
      (response) => {
        if (!response.message) {
          alert(response.msg);
        }
      }
    );
    window.getSelection().removeAllRanges();
  }
});

const onMouseUp = (event) => {
  const selection = window.getSelection();
  if (!selection.isCollapsed && selection.toString().trim() !== "") {
    element.style.top =
      //   selection.getRangeAt(0).getBoundingClientRect().bottom + 12 + "px";
      event.pageY + 12 + "px";
    element.style.left =
      (selection.getRangeAt(0).getBoundingClientRect().left +
        selection.getRangeAt(0).getBoundingClientRect().right) /
        2 +
      10 +
      "px";
    element.style.display = "flex";
  } else {
    element.style.display = "none";
  }
};

document.addEventListener("mouseup", onMouseUp);
