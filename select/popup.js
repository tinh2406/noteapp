////// Cache
let phone = localStorage.getItem("phone");

// const URL_STRING = "http://localhost:10002";
const URL_STRING = "http://nguyeqoctih.id.vn:10002";

let data = [];
let meta = { page: 1, take: 5 };
let newData = [];

try {
  data = JSON.parse(localStorage.getItem("data"));
  newData = data;
} catch (error) {}

//////////////
const unloggined = document.createElement("div");
///////////
const loggined = document.createElement("div");
////////
const latestText = document.createElement("h3");
latestText.textContent = "Latest text";
latestText.classList.add("latest-text");
const empty = document.createElement("p");
empty.textContent = "No data";
empty.classList.add("empty");
let list = document.createElement("ul");
list.classList.add("list");
list.appendChild(latestText);
uploadList();

/////////
const loadmore = document.createElement("button");
loadmore.textContent = "Load more";
loadmore.classList.add("loadmore");
loadmore.addEventListener("click", () => {
  list.removeChild(loadmore);

  fetchTexts().then(() => {
    uploadList();
  });
});

(() => {
  const title = document.createElement("h2");
  title.textContent = "Type your phone number";
  title.classList.add("title");

  const input = document.createElement("input");
  input.type = "phone";
  input.placeholder = "Phone number";
  input.classList.add("input");

  const warm = document.createElement("p");
  warm.textContent = "Please type your phone number";
  warm.classList.add("warm");
  warm.style.display = "none";

  const button = document.createElement("button");
  button.textContent = "Login";
  button.classList.add("btn-login");
  button.onclick = () => {
    ////check phone number with regex
    if (!/^\d{10}$/.test(input.value)) {
      warm.style.display = "block";
      return;
    }
    warm.style.display = "none";
    fetch(URL_STRING, {
      method: "POST",
      body: JSON.stringify({ phone: input.value }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (res.message) {
          phone = input.value;
          localStorage.setItem("phone", input.value);

          unloggined.remove();
          document.body.appendChild(loggined);

          chrome.runtime.sendMessage({ phone });

          fetchTexts().then(() => {
            console.log(data);
            uploadList();
          });
        }
      })
      .catch((error) => {});
  };
  unloggined.appendChild(title);
  unloggined.appendChild(input);
  unloggined.appendChild(warm);
  unloggined.appendChild(button);
})();

function itemFactory({ _id, text }) {
  const textElement = document.createElement("p");
  textElement.classList.add("txt");
  textElement.textContent = text;
  const btn = document.createElement("button");
  btn.classList.add("btn");
  btn.textContent = "Delete";

  btn.onclick = () => {
    item.style.display = "none";
    if (data.length === 1) {
      list.appendChild(empty);
    }
    meta.page--;
    deleteText(_id)
      .then((res) => {
        if (res.message) {
          fetchTexts().then(() => {
            uploadList();
          });
        } else {
          item.style.display = "block";
          item.style.color = "red";
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          item.remove();
          data = data.filter((item) => item._id !== _id);
          uploadList();
        } else {
          item.style.display = "block";
          item.style.color = "red";
        }
      });
  };

  const item = document.createElement("li");
  item.classList.add("item");

  item.appendChild(textElement);
  item.appendChild(btn);

  return item;
}

(() => {
  const title = document.createElement("h2");
  title.textContent = "Select text you want to save";
  title.classList.add("title");

  loggined.appendChild(title);
  loggined.appendChild(list);
})();

async function fetchTexts() {
  const response = await fetch(
    `${URL_STRING}/?page=${meta?.page}&take=${meta?.take}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        phone: phone,
      },
    }
  );
  const _data = await response.json();

  meta = _data.meta;
  if (meta.page === 1) {
    data = _data.data;

    for (let i = list.children.length - 1; i >= 0; i--) {
      if (list.children[i] === empty) break;
      if (list.children[i] === latestText) continue;
      list.children[i].remove();
    }
    if (data.length > 0) {
      empty.remove();
    }
    for (let i = 0; i < data.length; i++) {
      const newItem = itemFactory(data[i]);
      list.appendChild(newItem);
    }
    newData = [];

    localStorage.setItem("data", JSON.stringify(data.slice(0, 5)));
    if (data.length < 5) {
      meta.hasNextPage = false;
      meta.page = 1;
    } else {
      meta.page++;
    }
  } else {
    const lastId = data[data.length - 1]?._id;
    const index = _data.data.findIndex((item) => item._id === lastId);
    newData = _data.data.slice(index + 1);
    data = [...data, ...newData];

    meta.page++;
  }
}
async function deleteText(id) {
  const response = await fetch(`${URL_STRING}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      phone: phone,
    },
  });
  const _data = await response.json();
  return _data;
}
function uploadList() {
  if (!data || data.length === 0) {
    for (let i = 0; i < list.children.length; i++) {
      if (list.children[i] === empty) return;
    }
    list.appendChild(empty);
    return;
  }

  empty.remove();
  newData.forEach((item) => {
    const newItem = itemFactory(item);
    list.appendChild(newItem);
  });
  newData = [];

  if (meta.hasNextPage) {
    list.appendChild(loadmore);
  }
}
function main() {
  if (!phone) {
    document.body.appendChild(unloggined);
  } else {
    chrome.runtime.sendMessage({ phone });

    fetchTexts().then(() => {
      uploadList();
    });
    document.body.appendChild(loggined);
  }
}

main();
